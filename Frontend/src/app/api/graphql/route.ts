import { NextRequest, NextResponse } from 'next/server';
import { buildSchema, graphql } from 'graphql';
import { mockSubgraphData } from '../subgraph/[userId]/[dbId]/mockData';

// This is a server-side API route that processes GraphQL queries
export async function POST(request: NextRequest) {
  try {
    const { query, variables, subgraphData } = await request.json();
    
    // Use provided subgraph data or fallback to mock data
    const data = subgraphData || mockSubgraphData;
    
    // Generate a schema from the data
    const schema = generateSchemaFromData(data);
    
    // Generate resolvers from the data
    const rootValue = generateResolvers(data);
    
    // Execute the query
    const result = await graphql({
      schema,
      source: query,
      rootValue,
      variableValues: variables,
    });
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error processing GraphQL query:', error);
    return NextResponse.json(
      { 
        errors: [
          { message: 'Error processing GraphQL query: ' + (error instanceof Error ? error.message : String(error)) }
        ] 
      }, 
      { status: 500 }
    );
  }
}

// Track generated types to avoid duplicates
const generatedTypes = new Set<string>();
const relationshipTypeMap = new Map<string, string>();

// Generate GraphQL schema from JSON data
function generateSchemaFromData(data: any): any {
  try {
    // Reset type tracking for each schema generation
    generatedTypes.clear();
    relationshipTypeMap.clear();
    
    // First pass: identify and map nested object types
    identifyNestedTypes(data);
    
    // Extract top-level properties to create GraphQL types
    const typeDefinitions: string[] = [];
    const queryFields: string[] = [];
    
    // Process each top-level property in the JSON data
    Object.keys(data).forEach(key => {
      // Skip processing if the value is null or undefined
      if (data[key] === null || data[key] === undefined) return;
      
      if (Array.isArray(data[key])) {
        // Handle arrays - create a type for array items
        const firstItem = data[key][0];
        if (firstItem && typeof firstItem === 'object') {
          // Create a type for this array item
          const typeName = capitalizeFirstLetter(singularize(key));
          
          // Add to set of generated types to avoid duplicates
          if (!generatedTypes.has(typeName)) {
            generatedTypes.add(typeName);
            const fields = getFieldDefinitionsFromObject(firstItem, typeName);
            
            typeDefinitions.push(`
              type ${typeName} {
                ${fields.join('\n                ')}
              }
            `);
          }
          
          // Add a query field for this array
          queryFields.push(`${key}(first: Int, skip: Int): [${typeName}!]!`);
        } else {
          // Simple array of scalars
          const scalarType = getScalarType(firstItem);
          queryFields.push(`${key}: [${scalarType}!]!`);
        }
      } else if (typeof data[key] === 'object' && data[key] !== null) {
        // Handle objects - create a type
        const typeName = capitalizeFirstLetter(key);
        
        // Add to set of generated types to avoid duplicates
        if (!generatedTypes.has(typeName)) {
          generatedTypes.add(typeName);
          const fields = getFieldDefinitionsFromObject(data[key], typeName);
          
          typeDefinitions.push(`
            type ${typeName} {
              ${fields.join('\n              ')}
            }
          `);
        }
        
        // Add a query field for this object
        queryFields.push(`${key}: ${typeName}!`);
      } else {
        // Handle scalar fields
        const scalarType = getScalarType(data[key]);
        queryFields.push(`${key}: ${scalarType}!`);
      }
    });
    
    // Process all accumulated nested types
    for (const [path, typeInfo] of relationshipTypeMap.entries()) {
      const [typeName, obj] = JSON.parse(typeInfo);
      
      // Only add each type once
      if (!generatedTypes.has(typeName)) {
        generatedTypes.add(typeName);
        const fields = getFieldDefinitionsFromObject(obj, typeName);
        
        typeDefinitions.push(`
          type ${typeName} {
            ${fields.join('\n            ')}
          }
        `);
      }
    }
    
    // Create the schema SDL
    const schemaSDL = `
      ${typeDefinitions.join('\n')}
      
      type Query {
        ${queryFields.join('\n        ')}
      }
    `;
    
    console.log('Generated schema types:', Array.from(generatedTypes));
    
    // Build the schema
    return buildSchema(schemaSDL);
  } catch (error) {
    console.error('Error building GraphQL schema:', error);
    // Fallback to a simple schema
    return buildSchema(`
      type Query {
        data: JSON
      }
      scalar JSON
    `);
  }
}

// First pass to identify all nested object types
function identifyNestedTypes(data: any, path: string = 'root') {
  if (!data || typeof data !== 'object') return;
  
  if (Array.isArray(data)) {
    // For arrays, check the first item
    if (data.length > 0 && typeof data[0] === 'object' && data[0] !== null) {
      // Generate a type name based on path
      const pathParts = path.split('.');
      const typeName = capitalizeFirstLetter(singularize(pathParts[pathParts.length - 1]));
      identifyNestedTypes(data[0], path);
    }
  } else {
    // For objects, check each property
    Object.keys(data).forEach(key => {
      const value = data[key];
      
      if (value === null || value === undefined) {
        return;
      }
      
      const newPath = path === 'root' ? key : `${path}.${key}`;
      
      if (Array.isArray(value)) {
        // For nested arrays of objects
        if (value.length > 0 && typeof value[0] === 'object' && value[0] !== null) {
          const typeName = capitalizeFirstLetter(singularize(key));
          relationshipTypeMap.set(newPath, JSON.stringify([typeName, value[0]]));
          identifyNestedTypes(value[0], newPath);
        }
      } else if (typeof value === 'object') {
        // For nested objects
        const typeName = capitalizeFirstLetter(key);
        relationshipTypeMap.set(newPath, JSON.stringify([typeName, value]));
        identifyNestedTypes(value, newPath);
      }
    });
  }
}

// Get GraphQL field definitions from a JavaScript object
function getFieldDefinitionsFromObject(obj: any, parentTypeName: string = ''): string[] {
  if (!obj || typeof obj !== 'object') return [];
  
  return Object.keys(obj).map(key => {
    const value = obj[key];
    
    if (value === null || value === undefined) {
      // Handle null values - assume String type
      return `${key}: String`;
    } else if (Array.isArray(value)) {
      // Handle arrays
      if (value.length > 0 && typeof value[0] === 'object' && value[0] !== null) {
        // Array of objects - reference a type
        // Use a type name that includes parent context
        const typeName = capitalizeFirstLetter(singularize(key));
        
        // Store this relationship type if not already stored
        const path = parentTypeName ? `${parentTypeName}.${key}` : key;
        if (!relationshipTypeMap.has(path)) {
          relationshipTypeMap.set(path, JSON.stringify([typeName, value[0]]));
        }
        
        return `${key}: [${typeName}!]!`;
      } else {
        // Array of scalars
        const scalarType = value.length > 0 ? getScalarType(value[0]) : 'String';
        return `${key}: [${scalarType}!]!`;
      }
    } else if (typeof value === 'object') {
      // Handle nested objects - reference a type
      // Use a type name that includes parent context
      const typeName = capitalizeFirstLetter(key);
      
      // Store this relationship type if not already stored
      const path = parentTypeName ? `${parentTypeName}.${key}` : key;
      if (!relationshipTypeMap.has(path)) {
        relationshipTypeMap.set(path, JSON.stringify([typeName, value]));
      }
      
      return `${key}: ${typeName}!`;
    } else {
      // Handle scalar values
      const scalarType = getScalarType(value);
      return `${key}: ${scalarType}!`;
    }
  });
}

// Get the appropriate GraphQL scalar type for a JavaScript value
function getScalarType(value: any): string {
  switch (typeof value) {
    case 'string':
      return 'String';
    case 'number':
      return Number.isInteger(value) ? 'Int' : 'Float';
    case 'boolean':
      return 'Boolean';
    default:
      return 'String';
  }
}

// Helper function to capitalize the first letter of a string
function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Helper function to convert a plural word to singular (simplified)
function singularize(word: string): string {
  // This is a simplified singularization
  if (word.endsWith('ies')) {
    return word.slice(0, -3) + 'y';
  } else if (word.endsWith('s') && !word.endsWith('ss')) {
    return word.slice(0, -1);
  }
  return word;
}

// Generate resolvers based on the data
function generateResolvers(data: any): Record<string, any> {
  const resolvers: Record<string, any> = {};
  
  // For each top-level field, create a resolver
  Object.keys(data).forEach(key => {
    if (Array.isArray(data[key])) {
      // For array fields, handle pagination arguments
      resolvers[key] = (args: any) => {
        let result = [...data[key]];
        
        // Handle 'first' argument (limit)
        if (args.first !== undefined && args.first >= 0) {
          result = result.slice(0, args.first);
        }
        
        // Handle 'skip' argument (offset)
        if (args.skip !== undefined && args.skip >= 0) {
          result = result.slice(args.skip);
        }
        
        return result;
      };
    } else {
      // For scalar and object fields, return the data directly
      resolvers[key] = () => data[key];
    }
  });
  
  return resolvers;
} 