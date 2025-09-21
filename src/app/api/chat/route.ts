import { NextResponse } from 'next/server';

// This is a client-side API key - in production, you should use environment variables
const API_KEY = 'AIzaSyAf5MAFVsnzDqMe_8iBo6H1vb_CPMtTnjs';
// Using the more available Gemini 1.0 Pro model
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message } = body;

    console.log('Received chat request:', { message: message?.substring(0, 100) });

    if (!message) {
      console.error('No message provided in request');
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    console.log('Sending request to Google AI API...');
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `System Message (or training instruction):
You are a professional AI Career Advisor called "SkillBot." You help users understand the skills required for different careers, analyze skill gaps, suggest improvements, and provide accurate, practical guidance about future job trends, roles, and career development paths. Be helpful, clear, and concise. Speak in a motivating but honest tone. ${message}`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      const errorDetails = {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      };

      console.error('Google AI API error:', errorDetails);

      if (response.status === 429) {
        return NextResponse.json(
          {
            error: 'API rate limit exceeded',
            message: 'The API key has reached its quota limit. Please try again later or use a different API key.'
          },
          { status: 429 }
        );
      }

      throw new Error(`AI service error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't process your request at the moment.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      {
        error: 'Failed to process chat message',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
