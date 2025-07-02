import React from 'react';
import { Modal, Text, ScrollArea, Loader, Button as MantineButton } from '@mantine/core';
import type { ChatMessage } from '../../utils/chatApi';

interface ChatHistoryModalProps {
  opened: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  isLoadingHistory?: boolean;
  onClearChat?: () => void;
  roomName?: string;
}

const ChatHistoryModal = ({
  opened,
  onClose,
  messages,
  isLoadingHistory = false,
  onClearChat,
  roomName
}: ChatHistoryModalProps) => {
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Auto-scroll to bottom when new messages arrive
  React.useEffect(() => {
    if (scrollAreaRef.current && messages.length > 0) {
      const scrollArea = scrollAreaRef.current;
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }, [messages.length]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Chat History & Messages"
      size="md"
      centered
      overlayProps={{ opacity: 0.55, blur: 3 }}
      styles={{
        body: { padding: '16px' },
        header: { padding: '16px 16px 0 16px' },
        content: { maxHeight: '70vh', maxWidth: '90vw' }
      }}
      withinPortal={true}
    >
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: 300, maxHeight: 500 }}>
        {/* Header with clear button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Text size="sm" fw={500}>Message History ({messages.length} messages)</Text>
          {onClearChat && roomName && (
            <MantineButton 
              size="xs" 
              variant="subtle" 
              color="red"
              onClick={onClearChat}
              disabled={isLoadingHistory}
            >
              Clear Chat
            </MantineButton>
          )}
        </div>
        
        {/* Messages Display */}
        <ScrollArea 
          style={{ flex: 1, minHeight: 200, maxHeight: 350 }}
          viewportRef={scrollAreaRef}
        >
          {isLoadingHistory ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
              <Loader size="sm" />
              <Text size="sm" ml="sm">Loading chat history...</Text>
            </div>
          ) : messages.length === 0 ? (
            <Text size="sm" c="dimmed" ta="center" py="md">
              No messages yet. Start the conversation!
            </Text>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {messages.map((msg, idx) => (
                <div 
                  key={`${msg.sender}-${msg.timestamp}-${idx}`}
                  style={{ 
                    padding: '8px 12px',
                    borderRadius: 8,
                    background: msg.sender === 'You' ? '#f8f9fa' : '#ffffff',
                    border: `1px solid ${msg.color}20`,
                    borderLeft: `3px solid ${msg.color}`
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <Text 
                      size="xs" 
                      fw={500}
                      style={{ color: msg.color }}
                    >
                      {msg.sender}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {formatTime(msg.timestamp)}
                    </Text>
                  </div>
                  <Text size="sm" style={{ lineHeight: 1.4 }}>
                    {msg.message}
                  </Text>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </Modal>
  );
};

export default ChatHistoryModal; 