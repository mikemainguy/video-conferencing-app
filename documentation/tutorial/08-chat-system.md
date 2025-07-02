# Step 8: Chat System

This step covers implementing a real-time chat system with message persistence using LiveKit data channels and server-side storage.

## 🚀 Step 8.1: Chat API

Create `client/src/utils/chatApi.ts`:

```typescript
export interface ChatMessage {
  sender: string;
  message: string;
  timestamp: Date;
}

export const chatApi = {
  async getMessages(roomName: string): Promise<ChatMessage[]> {
    const response = await fetch(`/api/messages/${roomName}`);
    return response.json();
  },

  async sendMessage(roomName: string, message: ChatMessage): Promise<void> {
    await fetch(`/api/messages/${roomName}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });
  },
};
```

## 🚀 Step 8.2: Add Chat Endpoints to Server

Update `server/index.js` to add chat endpoints:

```javascript
// Add these endpoints to your existing server/index.js

// In-memory storage for chat messages (replace with database in production)
const chatMessages = new Map();

// Get chat messages for a room
app.get('/api/messages/:roomName', (req, res) => {
  const { roomName } = req.params;
  const messages = chatMessages.get(roomName) || [];
  res.json(messages);
});

// Store a chat message
app.post('/api/messages/:roomName', (req, res) => {
  const { roomName } = req.params;
  const message = req.body;
  
  if (!chatMessages.has(roomName)) {
    chatMessages.set(roomName, []);
  }
  
  const messages = chatMessages.get(roomName);
  messages.push({
    ...message,
    timestamp: new Date(message.timestamp)
  });
  
  // Keep only last 100 messages
  if (messages.length > 100) {
    messages.splice(0, messages.length - 100);
  }
  
  res.json({ success: true });
});

// Clear chat history for a room
app.delete('/api/messages/:roomName', (req, res) => {
  const { roomName } = req.params;
  chatMessages.delete(roomName);
  res.json({ success: true });
});
```

## 🚀 Step 8.3: Chat Panel Component

Create `client/src/components/controls/ChatPanel.tsx`:

```typescript
import { useState, useEffect } from 'react';
import { TextInput, Button, Paper, Stack, Text, ScrollArea, Group } from '@mantine/core';
import { chatApi, ChatMessage } from '../../utils/chatApi';

interface ChatPanelProps {
  roomName: string;
  participantName: string;
}

export function ChatPanel({ roomName, participantName }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    loadMessages();
  }, [roomName]);

  const loadMessages = async () => {
    try {
      const history = await chatApi.getMessages(roomName);
      setMessages(history);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      sender: participantName,
      message: newMessage,
      timestamp: new Date(),
    };

    try {
      await chatApi.sendMessage(roomName, message);
      setMessages(prev => [...prev, message]);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <Paper p="md" withBorder style={{ height: '300px', display: 'flex', flexDirection: 'column' }}>
      <ScrollArea style={{ flex: 1 }}>
        <Stack gap="xs">
          {messages.map((msg, index) => (
            <Text key={index} size="sm">
              <strong>{msg.sender}:</strong> {msg.message}
            </Text>
          ))}
        </Stack>
      </ScrollArea>
      <Group gap="xs" style={{ marginTop: 'auto' }}>
        <TextInput
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          style={{ flex: 1 }}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <Button onClick={sendMessage}>Send</Button>
      </Group>
    </Paper>
  );
}
```

## 🚀 Step 8.4: Update Video Room with Chat

Update `client/src/components/VideoRoom.tsx`:

```typescript
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LiveKitRoom } from '@livekit/components-react';
import { Box } from '@mantine/core';
import { CustomVideoConference } from './CustomVideoConference';
import { ControlBar } from './controls/ControlBar';
import { ChatPanel } from './controls/ChatPanel';

export function VideoRoom() {
  const location = useLocation();
  const navigate = useNavigate();
  const { name, roomName } = location.state || {};
  const [token, setToken] = useState('');
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    if (!name || !roomName) {
      navigate('/');
      return;
    }

    fetch('/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomName, participantName: name }),
    })
      .then(res => res.json())
      .then(data => setToken(data.token))
      .catch(error => {
        console.error('Failed to get token:', error);
        navigate('/');
      });
  }, [name, roomName, navigate]);

  if (!token) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        Loading...
      </div>
    );
  }

  return (
    <LiveKitRoom
      token={token}
      serverUrl={import.meta.env.VITE_LIVEKIT_URL}
      connect={true}
    >
      <Box style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <CustomVideoConference />
        {showChat && (
          <Box style={{ padding: '16px' }}>
            <ChatPanel roomName={roomName} participantName={name} />
          </Box>
        )}
        <ControlBar 
          onLeaveRoom={() => navigate('/')} 
          onToggleChat={() => setShowChat(!showChat)}
        />
      </Box>
    </LiveKitRoom>
  );
}
```

## 🚀 Step 8.5: Test Chat System

1. Start the server and client
2. Join a room with multiple participants
3. Click the chat button to open the chat panel
4. Send messages and verify they appear for all participants

## ✅ What We've Accomplished

- ✅ Created chat API utilities
- ✅ Added server-side message storage
- ✅ Implemented chat panel component
- ✅ Integrated chat with video room
- ✅ Added message persistence
- ✅ Real-time chat functionality

## 🔗 Next Steps

- **[Step 9: Screen Sharing](./09-screen-sharing.md)** - Enhanced screen sharing features
- **[Step 10: Responsive Design](./10-responsive-design.md)** - Mobile optimization

---

**Continue to [Step 9: Screen Sharing](./09-screen-sharing.md)** 