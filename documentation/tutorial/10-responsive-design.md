# Step 10: Responsive Design

This step covers implementing responsive design for mobile devices, tablets, and different screen sizes.

## 🚀 Step 10.1: Mobile CSS

Update `client/src/components/CustomVideoConference.css`:

```css
/* Base styles */
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

/* Tablet styles */
@media (max-width: 1024px) {
  .video-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 12px;
    padding: 12px;
  }
  
  .control-bar {
    padding: 12px;
  }
  
  .control-bar button {
    width: 44px;
    height: 44px;
  }
}

/* Mobile styles */
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
  
  .screen-share-container {
    width: 95vw;
    max-width: none;
  }
}

/* Small mobile styles */
@media (max-width: 480px) {
  .video-grid {
    grid-template-columns: 1fr;
    gap: 6px;
    padding: 6px;
  }
  
  .control-bar {
    padding: 6px;
  }
  
  .control-bar button {
    width: 52px;
    height: 52px;
  }
  
  .chat-panel {
    height: 150px;
  }
}

/* Landscape orientation */
@media (max-width: 768px) and (orientation: landscape) {
  .video-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .control-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    z-index: 1000;
  }
}
```

## 🚀 Step 10.2: Responsive Video Conference Component

Update `client/src/components/CustomVideoConference.tsx`:

```typescript
import { useParticipants } from '@livekit/components-react';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { useState, useEffect } from 'react';
import { Box, Grid, useMantineTheme } from '@mantine/core';
import { SortableParticipantTile } from './controls/SortableParticipantTile';
import './CustomVideoConference.css';

export function CustomVideoConference() {
  const participants = useParticipants();
  const [participantOrder, setParticipantOrder] = useState<string[]>([]);
  const theme = useMantineTheme();

  // Update participant order when participants change
  useEffect(() => {
    const newOrder = participants.map(p => p.identity);
    setParticipantOrder(prev => {
      const existing = prev.filter(id => newOrder.includes(id));
      const newParticipants = newOrder.filter(id => !existing.includes(id));
      return [...existing, ...newParticipants];
    });
  }, [participants]);

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

  const sortedParticipants = participantOrder
    .map(id => participants.find(p => p.identity === id))
    .filter(Boolean);

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={participantOrder} strategy={rectSortingStrategy}>
        <Box 
          className="video-grid"
          style={{ 
            backgroundColor: theme.colors.gray[0],
            minHeight: '200px'
          }}
        >
          {sortedParticipants.map((participant) => (
            <Box key={participant!.identity} className="participant-tile">
              <SortableParticipantTile
                participant={participant}
                id={participant!.identity}
              />
            </Box>
          ))}
        </Box>
      </SortableContext>
    </DndContext>
  );
}
```

## 🚀 Step 10.3: Responsive Control Bar

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
}

export function ControlBar({ onLeaveRoom, onToggleChat }: ControlBarProps) {
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
        <LeaveRoomControl onLeave={onLeaveRoom} />
      </Group>
    </Paper>
  );
}
```

## 🚀 Step 10.4: Responsive Chat Panel

Update `client/src/components/controls/ChatPanel.tsx`:

```typescript
import { useState, useEffect } from 'react';
import { TextInput, Button, Paper, Stack, Text, ScrollArea, Group, useMantineTheme } from '@mantine/core';
import { chatApi, ChatMessage } from '../../utils/chatApi';

interface ChatPanelProps {
  roomName: string;
  participantName: string;
}

export function ChatPanel({ roomName, participantName }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const theme = useMantineTheme();

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
    <Paper 
      p="md" 
      withBorder 
      className="chat-panel"
      style={{ 
        height: '300px', 
        display: 'flex', 
        flexDirection: 'column',
        backgroundColor: theme.white,
      }}
    >
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

## 🚀 Step 10.5: Test Responsive Design

1. Open the app in different browsers
2. Test on mobile devices or use browser dev tools
3. Try different screen sizes and orientations
4. Verify all components adapt properly

## ✅ What We've Accomplished

- ✅ Added responsive CSS for all screen sizes
- ✅ Implemented mobile-first design approach
- ✅ Created adaptive video grid layouts
- ✅ Added touch-friendly control buttons
- ✅ Optimized for landscape orientation
- ✅ Improved mobile chat experience

## 🔗 Next Steps

- **[Step 11: Environment & Deployment](./11-environment-deployment.md)** - Production setup
- **[Step 12: Advanced Features](./12-advanced-features.md)** - Chat history and notifications

---

**Continue to [Step 11: Environment & Deployment](./11-environment-deployment.md)** 