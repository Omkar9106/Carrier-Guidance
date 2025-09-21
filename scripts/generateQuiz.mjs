// scripts/generateQuiz.mjs
import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Load .env.local if present, else .env
const root = process.cwd();
const envLocalPath = path.join(root, '.env.local');
const envPath = path.join(root, '.env');
if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath });
} else if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config();
}

async function main() {
  const apiKey = process.env.GEMINI_API_KEY || '';
  if (!apiKey) {
    console.error('GEMINI_API_KEY is not set');
    process.exit(1);
  }

  const ai = new GoogleGenerativeAI(apiKey);
  const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const role = process.argv[2] || 'Full Stack Developer';
  const experience = process.argv[3] || '3–5 years (Mid-Level)';
  const topicsArg = process.argv[4] || 'React, Node.js, MongoDB, API Design, Testing';
  const topics = topicsArg.split(',').map(s => s.trim()).filter(Boolean);
  const count = Number(process.argv[5] || 20);

  const prompt = `Generate a JSON array of ${count} multiple-choice questions for the role of a ${role} with ${experience} experience. Cover key areas such as ${topics.join(', ')}. Each object MUST have: "question" (string), "options" (array of 4 strings), "correctAnswerIndex" (number 0-3), and "skill" (string). Make questions progressively harder. Return ONLY valid JSON array, no extra text.`;

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.3, responseMimeType: 'application/json' }
  });

  const text = result.response.text();
  console.log(text);
}

main().catch(err => {
  console.error('Error:', err?.message || err);
  process.exit(1);
});
