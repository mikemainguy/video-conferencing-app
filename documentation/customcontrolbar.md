# Custom Control Bar Example

This example demonstrates how to create a configurable custom control bar using Mantine components and the ControlBar from this project. It also shows how to wire up the chat button to open/close a chat card.

---

```tsx
import React, { useState } from 'react';
import { Stack, Text, Switch, Select, ColorInput, Paper } from '@mantine/core';
import { ControlBar } from './ControlBar';
import { SortableChatCard } from './controls/SortableChatCard';

interface CustomControlBarExampleProps {
  onLeaveRoom?: () => void;
}

export function CustomControlBarExample({ onLeaveRoom }: CustomControlBarExampleProps) {
  const [variant, setVariant] = useState<'default' | 'minimal'>('default');
  const [size, setSize] = useState<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('xs');
  const [color, setColor] = useState('#228be6');
  const [showCamera, setShowCamera] = useState(true);
  const [showMicrophone, setShowMicrophone] = useState(true);
  const [showScreenShare, setShowScreenShare] = useState(true);
  const [showChat, setShowChat] = useState(true);
  const [showSettings, setShowSettings] = useState(true);
  const [showLeaveRoom, setShowLeaveRoom] = useState(true);

  // Chat card state
  const [showChatCard, setShowChatCard] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<{ sender: string; message: string }[]>([]);
  const CHAT_CARD_ID = 'chat-card';

  const sendChatMessage = () => {
    if (!chatMessage.trim()) return;
    setChatMessages((prev) => [...prev, { sender: 'You', message: chatMessage }]);
    setChatMessage('');
  };

  return (
    <Stack gap="xs">
      <Text fw={500} size="lg">Custom Control Bar Configuration</Text>
      
      {/* Configuration Controls */}
      <Stack gap="md">
        <Select
          label="Variant"
          value={variant}
          onChange={(value) => setVariant(value as 'default' | 'minimal')}
          data=[
            { value: 'default', label: 'Default (with Paper wrapper)' },
            { value: 'minimal', label: 'Minimal (just buttons)' }
          ]
        />
        
        <Select
          label="Size"
          value={size}
          onChange={(value) => setSize(value as 'xs' | 'sm' | 'md' | 'lg' | 'xl')}
          data=[
            { value: 'xs', label: 'Extra Small' },
            { value: 'sm', label: 'Small' },
            { value: 'md', label: 'Medium' },
            { value: 'lg', label: 'Large' },
            { value: 'xl', label: 'Extra Large' }
          ]
        />
        
        <ColorInput
          label="Color"
          value={color}
          onChange={setColor}
          format="hex"
        />
        
        <Text fw={500} size="sm">Show/Hide Controls</Text>
        
        <Switch
          label="Show Camera Control"
          checked={showCamera}
          onChange={(event) => setShowCamera(event.currentTarget.checked)}
        />
        
        <Switch
          label="Show Microphone Control"
          checked={showMicrophone}
          onChange={(event) => setShowMicrophone(event.currentTarget.checked)}
        />
        
        <Switch
          label="Show Screen Share Control"
          checked={showScreenShare}
          onChange={(event) => setShowScreenShare(event.currentTarget.checked)}
        />
        
        <Switch
          label="Show Chat Control"
          checked={showChat}
          onChange={(event) => setShowChat(event.currentTarget.checked)}
        />
        
        <Switch
          label="Show Settings Control"
          checked={showSettings}
          onChange={(event) => setShowSettings(event.currentTarget.checked)}
        />
        
        <Switch
          label="Show Leave Room Control"
          checked={showLeaveRoom}
          onChange={(event) => setShowLeaveRoom(event.currentTarget.checked)}
        />
      </Stack>
      
      {/* Preview */}
      <Stack gap="md">
        <Text fw={500} size="sm">Preview</Text>
        <ControlBar
          variant={variant}
          showCamera={showCamera}
          showMicrophone={showMicrophone}
          showScreenShare={showScreenShare}
          showChat={showChat}
          showSettings={showSettings}
          showLeaveRoom={showLeaveRoom}
          onLeaveRoom={onLeaveRoom}
          onToggleChat={setShowChatCard}
          style={{ 
            '--mantine-color-blue-6': color,
            '--mantine-color-blue-7': color,
            '--mantine-color-blue-8': color,
          } as React.CSSProperties}
        />
        {showChatCard && (
          <Paper p="md" withBorder>
            <SortableChatCard
              chatMessages={chatMessages}
              chatMessage={chatMessage}
              setChatMessage={setChatMessage}
              sendChatMessage={sendChatMessage}
              CHAT_CARD_ID={CHAT_CARD_ID}
            />
          </Paper>
        )}
      </Stack>
    </Stack>
  );
} 