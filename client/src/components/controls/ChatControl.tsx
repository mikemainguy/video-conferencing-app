import React, { useState } from 'react';
import { Button, Tooltip } from '@mantine/core';

interface ChatControlProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'filled' | 'outline' | 'light' | 'white' | 'subtle' | 'gradient';
  color?: string;
  disabled?: boolean;
  onToggleChat?: (isOpen: boolean) => void;
  className?: string;
  style?: React.CSSProperties;
}

export function ChatControl({
  size = 'md',
  variant = 'default',
  color = 'blue',
  disabled = false,
  onToggleChat,
  className,
  style
}: ChatControlProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    if (disabled) return;
    
    const newState = !isOpen;
    setIsOpen(newState);
    onToggleChat?.(newState);
  };

  return (
    <Tooltip 
      label={isOpen ? 'Close chat' : 'Open chat'}
      position="top"
    >
      <Button
        size={size}
        variant={variant}
        color={isOpen ? 'red' : color}
        onClick={toggleChat}
        disabled={disabled}
        className={className}
        style={style}
      >
        {isOpen ? '💬 Close Chat' : '💬 Chat'}
      </Button>
    </Tooltip>
  );
} 