// In-memory storage for chat messages (in production, use a database)
const chatHistory = new Map(); // roomName -> messages[]

export function getChatHistory(roomName) {
  if (!roomName) {
    throw new Error('roomName is required');
  }
  return chatHistory.get(roomName) || [];
}

export function addChatMessage(roomName, sender, message, timestamp, color) {
  if (!roomName || !sender || !message) {
    throw new Error('roomName, sender, and message are required');
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
  
  return messageData;
}

export function clearChatHistory(roomName) {
  if (!roomName) {
    throw new Error('roomName is required');
  }
  chatHistory.delete(roomName);
} 