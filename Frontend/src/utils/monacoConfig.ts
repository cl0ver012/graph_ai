// This helper configures Monaco editor for server-side rendering environments like Next.js
import { loader } from '@monaco-editor/react';

// Define Monaco environment for workers
export const configureMonacoEnvironment = () => {
  // Skip setup if window is not defined (during SSR)
  if (typeof window === 'undefined') return;

  // Set up Monaco's CDN path for workers
  loader.config({
    paths: {
      // Using the ESM CDN
      vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs',
    },
  });

  // Configure Monaco environment to use CDN versions of workers
  window.MonacoEnvironment = {
    getWorkerUrl: function (_moduleId: any, label: string) {
      if (label === 'graphql') {
        return '/monaco-workers/graphql.worker.js'; // Would need to be added to public directory
      }
      
      if (label === 'json') {
        return 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs/language/json/json.worker.js';
      }
      
      return 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs/editor/editor.worker.js';
    },
  };
};

// Configure Monaco for GraphQL
// This function can be called client-side to configure Monaco for GraphQL
export const configureGraphQLMode = async (endpoint: string) => {
  // Skip setup if window is not defined (during SSR)
  if (typeof window === 'undefined') return;

  try {
    // Import dynamically to avoid SSR issues
    const monaco = await import('monaco-editor');
    const { initializeMode } = await import('monaco-graphql/esm/initializeMode');

    const api = initializeMode({
      schemas: [
        {
          uri: endpoint,
          fileMatch: ['*'],
        },
      ],
    });

    // Return the API for further configuration if needed
    return api;
  } catch (error) {
    console.error('Error configuring GraphQL mode:', error);
    return null;
  }
};

// Export a wrapper for the Monaco Editor that handles dynamic imports correctly
export const MonacoSetup = {
  configureMonacoEnvironment,
  configureGraphQLMode,
};

export default MonacoSetup; 