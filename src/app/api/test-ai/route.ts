import { NextResponse } from 'next/server';

const API_KEY = 'AIzaSyCFFRQfLkmdC2XIx7j2f3sOAWmRpLLeSo4';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export async function GET() {
  try {
    const testPrompt = 'Hello, can you tell me a short joke?';
    
    console.log('Sending test request to Google AI API...');
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: testPrompt
          }]
        }]
      }),
    });

    const responseText = await response.text();
    
    if (!response.ok) {
      console.error('Test API Error:', {
        status: response.status,
        statusText: response.statusText,
        body: responseText
      });
      return NextResponse.json(
        { 
          error: 'Test API call failed',
          status: response.status,
          statusText: response.statusText,
          body: responseText
        },
        { status: 500 }
      );
    }

    const data = JSON.parse(responseText);
    return NextResponse.json({ 
      success: true,
      response: data 
    });

  } catch (error) {
    console.error('Test API Error:', error);
    return NextResponse.json(
      { 
        error: 'Test API call failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
