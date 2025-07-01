import React, { useState } from 'react';
import { Button, Tooltip } from '@mantine/core';
import { useLocalParticipant } from '@livekit/components-react';

interface ScreenShareControlProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'filled' | 'outline' | 'light' | 'white' | 'subtle' | 'gradient';
  color?: string;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function ScreenShareControl({
  size = 'md',
  variant = 'default',
  color = 'blue',
  disabled = false,
  className,
  style
}: ScreenShareControlProps) {
  const { localParticipant } = useLocalParticipant();
  const [isSharing, setIsSharing] = useState(false);

  const toggleScreenShare = async () => {
    if (!localParticipant || disabled) return;

    try {
      if (isSharing) {
        await localParticipant.setScreenShareEnabled(false);
        setIsSharing(false);
      } else {
        await localParticipant.setScreenShareEnabled(true);
        setIsSharing(true);
      }
    } catch (error) {
      console.error('Failed to toggle screen share:', error);
    }
  };

  return (
    <Tooltip 
      label={isSharing ? 'Stop screen sharing' : 'Start screen sharing'}
      position="top"
    >
      <Button
        size={size}
        variant={variant}
        color={isSharing ? 'red' : color}
        onClick={toggleScreenShare}
        disabled={disabled}
        className={className}
        style={style}
      >
        {isSharing ? '🖥️ Stop Share' : '🖥️ Share Screen'}
      </Button>
    </Tooltip>
  );
} 