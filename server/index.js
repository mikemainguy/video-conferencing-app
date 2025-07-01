import express from 'express';
import dotenv from 'dotenv';
import { AccessToken } from 'livekit-server-sdk';
import fs from 'fs';
import https from 'https';
import { createServer as createViteServer } from 'vite';
import path from 'path';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY;
const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET;

// In-memory storage for chat messages (in production, use a database)
const chatHistory = new Map(); // roomName -> messages[]

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json());
console.log(process.env.VITE_TOKEN_ENDPOINT);
if (process.env.NODE_ENV !== 'production') {
  // Vite dev middleware
  const vite = await createViteServer({
    server: { middlewareMode: true },
    root: '../client', // adjust if needed
    appType: 'custom',
  });
  app.use(vite.middlewares);
  app.set('vite', vite);
}

if (!LIVEKIT_API_KEY || !LIVEKIT_API_SECRET) {
  if (process.env.NODE_ENV !== 'test') {
    console.error('LIVEKIT_API_KEY and LIVEKIT_API_SECRET must be set in environment variables.');
    process.exit(1);
  }
}

// POST /api/token { identity, room, name }
app.post('/api/token', async (req, res) => {
  const { identity, room, name } = req.body;
  if (!identity || !room) {
    return res.status(400).json({ error: 'identity and room are required' });
  }

  try {
    const at = new AccessToken(LIVEKIT_API_KEY || 'test', LIVEKIT_API_SECRET || 'test', {
      identity,
      metadata: name ? JSON.stringify({ name }) : undefined,
    });
    at.addGrant({
      roomJoin: true,
      room,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    });
    const token = await at.toJwt();
    res.json({ token });
  } catch (err) {
    console.error('Failed to generate token:', err);
    res.status(500).json({ error: 'Failed to generate token' });
  }
});

// GET /api/health
app.get('/api/health', (req, res) => {
  res.send('LiveKit Token Server is running.');
});

// GET /api/messages/:roomName - Get chat history for a room
app.get('/api/messages/:roomName', (req, res) => {
  const { roomName } = req.params;
  
  if (!roomName) {
    return res.status(400).json({ error: 'roomName is required' });
  }

  const messages = chatHistory.get(roomName) || [];
  res.json({ messages });
});

// POST /api/messages/:roomName - Store a new chat message
app.post('/api/messages/:roomName', (req, res) => {
  const { roomName } = req.params;
  const { sender, message, timestamp, color } = req.body;
  
  if (!roomName || !sender || !message) {
    return res.status(400).json({ error: 'roomName, sender, and message are required' });
  }

  const messageData = {
    sender,
    message,
    timestamp: timestamp || Date.now(),
    color: color || '#228be6'
  };

  // Get existing messages for the room or create new array
  const messages = chatHistory.get(roomName) || [];
  
  // Add new message
  messages.push(messageData);
  
  // Keep only last 100 messages to prevent memory issues
  if (messages.length > 100) {
    messages.splice(0, messages.length - 100);
  }
  
  // Store updated messages
  chatHistory.set(roomName, messages);
  
  res.json({ success: true, message: messageData });
});

// DELETE /api/messages/:roomName - Clear chat history for a room
app.delete('/api/messages/:roomName', (req, res) => {
  const { roomName } = req.params;
  
  if (!roomName) {
    return res.status(400).json({ error: 'roomName is required' });
  }

  chatHistory.delete(roomName);
  res.json({ success: true, message: 'Chat history cleared' });
});

console.log(process.cwd());
// Only start the server if this file is run directly
if (process.env.NODE_ENV !== 'test' && import.meta.url === `file://${process.argv[1]}`) {
  // Check for SSL certificates in local ssl directory
  const sslKeyPath = path.join(process.cwd(), '..','ssl', 'express.key');
  const sslCertPath = path.join(process.cwd(), '..','ssl', 'express.crt');
  
  try {
    // Try to read SSL certificates
    const sslOptions = {
      key: fs.readFileSync(sslKeyPath),
      cert: fs.readFileSync(sslCertPath),
    };
    https.createServer(sslOptions, app).listen(PORT, () => {
      console.log(`LiveKit Token Server (HTTPS) listening on port ${PORT}`);
      console.log('Available endpoints:');
      console.log('  POST   /api/token   - Generate a LiveKit access token (expects { identity, room, name } in body)');
      console.log('  GET    /api/health  - Health check endpoint');
      console.log('  GET    /api/messages/:roomName - Get chat history for a room');
      console.log('  POST   /api/messages/:roomName - Store a new chat message');
      console.log('  DELETE /api/messages/:roomName - Clear chat history for a room');
      console.log('  *      /*       - Serves the React client app (in development, via Vite; in production, from /client/dist)');
      console.log('');
      console.log('⚠️  Using self-signed certificate. You may need to accept the certificate warning in your browser.');
      console.log(`🌐  Access the app at: https://localhost:${PORT}`);
    });
  } catch (error) {
    // SSL certificates not found, use HTTP (local development)
    console.log('SSL certificates not found, falling back to HTTP mode.');
    console.log('To enable HTTPS, run: ./generate-ssl.sh');
    console.log('');
    app.listen(PORT, () => {
      console.log(`LiveKit Token Server (HTTP) listening on port ${PORT}`);
      console.log('Available endpoints:');
      console.log('  POST   /api/token   - Generate a LiveKit access token (expects { identity, room, name } in body)');
      console.log('  GET    /api/health  - Health check endpoint');
      console.log('  GET    /api/messages/:roomName - Get chat history for a room');
      console.log('  POST   /api/messages/:roomName - Store a new chat message');
      console.log('  DELETE /api/messages/:roomName - Clear chat history for a room');
      console.log('  *      /*       - Serves the React client app (in development, via Vite; in production, from /client/dist)');
      console.log('');
      console.log(`🌐  Access the app at: http://localhost:${PORT}`);
    });
  }
  
  // Fallback: serve index.html for all other routes (for React Router)
  if (process.env.NODE_ENV !== 'production') {
    app.use('*', async (req, res, next) => {
      try {
        const vite = req.app.get('vite');
        if (!vite) {
          // Fallback for production: serve static index.html
          return res.sendFile(path.resolve('../client/dist/index.html'));
        }
        const url = req.originalUrl;
        let template = await vite.transformIndexHtml(
          url,
          fs.readFileSync('../client/index.html', 'utf-8')
        );
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        next(e);
      }
    });
  } else {
    // In production, serve built files from /client/dist
    app.use(express.static('../client/dist'));
    app.use('*', (req, res) => {
      res.sendFile(path.resolve('../client/dist/index.html'));
    });
  }
}