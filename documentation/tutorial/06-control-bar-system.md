# Step 6: Control Bar System

This step covers creating modular control components for camera, microphone, screen sharing, and other video conferencing features.

## 🚀 Step 6.1: Camera Control

Create `client/src/components/controls/CameraControl.tsx`:

```typescript
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

## 🚀 Step 6.2: Microphone Control

Create `client/src/components/controls/MicrophoneControl.tsx`:

```typescript
import { useLocalParticipant } from '@livekit/components-react';
import { ActionIcon, Tooltip } from '@mantine/core';
import { IconMicrophone, IconMicrophoneOff } from '@tabler/icons-react';

export function MicrophoneControl() {
  const { localParticipant } = useLocalParticipant();
  const isMicrophoneEnabled = localParticipant?.isMicrophoneEnabled;

  const toggleMicrophone = () => {
    if (isMicrophoneEnabled) {
      localParticipant?.disableMicrophone();
    } else {
      localParticipant?.enableMicrophone();
    }
  };

  return (
    <Tooltip label={isMicrophoneEnabled ? 'Mute microphone' : 'Unmute microphone'}>
      <ActionIcon
        variant={isMicrophoneEnabled ? 'filled' : 'outline'}
        onClick={toggleMicrophone}
        size="lg"
      >
        {isMicrophoneEnabled ? <IconMicrophone size={20} /> : <IconMicrophoneOff size={20} />}
      </ActionIcon>
    </Tooltip>
  );
}
```

## 🚀 Step 6.3: Screen Share Control

Create `client/src/components/controls/ScreenShareControl.tsx`:

```typescript
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

## 🚀 Step 6.4: Chat Control

Create `client/src/components/controls/ChatControl.tsx`:

```typescript
import { ActionIcon, Tooltip } from '@mantine/core';
import { IconMessage } from '@tabler/icons-react';

interface ChatControlProps {
  onToggle?: () => void;
}

export function ChatControl({ onToggle }: ChatControlProps) {
  return (
    <Tooltip label="Toggle chat">
      <ActionIcon
        variant="outline"
        onClick={onToggle}
        size="lg"
      >
        <IconMessage size={20} />
      </ActionIcon>
    </Tooltip>
  );
}
```

## 🚀 Step 6.5: Leave Room Control

Create `client/src/components/controls/LeaveRoomControl.tsx`:

```typescript
import { ActionIcon, Tooltip } from '@mantine/core';
import { IconPhoneOff } from '@tabler/icons-react';

interface LeaveRoomControlProps {
  onLeave?: () => void;
}

export function LeaveRoomControl({ onLeave }: LeaveRoomControlProps) {
  return (
    <Tooltip label="Leave room">
      <ActionIcon
        variant="filled"
        color="red"
        onClick={onLeave}
        size="lg"
      >
        <IconPhoneOff size={20} />
      </ActionIcon>
    </Tooltip>
  );
}
```

## 🚀 Step 6.6: Modular Control Bar

Create `client/src/components/controls/ControlBar.tsx`:

```typescript
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

## 🚀 Step 6.7: Update Video Room

Update `client/src/components/VideoRoom.tsx` to include the control bar:

```typescript
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LiveKitRoom } from '@livekit/components-react';
import { Box } from '@mantine/core';
import { CustomVideoConference } from './CustomVideoConference';
import { ControlBar } from './controls/ControlBar';

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
        <ControlBar onLeaveRoom={() => navigate('/')} />
      </Box>
    </LiveKitRoom>
  );
}
```

## ✅ What We've Accomplished

- ✅ Created individual control components
- ✅ Implemented camera toggle functionality
- ✅ Added microphone mute/unmute
- ✅ Integrated screen sharing controls
- ✅ Created modular control bar
- ✅ Added tooltips for better UX

## 🔗 Next Steps

- **[Step 7: Drag & Drop](./07-drag-and-drop.md)** - Make video tiles reorderable
- **[Step 8: Chat System](./08-chat-system.md)** - Implement real-time messaging

---

**Continue to [Step 7: Drag & Drop](./07-drag-and-drop.md)** 