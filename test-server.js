const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Test server running on port 3002\n');
});

server.listen(3002, '0.0.0.0', () => {
  console.log('Test server running on http://0.0.0.0:3002');
});