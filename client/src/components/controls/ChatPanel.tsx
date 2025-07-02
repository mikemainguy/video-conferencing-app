import { TextInput, Button as MantineButton, Group } from '@mantine/core';

interface ChatPanelProps {
  chatMessage: string;
  setChatMessage: (message: string) => void;
  sendChatMessage: () => void;
}

export function ChatPanel({ 
  chatMessage, 
  setChatMessage, 
  sendChatMessage
}: ChatPanelProps) {
  return (
    <Group gap="sm" style={{ width: '100%', maxWidth: 600 }}>
      <TextInput
        placeholder="Type a message..."
        value={chatMessage}
        onChange={(e) => setChatMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') sendChatMessage();
        }}
        size="sm"
        style={{ flex: 1 }}
      />
      <MantineButton 
        onClick={sendChatMessage} 
        size="sm" 
        disabled={!chatMessage.trim()}
      >
        Send
      </MantineButton>
    </Group>
  );
} 