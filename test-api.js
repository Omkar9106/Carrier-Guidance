const fetch = require('node-fetch');
require('dotenv').config();

async function testQuizAPI() {
  const url = 'http://localhost:3000/api/quiz';
  const payload = {
    role: 'Full Stack Developer',
    experience: '2 years',
    technologies: ['JavaScript', 'React', 'Node.js'],
    count: 2
  };

  try {
    console.log('Testing API with payload:', JSON.stringify(payload, null, 2));
    console.log('Using GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? '*** (set)' : 'Not set!');
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.text();
    console.log('Status:', response.status);
    console.log('Response:', data);
  } catch (error) {
    console.error('Error:', error);
  }
}

testQuizAPI();
