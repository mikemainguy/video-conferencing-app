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
  const showChatHistory = () => {
    if (disabled) return;
    onToggleChat?.(true);
  };

  return (
    <Tooltip 
      label="Show chat history"
      position="top"
    >
      <Button
        size={size}
        variant={variant}
        color={color}
        onClick={showChatHistory}
        disabled={disabled}
        className={className}
        style={style}
      >
        💬 Chat History
      </Button>
    </Tooltip>
  );
} 