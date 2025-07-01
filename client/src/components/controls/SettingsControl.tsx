import React, { useState } from 'react';
import { Button, Tooltip } from '@mantine/core';

interface SettingsControlProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'filled' | 'outline' | 'light' | 'white' | 'subtle' | 'gradient';
  color?: string;
  disabled?: boolean;
  onToggleSettings?: (isOpen: boolean) => void;
  className?: string;
  style?: React.CSSProperties;
}

export function SettingsControl({
  size = 'md',
  variant = 'default',
  color = 'blue',
  disabled = false,
  onToggleSettings,
  className,
  style
}: SettingsControlProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSettings = () => {
    if (disabled) return;
    
    const newState = !isOpen;
    setIsOpen(newState);
    onToggleSettings?.(newState);
  };

  return (
    <Tooltip 
      label={isOpen ? 'Close settings' : 'Open settings'}
      position="top"
    >
      <Button
        size={size}
        variant={variant}
        color={isOpen ? 'red' : color}
        onClick={toggleSettings}
        disabled={disabled}
        className={className}
        style={style}
      >
        {isOpen ? '⚙️ Close Settings' : '⚙️ Settings'}
      </Button>
    </Tooltip>
  );
} 