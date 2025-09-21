const API_KEY = 'AIzaSyCFFRQfLkmdC2XIx7j2f3sOAWmRpLLeSo4';
// Using the standard Gemini model
const API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent';

async function testApiKey() {
  try {
    console.log('Testing Google AI API key...');
    console.log('API Key:', API_KEY);
    
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: 'Hello, can you tell me a short joke?'
          }]
        }]
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('❌ API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: data
      });
      return;
    }
    
    console.log('✅ API Key is valid!');
    console.log('Response:', JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.error('❌ Error testing API key:');
    console.error(error);
  }
}

testApiKey();
