import express from 'express';
import { generateToken } from '../services/tokenService.js';
import { getChatHistory, addChatMessage, clearChatHistory } from '../services/chatService.js';

const router = express.Router();

// POST /api/token { identity, room, name }
router.post('/token', async (req, res) => {
  // Require authentication
  if (!req.isAuthenticated || !req.isAuthenticated() || !req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  const { identity, room, name } = req.body;
  
  try {
    const token = await generateToken(identity, room, name);
    res.json({ token, user: req.user });
  } catch (err) {
    console.error('Failed to generate token:', err);
    res.status(400).json({ error: err.message });
  }
});

// GET /api/health
router.get('/health', (req, res) => {
  res.send('LiveKit Token Server is running.');
});

// GET /api/messages/:roomName - Get chat history for a room
router.get('/messages/:roomName', (req, res) => {
  const { roomName } = req.params;
  
  try {
    const messages = getChatHistory(roomName);
    res.json({ messages });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/messages/:roomName - Store a new chat message
router.post('/messages/:roomName', (req, res) => {
  const { roomName } = req.params;
  const { sender, message, timestamp, color } = req.body;
  
  try {
    const messageData = addChatMessage(roomName, sender, message, timestamp, color);
    res.json({ success: true, message: messageData });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/messages/:roomName - Clear chat history for a room
router.delete('/messages/:roomName', (req, res) => {
  const { roomName } = req.params;
  
  try {
    clearChatHistory(roomName);
    res.json({ success: true, message: 'Chat history cleared' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/me - Return authenticated user info or 401
router.get('/me', (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated() && req.user) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

export default router; 