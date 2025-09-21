// scripts/testGenai.mjs
import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';

async function main() {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
  
  const config = {
    temperature: 0.2,
  };
  
  const model = 'gemini-2.0-flash-lite';
  const contents = [
    {
      role: 'user',
      parts: [
        {
          text: `Generate a JSON array of 2 multiple-choice questions for the role of a Full Stack Developer with 3–5 years experience. Cover key areas such as React, Node.js, MongoDB, API Design, Testing. Each object MUST have: "question" (string), "options" (array of 4 strings), "correctAnswerIndex" (number 0-3), and "skill" (string). Make questions progressively harder. Return ONLY valid JSON array, no extra text.`,
        },
      ],
    },
  ];

  const response = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });
  
  let fileIndex = 0;
  for await (const chunk of response) {
    console.log(chunk.text);
  }
}

main().catch(console.error);
