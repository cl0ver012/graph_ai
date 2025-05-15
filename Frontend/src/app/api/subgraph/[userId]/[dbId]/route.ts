import { NextRequest, NextResponse } from 'next/server';
import { mockSubgraphData } from './mockData';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string; dbId: string } }
) {
  const userId = params.userId;
  const dbId = params.dbId;
  
  try {
    // Use the socketEndpoint from environment variable or default to API_URL
    const apiURL = process.env.NEXT_PUBLIC_API_URL || '';
    const socketEndpoint = process.env.NEXT_PUBLIC_SOCKET_ENDPOINT || '';
    
    const actualEndpoint = socketEndpoint 
      ? `https://${socketEndpoint}/api/subgraph/${userId}/${dbId}` 
      : `${apiURL}/api/subgraph/${userId}/${dbId}`;
    
    console.log(`Fetching subgraph data from: ${actualEndpoint}`);
    
    try {
      const response = await fetch(actualEndpoint, {
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        cache: 'no-store',
      });
  
      if (!response.ok) {
        console.warn(`Failed to fetch subgraph data: ${response.status} ${response.statusText}, using mock data instead`);
        // Return mock data as fallback
        return NextResponse.json(mockSubgraphData);
      }
  
      const data = await response.json();
      return NextResponse.json(data);
    } catch (fetchError) {
      console.warn(`Error fetching from actual endpoint, using mock data instead:`, fetchError);
      // Return mock data as fallback
      return NextResponse.json(mockSubgraphData);
    }
  } catch (error) {
    console.error('Error in subgraph API route:', error);
    // Even in case of unexpected errors, return mock data
    return NextResponse.json(mockSubgraphData);
  }
} 