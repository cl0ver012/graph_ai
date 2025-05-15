import React, { useEffect, useState } from 'react';
import { Editor, loader } from '@monaco-editor/react';
import { Play } from 'lucide-react';
import graphQLService from '@/services/GraphQLService';

// Define interface for component props
interface GraphQLPlaygroundProps {
  endpoint: string; // API endpoint to download index data from
  initialQuery?: string;
  height?: string;
  userId?: string;
  dbId?: string;
}

// GraphQL Playground Component
const GraphQLPlayground: React.FC<GraphQLPlaygroundProps> = ({
  endpoint,
  initialQuery = `{
  factories(first: 5) {
    id
    poolCount
    txCount
    totalVolumeUSD
  }
  bundles(first: 5) {
    id
    maticPriceUSD
  }
}`,
  height = "400px",
  userId,
  dbId
}) => {
  const [query, setQuery] = useState<string>(initialQuery);
  const [result, setResult] = useState<string>("{}");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);
  // Default to dark theme for this app
  const [theme, setTheme] = useState<'vs-dark' | 'light'>('vs-dark');
  
  // Initialize Monaco before anything else
  useEffect(() => {
    // Set Monaco CDN path
    loader.config({
      paths: {
        vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs',
      },
    });

    // Configure Monaco environment for workers
    if (typeof window !== 'undefined') {
      window.MonacoEnvironment = {
        getWorkerUrl: function (_moduleId: any, label: string) {
          if (label === 'json') {
            return `https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs/language/json/json.worker.js`;
          }
          if (label === 'graphql' || label === 'graphqlDev') {
            return `https://cdn.jsdelivr.net/npm/monaco-graphql@1.3.0/dist/graphql.worker.js`;
          }
          return `https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs/editor/editor.worker.js`;
        }
      };
    }
  }, []);

  // Download index data when endpoint, userId, or dbId changes
  useEffect(() => {
    const fetchIndexData = async () => {
      if (!endpoint) {
        setResult(JSON.stringify({ error: 'No endpoint provided' }, null, 2));
        return;
      }
      
      try {
        setIsLoading(true);
        setResult(JSON.stringify({ message: 'Loading index data...' }, null, 2));
        
        // Extract user_id and db_id from the endpoint or use provided values
        const parts = endpoint.split('/');
        const actualUserId = userId || (parts.length >= 2 ? parts[parts.length - 2] : null);
        const actualDbId = dbId || (parts.length >= 1 ? parts[parts.length - 1] : null);
        
        if (!actualUserId || !actualDbId) {
          throw new Error('Could not extract user ID and DB ID from endpoint');
        }
        
        // Construct the API URL to fetch the index data
        const apiURL = `${window.location.origin}/api/subgraph/${actualUserId}/${actualDbId}`;
        
        console.log(`Fetching index data from: ${apiURL}`);
        const response = await fetch(apiURL, {
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch index data: ${response.status} ${response.statusText}`);
        }
        
        const indexData = await response.json();
        console.log('Index data loaded:', indexData);
        
        // Initialize the GraphQL service with the downloaded data
        graphQLService.initializeWithData(indexData);
        setIsDataLoaded(true);
        
        // Update initial query based on the data structure
        updateInitialQueryFromData(indexData);
        
        // Display successful message
        setResult(JSON.stringify({ message: 'Index data loaded successfully. Ready to execute queries.' }, null, 2));
      } catch (error) {
        console.error('Error loading index data:', error);
        setResult(JSON.stringify({ 
          error: 'Failed to load index data',
          message: error instanceof Error ? error.message : String(error)
        }, null, 2));
      } finally {
        setIsLoading(false);
      }
    };

    fetchIndexData();
  }, [endpoint, userId, dbId]);

  // Function to generate a sample query based on the actual data structure
  const updateInitialQueryFromData = (data: any) => {
    if (!data) return;
    
    try {
      // Find first array field with objects to use as example
      const arrayFields = Object.keys(data).filter(key => 
        Array.isArray(data[key]) && data[key].length > 0 && typeof data[key][0] === 'object'
      );
      
      if (arrayFields.length === 0) return;
      
      // Take the first array field
      const firstArrayField = arrayFields[0];
      const firstItem = data[firstArrayField][0];
      
      // Get top-level fields from the first item
      const itemFields = Object.keys(firstItem)
        .filter(field => typeof firstItem[field] !== 'object' || firstItem[field] === null)
        .slice(0, 5)  // Limit to first 5 fields for simplicity
        .join('\n    ');
      
      // Generate a new query
      const newQuery = `{
  ${firstArrayField}(first: 5) {
    ${itemFields}
  }
}`;
      
      setQuery(newQuery);
    } catch (error) {
      console.error('Error generating sample query:', error);
      // Keep the default query
    }
  };

  // Function to execute GraphQL query
  const executeQuery = async () => {
    if (!isDataLoaded) {
      setResult(JSON.stringify({ error: 'Index data not yet loaded' }, null, 2));
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Use the server-side API route for query execution
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          subgraphData: graphQLService.getData() // Get current data from service
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to execute query: ${response.status} ${response.statusText}`);
      }
      
      const queryResult = await response.json();
      setResult(JSON.stringify(queryResult, null, 2));
    } catch (error) {
      console.error('Error executing GraphQL query:', error);
      setResult(JSON.stringify({ 
        error: 'Failed to execute query',
        message: error instanceof Error ? error.message : String(error)
      }, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle editor initialization
  const handleQueryEditorDidMount = (editor: any) => {
    // Additional editor setup can go here
  };
  
  // Handle editor initialization for results
  const handleResultEditorDidMount = (editor: any) => {
    // Additional result editor setup can go here
  };

  return (
    <div className="graphql-playground bg-[#0D0D0D] rounded-lg overflow-hidden">
      <div className="graphql-playground-header flex justify-between items-center p-3 bg-[#1E1E1E] text-white">
        <span>GraphQL Playground</span>
        <button
          onClick={executeQuery}
          disabled={isLoading || !isDataLoaded}
          className="execute-button bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center space-x-2"
        >
          {isLoading ? (
            <span>Running...</span>
          ) : (
            <>
              <Play size={16} />
              <span>Run Query</span>
            </>
          )}
        </button>
      </div>
      
      <div className="graphql-playground-editors flex flex-col sm:flex-row" style={{ height }}>
        <div className="query-editor-container w-full sm:w-1/2">
          <Editor
            height="100%"
            language="graphql"
            theme={theme}
            value={query}
            onChange={(value) => setQuery(value || '')}
            options={{
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              fontSize: 14,
              wordWrap: 'on',
              automaticLayout: true,
            }}
            onMount={handleQueryEditorDidMount}
          />
        </div>
        <div className="results-container w-full sm:w-1/2 border-t sm:border-t-0 sm:border-l border-gray-700">
          <Editor
            height="100%"
            language="json"
            theme={theme}
            value={result}
            options={{
              minimap: { enabled: false },
              readOnly: true,
              scrollBeyondLastLine: false,
              fontSize: 14,
              wordWrap: 'on',
              automaticLayout: true,
            }}
            onMount={handleResultEditorDidMount}
          />
        </div>
      </div>
    </div>
  );
};

export default GraphQLPlayground; 