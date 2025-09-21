const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/quiz',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log('HEADERS:', JSON.stringify(res.headers));
  
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    console.log('BODY:', chunk);
  });});

req.on('error', (e) => {
  console.error('problem with request:', e.message);
});

// Write data to request body
const postData = JSON.stringify({
  role: 'Full Stack Developer',
  experience: '2 years',
  technologies: ['JavaScript'],
  count: 1
});

req.write(postData);
req.end();
