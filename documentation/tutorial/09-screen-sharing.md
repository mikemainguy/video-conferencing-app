# Step 9: Screen Sharing

This step covers enhancing the screen sharing functionality with better error handling, responsive display, and user feedback.

## 🚀 Step 9.1: Enhanced Screen Share Control

Update `client/src/components/controls/ScreenShareControl.tsx`:

```typescript
import { useLocalParticipant } from '@livekit/components-react';
import { ActionIcon, Tooltip, Notification } from '@mantine/core';
import { IconScreenShare, IconScreenShareOff } from '@tabler/icons-react';
import { useState } from 'react';

export function ScreenShareControl() {
  const { localParticipant } = useLocalParticipant();
  const isScreenSharing = localParticipant?.isScreenShareEnabled;
  const [error, setError] = useState<string | null>(null);

  const toggleScreenShare = async () => {
    try {
      setError(null);
      
      if (isScreenSharing) {
        await localParticipant?.stopScreenShare();
      } else {
        await localParticipant?.setScreenShareEnabled(true);
      }
    } catch (error) {
      console.error('Screen share error:', error);
      setError('Failed to start screen sharing. Please check permissions.');
    }
  };

  return (
    <>
      <Tooltip label={isScreenSharing ? 'Stop sharing' : 'Share screen'}>
        <ActionIcon
          variant={isScreenSharing ? 'filled' : 'outline'}
          onClick={toggleScreenShare}
          size="lg"
        >
          {isScreenSharing ? <IconScreenShareOff size={20} /> : <IconScreenShare size={20} />}
        </ActionIcon>
      </Tooltip>
      
      {error && (
        <Notification
          title="Screen Share Error"
          color="red"
          onClose={() => setError(null)}
          style={{ position: 'absolute', top: 10, right: 10, zIndex: 1000 }}
        >
          {error}
        </Notification>
      )}
    </>
  );
}
```

## 🚀 Step 9.2: Screen Share Viewer Component

Create `client/src/components/ScreenShareViewer.tsx`:

```typescript
import { useParticipants } from '@livekit/components-react';
import { Box, Paper, Text } from '@mantine/core';

export function ScreenShareViewer() {
  const participants = useParticipants();
  
  // Find participants who are screen sharing
  const screenSharingParticipants = participants.filter(
    participant => participant.isScreenShareEnabled
  );

  if (screenSharingParticipants.length === 0) {
    return null;
  }

  return (
    <Box style={{ padding: '16px' }}>
      {screenSharingParticipants.map((participant) => (
        <Paper key={participant.identity} p="md" withBorder>
          <Text size="sm" c="dimmed" mb="xs">
            {participant.name || participant.identity} is sharing their screen
          </Text>
          <Box 
            style={{ 
              width: '80vw', 
              maxWidth: '1200px', 
              aspectRatio: '16/9',
              margin: '0 auto'
            }}
          >
            <video
              autoPlay
              playsInline
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </Box>
        </Paper>
      ))}
    </Box>
  );
}
```

## 🚀 Step 9.3: Update Video Room with Screen Share Viewer

Update `client/src/components/VideoRoom.tsx`:

```typescript
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LiveKitRoom } from '@livekit/components-react';
import { Box } from '@mantine/core';
import { CustomVideoConference } from './CustomVideoConference';
import { ControlBar } from './controls/ControlBar';
import { ChatPanel } from './controls/ChatPanel';
import { ScreenShareViewer } from './ScreenShareViewer';

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
        <ScreenShareViewer />
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

## 🚀 Step 9.4: Add Screen Share Styling

Add to `client/src/components/CustomVideoConference.css`:

```css
.screen-share-container {
  width: 80vw;
  max-width: 1200px;
  margin: 0 auto;
  aspect-ratio: 16/9;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.screen-share-video {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #000;
}

.screen-share-label {
  position: absolute;
  top: 8px;
  left: 8px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}
```

## 🚀 Step 9.5: Test Screen Sharing

1. Join a room with multiple participants
2. Click the screen share button
3. Select a window or entire screen to share
4. Verify the screen share appears for all participants
5. Test stopping the screen share

## ✅ What We've Accomplished

- ✅ Enhanced screen share control with error handling
- ✅ Created dedicated screen share viewer component
- ✅ Added responsive screen share display
- ✅ Integrated screen sharing with video room
- ✅ Added user feedback and notifications
- ✅ Improved screen share styling

## 🔗 Next Steps

- **[Step 10: Responsive Design](./10-responsive-design.md)** - Mobile optimization
- **[Step 11: Environment & Deployment](./11-environment-deployment.md)** - Production setup

---

**Continue to [Step 10: Responsive Design](./10-responsive-design.md)** 