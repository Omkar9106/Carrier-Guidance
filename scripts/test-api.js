async function testApi() {
  try {
    console.log('Testing API endpoint...');
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Hello, can you hear me?' })
    });

    const data = await response.json();
    console.log('API Response:', {
      status: response.status,
      statusText: response.statusText,
      data
    });
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testApi();
