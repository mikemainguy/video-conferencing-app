# Step 4: Core Components

This step covers creating the video room lobby and basic video room components that handle navigation and room joining.

## 🚀 Step 4.1: Video Room Lobby

Create `client/src/components/VideoRoomLobby.tsx`:

```typescript
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

## 🚀 Step 4.2: Basic Video Room

Create `client/src/components/VideoRoom.tsx`:

```typescript
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
        <div style={{ flex: 1, padding: '16px' }}>
          <h2>Video Conference</h2>
          <p>Room: {roomName}</p>
          <p>Name: {name}</p>
        </div>
        <Button onClick={() => navigate('/')} style={{ position: 'absolute', top: 10, right: 10 }}>
          Leave Room
        </Button>
      </Box>
    </LiveKitRoom>
  );
}
```

## 🚀 Step 4.3: Environment Variables

Create `client/.env`:

```bash
VITE_LIVEKIT_URL=wss://your-livekit-server.com
VITE_TOKEN_ENDPOINT=http://localhost:3001/api/token
VITE_API_BASE_URL=http://localhost:3001
```

## 🚀 Step 4.4: Test the Components

1. Start the server:
```bash
cd server
npm run dev
```

2. Start the client:
```bash
cd client
npm run dev
```

3. Visit `http://localhost:3000` and test the lobby form.

## ✅ What We've Accomplished

- ✅ Created video room lobby with form validation
- ✅ Implemented basic video room component
- ✅ Added token generation and LiveKit connection
- ✅ Set up environment variables
- ✅ Added navigation between components

## 🔗 Next Steps

- **[Step 5: Video Conference](./05-video-conference.md)** - Implement basic video grid
- **[Step 6: Control Bar System](./06-control-bar-system.md)** - Create modular control components

---

**Continue to [Step 5: Video Conference](./05-video-conference.md)** 