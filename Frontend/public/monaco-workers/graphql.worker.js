// This file is a placeholder for the GraphQL worker
// In a production environment, you would want to build and include the actual worker
// For now, we're using CDN-hosted workers in our GraphQLPlayground component

self.onmessage = function() {
  // Initialize the worker
  self.postMessage({ initialized: true });
}; 