import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';
import { QuizQuestion, QuizRequest } from '@/types/quiz';

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
});

function buildPrompt(role: string, count: number, experience: string, topics: string[]): string {
  const exp = experience ? ` with ${experience} experience` : '';
  const topicsStr = topics.length > 0 ? topics.join(', ') : 'general programming concepts';
  
  return `Generate a JSON array of ${count} multiple-choice questions for the role of a ${role}${exp}. Cover key areas such as ${topicsStr}. Each object MUST have: "question" (string), "options" (array of 4 strings), "correctAnswerIndex" (number 0-3), and "skill" (string). Make questions progressively harder. Return ONLY valid JSON array, no extra text.`;
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not set on server' }, { status: 400 });
    }

    const body: QuizRequest = await request.json();
    const { role = 'Full Stack Developer', experience = '', technologies = [], count = 20 } = body;

    const prompt = buildPrompt(role, count, experience, technologies);

    const config = {
      temperature: 0.2,
    };
    const model = 'gemini-2.0-flash-lite';
    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ];

    const response = await genAI.models.generateContentStream({
      model,
      config,
      contents,
    });

    let fullText = '';
    for await (const chunk of response) {
      fullText += chunk.text;
    }

    let data: QuizQuestion[];
    try {
      data = JSON.parse(fullText);
    } catch {
      // Fallback: try to locate JSON in text
      const match = fullText.match(/\[[\s\S]*\]/);
      data = match ? JSON.parse(match[0]) : [];
    }

    if (!Array.isArray(data)) {
      return NextResponse.json({ error: 'Model did not return a JSON array.' }, { status: 502 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('Quiz generation error:', err);
    const msg = err instanceof Error ? err.message : 'Failed to generate quiz.';
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
