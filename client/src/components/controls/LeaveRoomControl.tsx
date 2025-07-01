import React from 'react';
import { Button, Tooltip } from '@mantine/core';

interface LeaveRoomControlProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'filled' | 'outline' | 'light' | 'white' | 'subtle' | 'gradient';
  color?: string;
  disabled?: boolean;
  onLeaveRoom?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export function LeaveRoomControl({
  size = 'md',
  variant = 'outline',
  color = 'red',
  disabled = false,
  onLeaveRoom,
  className,
  style
}: LeaveRoomControlProps) {
  const handleLeaveRoom = () => {
    if (disabled) return;
    onLeaveRoom?.();
  };

  return (
    <Tooltip 
      label="Leave room"
      position="top"
    >
      <Button
        size={size}
        variant={variant}
        color={color}
        onClick={handleLeaveRoom}
        disabled={disabled}
        className={className}
        style={style}
      >
        🚪 Leave Room
      </Button>
    </Tooltip>
  );
} 