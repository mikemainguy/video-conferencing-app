# Step 5: Video Conference

This step covers implementing the basic video grid that displays participant video tiles using LiveKit components.

## 🚀 Step 5.1: Basic Video Grid

Create `client/src/components/CustomVideoConference.tsx`:

```typescript
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

## 🚀 Step 5.2: Update Video Room Component

Update `client/src/components/VideoRoom.tsx` to use the video conference component:

```typescript
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LiveKitRoom } from '@livekit/components-react';
import { Box, Button } from '@mantine/core';
import { CustomVideoConference } from './CustomVideoConference';

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
        <CustomVideoConference />
        <Button onClick={() => navigate('/')} style={{ position: 'absolute', top: 10, right: 10 }}>
          Leave Room
        </Button>
      </Box>
    </LiveKitRoom>
  );
}
```

## 🚀 Step 5.3: Add Basic Styling

Create `client/src/components/CustomVideoConference.css`:

```css
.video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
  padding: 16px;
  height: 100%;
}

.participant-tile {
  aspect-ratio: 16/9;
  border-radius: 8px;
  overflow: hidden;
  background: #f0f0f0;
}

.participant-tile video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

## 🚀 Step 5.4: Test Video Grid

1. Make sure both server and client are running
2. Open two browser windows/tabs
3. Join the same room from both windows
4. You should see video tiles for each participant

## ✅ What We've Accomplished

- ✅ Created basic video grid component
- ✅ Integrated LiveKit participant tiles
- ✅ Added responsive grid layout
- ✅ Connected video conference to main room
- ✅ Basic video display functionality

## 🔗 Next Steps

- **[Step 6: Control Bar System](./06-control-bar-system.md)** - Create modular control components
- **[Step 7: Drag & Drop](./07-drag-and-drop.md)** - Make video tiles reorderable

---

**Continue to [Step 6: Control Bar System](./06-control-bar-system.md)** 