# Step 12: Advanced Features

This step covers implementing advanced features like chat history modal, message notifications, and other enhancements to complete the video conferencing application.

## 🚀 Step 12.1: Chat History Modal

Create `client/src/components/controls/ChatHistoryModal.tsx`:

```typescript
import { Modal, ScrollArea, Text, Stack, Button, Group } from '@mantine/core';
import { ChatMessage } from '../../utils/chatApi';

interface ChatHistoryModalProps {
  opened: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  onClearHistory?: () => void;
}

export function ChatHistoryModal({ opened, onClose, messages, onClearHistory }: ChatHistoryModalProps) {
  return (
    <Modal 
      opened={opened} 
      onClose={onClose} 
      title="Chat History" 
      size="md"
      styles={{
        body: { padding: 0 }
      }}
    >
      <Stack gap="md">
        <ScrollArea style={{ height: '400px' }} p="md">
          <Stack gap="xs">
            {messages.length === 0 ? (
              <Text c="dimmed" ta="center" py="xl">
                No messages yet
              </Text>
            ) : (
              messages.map((msg, index) => (
                <div key={index}>
                  <Text size="sm" fw={500} c="blue">
                    {msg.sender}
                  </Text>
                  <Text size="sm" mb={4}>
                    {msg.message}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {new Date(msg.timestamp).toLocaleString()}
                  </Text>
                </div>
              ))
            )}
          </Stack>
        </ScrollArea>
        
        {messages.length > 0 && onClearHistory && (
          <Group justify="center" p="md">
            <Button 
              variant="outline" 
              color="red" 
              onClick={onClearHistory}
              size="sm"
            >
              Clear History
            </Button>
          </Group>
        )}
      </Stack>
    </Modal>
  );
}
```

## 🚀 Step 12.2: Message Notifications

Create `client/src/components/controls/MessageNotification.tsx`:

```typescript
import { Badge, Text } from '@mantine/core';
import { useEffect, useState } from 'react';

interface MessageNotificationProps {
  participantId: string;
  messageCount: number;
  lastMessage?: string;
}

export function MessageNotification({ participantId, messageCount, lastMessage }: MessageNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (messageCount > 0) {
      setIsVisible(true);
      
      // Hide notification after 60 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 60000);

      return () => clearTimeout(timer);
    }
  }, [messageCount]);

  if (!isVisible || messageCount === 0) {
    return null;
  }

  return (
    <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
      <Badge 
        color="red" 
        size="sm"
        style={{ 
          animation: 'fadeInOut 105s ease-in-out',
          opacity: isVisible ? 1 : 0 
        }}
      >
        {messageCount}
      </Badge>
      {lastMessage && (
        <Text 
          size="xs" 
          style={{ 
            maxWidth: '120px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            backgroundColor: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '2px 4px',
            borderRadius: '4px',
            marginTop: '2px'
          }}
        >
          {lastMessage.substring(0, 30)}
        </Text>
      )}
    </div>
  );
}
```

## 🚀 Step 12.3: Enhanced Sortable Participant Tile

Update `client/src/components/controls/SortableParticipantTile.tsx`:

```typescript
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ParticipantTile } from '@livekit/components-react';
import { Box } from '@mantine/core';
import { MessageNotification } from './MessageNotification';

interface SortableParticipantTileProps {
  participant: any;
  id: string;
  messageCount?: number;
  lastMessage?: string;
}

export function SortableParticipantTile({ 
  participant, 
  id, 
  messageCount = 0, 
  lastMessage 
}: SortableParticipantTileProps) {
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
      style={{ 
        cursor: 'grab', 
        aspectRatio: '16/9',
        position: 'relative'
      }}
    >
      <ParticipantTile participant={participant} />
      <MessageNotification 
        participantId={id}
        messageCount={messageCount}
        lastMessage={lastMessage}
      />
    </Box>
  );
}
```

## 🚀 Step 12.4: Add Notification CSS

Add to `client/src/components/CustomVideoConference.css`:

```css
@keyframes fadeInOut {
  0% { opacity: 0; }
  5% { opacity: 1; }
  95% { opacity: 1; }
  100% { opacity: 0; }
}

.message-notification {
  animation: fadeInOut 105s ease-in-out;
}

.participant-tile {
  position: relative;
}

.notification-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 10;
  background: rgba(255, 0, 0, 0.9);
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}
```

## 🚀 Step 12.5: Update Video Room with Advanced Features

Update `client/src/components/VideoRoom.tsx`:

```typescript
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LiveKitRoom } from '@livekit/components-react';
import { Box } from '@mantine/core';
import { CustomVideoConference } from './CustomVideoConference';
import { ControlBar } from './controls/ControlBar';
import { ChatPanel } from './controls/ChatPanel';
import { ChatHistoryModal } from './controls/ChatHistoryModal';
import { ScreenShareViewer } from './ScreenShareViewer';
import { chatApi, ChatMessage } from '../utils/chatApi';

export function VideoRoom() {
  const location = useLocation();
  const navigate = useNavigate();
  const { name, roomName } = location.state || {};
  const [token, setToken] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [showChatHistory, setShowChatHistory] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

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

    // Load chat history
    loadChatHistory();
  }, [name, roomName, navigate]);

  const loadChatHistory = async () => {
    try {
      const history = await chatApi.getMessages(roomName);
      setMessages(history);
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };

  const clearChatHistory = async () => {
    try {
      await fetch(`/api/messages/${roomName}`, { method: 'DELETE' });
      setMessages([]);
    } catch (error) {
      console.error('Failed to clear chat history:', error);
    }
  };

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
            <ChatPanel 
              roomName={roomName} 
              participantName={name}
              onMessageSent={(message) => setMessages(prev => [...prev, message])}
            />
          </Box>
        )}
        <ControlBar 
          onLeaveRoom={() => navigate('/')} 
          onToggleChat={() => setShowChat(!showChat)}
          onShowChatHistory={() => setShowChatHistory(true)}
        />
        
        <ChatHistoryModal
          opened={showChatHistory}
          onClose={() => setShowChatHistory(false)}
          messages={messages}
          onClearHistory={clearChatHistory}
        />
      </Box>
    </LiveKitRoom>
  );
}
```

## 🚀 Step 12.6: Update Control Bar with History Button

Update `client/src/components/controls/ControlBar.tsx`:

```typescript
import { Group, Paper, useMantineTheme } from '@mantine/core';
import { CameraControl } from './CameraControl';
import { MicrophoneControl } from './MicrophoneControl';
import { ScreenShareControl } from './ScreenShareControl';
import { ChatControl } from './ChatControl';
import { LeaveRoomControl } from './LeaveRoomControl';

interface ControlBarProps {
  onLeaveRoom?: () => void;
  onToggleChat?: () => void;
  onShowChatHistory?: () => void;
}

export function ControlBar({ onLeaveRoom, onToggleChat, onShowChatHistory }: ControlBarProps) {
  const theme = useMantineTheme();

  return (
    <Paper 
      p="md" 
      className="control-bar"
      style={{ 
        margin: '16px',
        backgroundColor: theme.white,
        boxShadow: theme.shadows.sm,
        borderRadius: theme.radius.md,
      }}
    >
      <Group justify="center" gap="md">
        <CameraControl />
        <MicrophoneControl />
        <ScreenShareControl />
        <ChatControl onToggle={onToggleChat} />
        {onShowChatHistory && (
          <ChatControl onToggle={onShowChatHistory} />
        )}
        <LeaveRoomControl onLeave={onLeaveRoom} />
      </Group>
    </Paper>
  );
}
```

## ✅ What We've Accomplished

- ✅ Created chat history modal with timestamps
- ✅ Implemented message notifications on participant tiles
- ✅ Added notification animations and styling
- ✅ Enhanced participant tiles with notification badges
- ✅ Integrated advanced features with main components
- ✅ Added chat history management

## 🎯 Complete Application Features

Your video conferencing application now includes:

- ✅ Real-time video and audio communication
- ✅ Screen sharing with responsive display
- ✅ Chat system with message history
- ✅ Drag and drop video grid
- ✅ Modular control bar
- ✅ Responsive design for all devices
- ✅ Message notifications
- ✅ Production deployment configuration
- ✅ SSL/HTTPS support
- ✅ Docker deployment option

## 🔗 Next Steps

- **[Back to Overview](./00-overview.md)** - Return to tutorial overview
- **[Features Documentation](../FEATURES.md)** - View complete features list
- **[Custom Control Bar Guide](../customcontrolbar.md)** - Learn about customization

---

**Congratulations! You've successfully built a complete video conferencing application! 🎉** 