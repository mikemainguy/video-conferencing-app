export function logServerStart(port, isHttps = false) {
  const protocol = isHttps ? 'HTTPS' : 'HTTP';
  const url = isHttps ? `https://localhost:${port}` : `http://localhost:${port}`;
  
  console.log(`LiveKit Token Server (${protocol}) listening on port ${port}`);
  console.log('Available endpoints:');
  console.log('  POST   /api/token   - Generate a LiveKit access token (expects { identity, room, name } in body)');
  console.log('  GET    /api/health  - Health check endpoint');
  console.log('  GET    /api/messages/:roomName - Get chat history for a room');
  console.log('  POST   /api/messages/:roomName - Store a new chat message');
  console.log('  DELETE /api/messages/:roomName - Clear chat history for a room');
  console.log('  *      /*       - Serves the React client app (in development, via Vite; in production, from /client/dist)');
  console.log('');
  
  if (isHttps) {
    console.log('⚠️  Using self-signed certificate. You may need to accept the certificate warning in your browser.');
  } else {
    console.log('SSL certificates not found, falling back to HTTP mode.');
    console.log('To enable HTTPS, run: ./generate-ssl.sh');
    console.log('');
  }
  
  console.log(`🌐  Access the app at: ${url}`);
} 