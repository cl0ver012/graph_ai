import { graphql, buildSchema, GraphQLSchema } from 'graphql';

/**
 * Client-side GraphQL service that processes queries against downloaded JSON data
 */
class GraphQLService {
  private schema: GraphQLSchema | null = null;
  private data: any = null;
  private generatedTypes = new Set<string>();
  private relationshipTypeMap = new Map<string, string>();
  
  /**
   * Initialize the GraphQL service with JSON data from subgraph API
   * @param jsonData The JSON data downloaded from the subgraph API
   */
  public initializeWithData(jsonData: any): void {
    this.data = jsonData;
    
    // Build a schema based on the structure of the JSON data
    // This is a simplified approach - in a production environment,
    // you would want to build a more comprehensive schema based on the data types
    this.buildSchemaFromData(jsonData);
  }
  
  /**
   * Get the currently loaded data
   * @returns The current data or null if not initialized
   */
  public getData(): any {
    return this.data;
  }
  
  /**
   * Build a GraphQL schema based on the structure of the provided JSON data
   */
  private buildSchemaFromData(data: any): void {
    try {
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
            const typeName = this.capitalizeFirstLetter(this.singularize(key));
            const fields = this.getFieldDefinitionsFromObject(firstItem);
            
            typeDefinitions.push(`
              type ${typeName} {
                ${fields.join('\n                ')}
              }
            `);
            
            // Add a query field for this array
            queryFields.push(`${key}(first: Int, skip: Int): [${typeName}!]!`);
          } else {
            // Simple array of scalars
            const scalarType = this.getScalarType(firstItem);
            queryFields.push(`${key}: [${scalarType}!]!`);
          }
        } else if (typeof data[key] === 'object' && data[key] !== null) {
          // Handle objects - create a type
          const typeName = this.capitalizeFirstLetter(key);
          const fields = this.getFieldDefinitionsFromObject(data[key]);
          
          typeDefinitions.push(`
            type ${typeName} {
              ${fields.join('\n              ')}
            }
          `);
          
          // Add a query field for this object
          queryFields.push(`${key}: ${typeName}!`);
        } else {
          // Handle scalar fields
          const scalarType = this.getScalarType(data[key]);
          queryFields.push(`${key}: ${scalarType}!`);
        }
      });
      
      // Create the schema SDL
      const schemaSDL = `
        ${typeDefinitions.join('\n')}
        
        type Query {
          ${queryFields.join('\n          ')}
        }
      `;
      
      // Build the schema
      this.schema = buildSchema(schemaSDL);
      console.log('Generated GraphQL schema:', schemaSDL);
    } catch (error) {
      console.error('Error building GraphQL schema:', error);
      // Fallback to a simple schema
      this.createFallbackSchema();
    }
  }
  
  /**
   * Create a fallback schema if dynamic schema generation fails
   */
  private createFallbackSchema(): void {
    const schemaSDL = `
      type Query {
        data: JSON
      }
      scalar JSON
    `;
    
    this.schema = buildSchema(schemaSDL);
  }
  
  /**
   * Get GraphQL field definitions from a JavaScript object
   */
  private getFieldDefinitionsFromObject(obj: any): string[] {
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
          const typeName = this.capitalizeFirstLetter(this.singularize(key));
          return `${key}: [${typeName}!]!`;
        } else {
          // Array of scalars
          const scalarType = value.length > 0 ? this.getScalarType(value[0]) : 'String';
          return `${key}: [${scalarType}!]!`;
        }
      } else if (typeof value === 'object') {
        // Handle nested objects - reference a type
        const typeName = this.capitalizeFirstLetter(key);
        return `${key}: ${typeName}!`;
      } else {
        // Handle scalar values
        const scalarType = this.getScalarType(value);
        return `${key}: ${scalarType}!`;
      }
    });
  }
  
  /**
   * Get the appropriate GraphQL scalar type for a JavaScript value
   */
  private getScalarType(value: any): string {
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
  
  /**
   * Helper function to capitalize the first letter of a string
   */
  private capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  
  /**
   * Helper function to convert a plural word to singular (simplified)
   */
  private singularize(word: string): string {
    // This is a simplified singularization - in a production environment,
    // you would want to use a more comprehensive pluralization library
    if (word.endsWith('ies')) {
      return word.slice(0, -3) + 'y';
    } else if (word.endsWith('s') && !word.endsWith('ss')) {
      return word.slice(0, -1);
    }
    return word;
  }
  
  /**
   * Execute a GraphQL query against the downloaded data
   */
  public async executeQuery(query: string, variables?: Record<string, any>): Promise<any> {
    if (!this.schema || !this.data) {
      throw new Error('GraphQL service not initialized. Call initializeWithData first.');
    }
    
    try {
      // Create a resolver for each field in the Query type
      const rootValue = this.createResolvers(this.data);
      
      // Execute the query
      const result = await graphql({
        schema: this.schema,
        source: query,
        rootValue,
        variableValues: variables,
      });
      
      return result;
    } catch (error) {
      console.error('Error executing GraphQL query:', error);
      return { errors: [{ message: 'Error executing query: ' + (error as Error).message }] };
    }
  }
  
  /**
   * Create resolvers based on the data
   */
  private createResolvers(data: any): Record<string, any> {
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
}

// Export as singleton
const graphQLService = new GraphQLService();
export default graphQLService; 