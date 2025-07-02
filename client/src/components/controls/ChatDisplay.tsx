import { Paper, Text, ScrollArea } from '@mantine/core';

interface ChatMessage {
  sender: string;
  message: string;
  timestamp: number;
  color: string;
}

interface ChatDisplayProps {
  messages: ChatMessage[];
  maxHeight?: number;
}

export function ChatDisplay({ messages, maxHeight = 300 }: ChatDisplayProps) {
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <Paper 
      p="md" 
      withBorder 
      shadow="sm"
      style={{ 
        width: '100%', 
        maxWidth: 600,
        maxHeight,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Text size="sm" fw={500} mb="sm">Chat Messages</Text>
      
      <ScrollArea style={{ flex: 1, maxHeight: maxHeight - 60 }}>
        {messages.length === 0 ? (
          <Text size="sm" c="dimmed" ta="center" py="md">
            No messages yet. Start the conversation!
          </Text>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
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
    </Paper>
  );
} 