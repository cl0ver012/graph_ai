import { NextRequest, NextResponse } from 'next/server';

// OpenRouter API key - in production, store this in environment variables
const OPENROUTER_API_KEY = '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';

// Default QA model
const DEFAULT_QA_MODEL = 'openrouter/deepseek/deepseek-chat';

// Default prompt template
const DEFAULT_QA_PROMPT_TEMPLATE = 
`You are an assistant that helps to form nice and human understandable answers.
The information part contains the provided information that you must use to construct an answer.
The provided information is authoritative, you must never doubt it or try to use your internal knowledge to correct it.
Make the answer sound as a response to the question. Do not mention that you based the result on the given information.
Here is an example:

Question: Which managers own Neo4j stocks?
Context:[manager:CTL LLC, manager:JANE STREET GROUP LLC]
Helpful Answer: CTL LLC, JANE STREET GROUP LLC owns Neo4j stocks.

Follow this example when generating answers.
If the provided information is empty, say that you don't know the answer.
Information:
{context}

Question: {question}
Helpful Answer:`;

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    
    // Extract the required fields
    const { 
      query, 
      userId,
      databaseId,
      modelId,
      temperature,
      maxTokens
    } = body;
    
    // Validate required fields
    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }
    
    if (!databaseId) {
      return NextResponse.json({ error: 'Database ID is required' }, { status: 400 });
    }
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    
    // Construct the request body for the RAG endpoint
    const ragRequestBody = {
      query,
      database: databaseId,
      user_id: userId,
      qa_model_id: modelId || DEFAULT_QA_MODEL,
      qa_model_kwargs: {
        api_key: OPENROUTER_API_KEY,
        temperature: temperature || 0,
        max_tokens: maxTokens || 500
      },
      qa_prompt_template: DEFAULT_QA_PROMPT_TEMPLATE
    };
    
    console.log('Sending RAG request:', JSON.stringify({
      ...ragRequestBody,
      qa_model_kwargs: {
        ...ragRequestBody.qa_model_kwargs,
        api_key: '***' // Hide API key in logs
      }
    }));
    
    // Get the base API URL from environment variables
    const apiURL = process.env.NEXT_PUBLIC_API_URL || '';
    if (!apiURL) {
      return NextResponse.json({ error: 'API URL not configured' }, { status: 500 });
    }
    
    // Send the request to the RAG endpoint
    const ragResponse = await fetch(`${apiURL}/api/rag`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      },
      body: JSON.stringify(ragRequestBody)
    });
    
    if (!ragResponse.ok) {
      const errorText = await ragResponse.text();
      console.error(`RAG endpoint returned error: ${ragResponse.status} ${ragResponse.statusText}`, errorText);
      return NextResponse.json({ 
        error: `Error from RAG service: ${ragResponse.status} ${ragResponse.statusText}`,
        details: errorText
      }, { status: ragResponse.status });
    }
    
    // Get the response from the RAG endpoint
    const ragResult = await ragResponse.json();
    
    // Return the result
    return NextResponse.json(ragResult);
  } catch (error) {
    console.error('Error in query-index route:', error);
    return NextResponse.json({ 
      error: 'Failed to process query',
      message: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 