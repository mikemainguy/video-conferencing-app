# Building a Video Conferencing App - Complete Tutorial

This tutorial walks through building a modern video conferencing application using React, LiveKit, and Mantine UI. It's based on the actual development process and compresses hundreds of prompts into logical, sequential steps.

## 🎯 What We're Building

A self-hosted video conferencing app with:
- Real-time video/audio communication
- Screen sharing capabilities
- Chat system with message history
- Responsive design for mobile/desktop
- Drag-and-drop video grid
- Customizable control bar

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Basic knowledge of React, TypeScript
- LiveKit server (cloud or self-hosted)

## 🚀 Step 1: Project Setup

### 1.1 Initialize the Monorepo Structure
```bash
mkdir video-conferencing-app
cd video-conferencing-app
npm init -y
```

### 1.2 Create Client (React + Vite)
```bash
npm create vite@latest client -- --template react-ts
cd client
npm install
```

### 1.3 Create Server (Express)
```bash
mkdir server
cd server
npm init -y
npm install express cors dotenv livekit-server-sdk
npm install --save-dev nodemon
```

### 1.4 Install Core Dependencies
```bash
# In client directory
npm install @livekit/components-react @livekit/components-core
npm install @mantine/core @mantine/hooks @mantine/modals
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
npm install react-router-dom
```

## 🚀 Step 2: Backend Setup

### 2.1 Create Express Server
```javascript
// server/index.js
const express = require('express');
const cors = require('cors');
const { AccessToken } = require('livekit-server-sdk');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Token generation endpoint
app.post('/api/token', (req, res) => {
  const { roomName, participantName } = req.body;
  
  const at = new AccessToken(
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET,
    {
      identity: participantName,
      name: participantName,
    }
  );
  
  at.addGrant({ roomJoin: true, room: roomName });
  const token = at.toJwt();
  
  res.json({ token });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### 2.2 Environment Configuration
```bash
# server/.env
LIVEKIT_API_KEY=your_api_key
LIVEKIT_API_SECRET=your_api_secret
PORT=3001
NODE_ENV=development
```

## 🚀 Step 3: Frontend Foundation

### 3.1 Setup Vite Configuration
```typescript
// client/vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
```

### 3.2 Create Basic App Structure
```typescript
// client/src/App.tsx
import { MantineProvider } from '@mantine/core';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { VideoRoomLobby } from './components/VideoRoomLobby';
import { VideoRoom } from './components/VideoRoom';

function App() {
  return (
    <MantineProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<VideoRoomLobby />} />
          <Route path="/room" element={<VideoRoom />} />
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
}

export default App;
```

## 🚀 Step 4: Core Components

### 4.1 Video Room Lobby
```typescript
// client/src/components/VideoRoomLobby.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextInput, Button, Paper, Stack, Title } from '@mantine/core';

export function VideoRoomLobby() {
  const [name, setName] = useState('');
  const [roomName, setRoomName] = useState('');
  const navigate = useNavigate();

  const handleJoin = () => {
    if (name.trim() && roomName.trim()) {
      navigate('/room', { 
        state: { name, roomName } 
      });
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <Paper p="xl" withBorder>
        <Stack gap="md">
          <Title order={2}>Join Video Conference</Title>
          <TextInput
            label="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />
          <TextInput
            label="Room Name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="Enter room name"
          />
          <Button onClick={handleJoin} disabled={!name.trim() || !roomName.trim()}>
            Join Room
          </Button>
        </Stack>
      </Paper>
    </div>
  );
}
```

### 4.2 Basic Video Room
```typescript
// client/src/components/VideoRoom.tsx
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LiveKitRoom } from '@livekit/components-react';
import { Box, Button } from '@mantine/core';

export function VideoRoom() {
  const location = useLocation();
  const navigate = useNavigate();
  const { name, roomName } = location.state || {};
  const [token, setToken] = useState('');

  useEffect(() => {
    if (!name || !roomName) {
      navigate('/');
      return;
    }

    // Get token from server
    fetch('/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomName, participantName: name }),
    })
      .then(res => res.json())
      .then(data => setToken(data.token));
  }, [name, roomName, navigate]);

  if (!token) return <div>Loading...</div>;

  return (
    <LiveKitRoom
      token={token}
      serverUrl={import.meta.env.VITE_LIVEKIT_URL}
      connect={true}
    >
      <Box style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <VideoConference />
        <Button onClick={() => navigate('/')} style={{ position: 'absolute', top: 10, right: 10 }}>
          Leave Room
        </Button>
      </Box>
    </LiveKitRoom>
  );
}
```

## 🚀 Step 5: Video Conference Component

### 5.1 Basic Video Grid
```typescript
// client/src/components/CustomVideoConference.tsx
import { useParticipants } from '@livekit/components-react';
import { ParticipantTile } from '@livekit/components-react';
import { Box, Grid } from '@mantine/core';

export function CustomVideoConference() {
  const participants = useParticipants();

  return (
    <Box style={{ flex: 1, padding: '16px' }}>
      <Grid gutter="md">
        {participants.map((participant) => (
          <Grid.Col key={participant.identity} span={6} md={4} lg={3}>
            <ParticipantTile participant={participant} />
          </Grid.Col>
        ))}
      </Grid>
    </Box>
  );
}
```

## 🚀 Step 6: Control Bar System

### 6.1 Individual Control Components
```typescript
// client/src/components/controls/CameraControl.tsx
import { useLocalParticipant } from '@livekit/components-react';
import { ActionIcon, Tooltip } from '@mantine/core';
import { IconCamera, IconCameraOff } from '@tabler/icons-react';

export function CameraControl() {
  const { localParticipant } = useLocalParticipant();
  const isCameraEnabled = localParticipant?.isCameraEnabled;

  const toggleCamera = () => {
    if (isCameraEnabled) {
      localParticipant?.disableCamera();
    } else {
      localParticipant?.enableCamera();
    }
  };

  return (
    <Tooltip label={isCameraEnabled ? 'Turn off camera' : 'Turn on camera'}>
      <ActionIcon
        variant={isCameraEnabled ? 'filled' : 'outline'}
        onClick={toggleCamera}
        size="lg"
      >
        {isCameraEnabled ? <IconCamera size={20} /> : <IconCameraOff size={20} />}
      </ActionIcon>
    </Tooltip>
  );
}
```

### 6.2 Modular Control Bar
```typescript
// client/src/components/controls/ControlBar.tsx
import { Group, Paper } from '@mantine/core';
import { CameraControl } from './CameraControl';
import { MicrophoneControl } from './MicrophoneControl';
import { ScreenShareControl } from './ScreenShareControl';
import { ChatControl } from './ChatControl';
import { LeaveRoomControl } from './LeaveRoomControl';

interface ControlBarProps {
  onLeaveRoom?: () => void;
  onToggleChat?: () => void;
}

export function ControlBar({ onLeaveRoom, onToggleChat }: ControlBarProps) {
  return (
    <Paper p="md" style={{ margin: '16px' }}>
      <Group justify="center" gap="md">
        <CameraControl />
        <MicrophoneControl />
        <ScreenShareControl />
        <ChatControl onToggle={onToggleChat} />
        <LeaveRoomControl onLeave={onLeaveRoom} />
      </Group>
    </Paper>
  );
}
```

## 🚀 Step 7: Drag & Drop Video Grid

### 7.1 Sortable Participant Tile
```typescript
// client/src/components/controls/SortableParticipantTile.tsx
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ParticipantTile } from '@livekit/components-react';
import { Box } from '@mantine/core';

interface SortableParticipantTileProps {
  participant: any;
  id: string;
}

export function SortableParticipantTile({ participant, id }: SortableParticipantTileProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      style={{ cursor: 'grab', aspectRatio: '16/9' }}
    >
      <ParticipantTile participant={participant} />
    </Box>
  );
}
```

### 7.2 Drag & Drop Context
```typescript
// client/src/components/CustomVideoConference.tsx
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { useState } from 'react';

export function CustomVideoConference() {
  const participants = useParticipants();
  const [participantOrder, setParticipantOrder] = useState<string[]>([]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setParticipantOrder((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over?.id as string);
        const newItems = [...items];
        newItems.splice(oldIndex, 1);
        newItems.splice(newIndex, 0, active.id as string);
        return newItems;
      });
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={participantOrder} strategy={rectSortingStrategy}>
        <Grid gutter="md">
          {participants.map((participant) => (
            <Grid.Col key={participant.identity} span={6} md={4} lg={3}>
              <SortableParticipantTile
                participant={participant}
                id={participant.identity}
              />
            </Grid.Col>
          ))}
        </Grid>
      </SortableContext>
    </DndContext>
  );
}
```

## 🚀 Step 8: Chat System

### 8.1 Chat API
```typescript
// client/src/utils/chatApi.ts
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

### 8.2 Chat Panel Component
```typescript
// client/src/components/controls/ChatPanel.tsx
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
    const history = await chatApi.getMessages(roomName);
    setMessages(history);
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      sender: participantName,
      message: newMessage,
      timestamp: new Date(),
    };

    await chatApi.sendMessage(roomName, message);
    setMessages(prev => [...prev, message]);
    setNewMessage('');
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

## 🚀 Step 9: Screen Sharing

### 9.1 Screen Share Control
```typescript
// client/src/components/controls/ScreenShareControl.tsx
import { useLocalParticipant } from '@livekit/components-react';
import { ActionIcon, Tooltip } from '@mantine/core';
import { IconScreenShare, IconScreenShareOff } from '@tabler/icons-react';

export function ScreenShareControl() {
  const { localParticipant } = useLocalParticipant();
  const isScreenSharing = localParticipant?.isScreenShareEnabled;

  const toggleScreenShare = async () => {
    try {
      if (isScreenSharing) {
        await localParticipant?.stopScreenShare();
      } else {
        await localParticipant?.setScreenShareEnabled(true);
      }
    } catch (error) {
      console.error('Screen share error:', error);
    }
  };

  return (
    <Tooltip label={isScreenSharing ? 'Stop sharing' : 'Share screen'}>
      <ActionIcon
        variant={isScreenSharing ? 'filled' : 'outline'}
        onClick={toggleScreenShare}
        size="lg"
      >
        {isScreenSharing ? <IconScreenShareOff size={20} /> : <IconScreenShare size={20} />}
      </ActionIcon>
    </Tooltip>
  );
}
```

## 🚀 Step 10: Responsive Design

### 10.1 Mobile CSS
```css
/* client/src/components/CustomVideoConference.css */
@media (max-width: 768px) {
  .video-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    padding: 8px;
  }
  
  .control-bar {
    padding: 8px;
  }
  
  .control-bar button {
    width: 48px;
    height: 48px;
  }
  
  .chat-panel {
    height: 200px;
  }
}

@media (max-width: 480px) {
  .video-grid {
    grid-template-columns: 1fr;
  }
}
```

## 🚀 Step 11: Environment & Deployment

### 11.1 Environment Variables
```bash
# client/.env
VITE_LIVEKIT_URL=wss://your-livekit-server.com
VITE_TOKEN_ENDPOINT=http://localhost:3001/api/token
VITE_API_BASE_URL=http://localhost:3001
```

### 11.2 Production Build
```bash
# Build client
cd client
npm run build

# Start server
cd ../server
npm start
```

## 🚀 Step 12: Advanced Features

### 12.1 Chat History Modal
```typescript
// client/src/components/controls/ChatHistoryModal.tsx
import { Modal, ScrollArea, Text, Stack } from '@mantine/core';
import { ChatMessage } from '../../utils/chatApi';

interface ChatHistoryModalProps {
  opened: boolean;
  onClose: () => void;
  messages: ChatMessage[];
}

export function ChatHistoryModal({ opened, onClose, messages }: ChatHistoryModalProps) {
  return (
    <Modal opened={opened} onClose={onClose} title="Chat History" size="md">
      <ScrollArea style={{ height: '400px' }}>
        <Stack gap="xs">
          {messages.map((msg, index) => (
            <Text key={index} size="sm">
              <strong>{msg.sender}:</strong> {msg.message}
              <Text size="xs" c="dimmed">
                {msg.timestamp.toLocaleString()}
              </Text>
            </Text>
          ))}
        </Stack>
      </ScrollArea>
    </Modal>
  );
}
```

### 12.2 Message Notifications
```typescript
// Add notification pills to participant tiles
const [notifications, setNotifications] = useState<{[key: string]: number}>({});

const addNotification = (participantId: string) => {
  setNotifications(prev => ({
    ...prev,
    [participantId]: (prev[participantId] || 0) + 1
  }));
};
```

## 🎯 Key Lessons Learned

1. **Modular Architecture**: Break components into small, focused pieces
2. **State Management**: Use React hooks effectively for local state
3. **Error Handling**: Always handle WebRTC errors gracefully
4. **Mobile First**: Design for mobile from the start
5. **Performance**: Optimize video rendering and chat updates
6. **User Experience**: Provide clear feedback for all actions

## 🚀 Next Steps

- Add file sharing capabilities
- Implement recording functionality
- Add virtual backgrounds
- Create admin panel
- Add analytics and monitoring
- Implement push notifications

## 📚 Resources

- [LiveKit Documentation](https://docs.livekit.io/)
- [Mantine UI](https://mantine.dev/)
- [@dnd-kit](https://dndkit.com/)
- [WebRTC](https://webrtc.org/)

---

This tutorial compresses hundreds of development prompts into a logical, step-by-step guide. Each step builds upon the previous one, creating a complete video conferencing application. 