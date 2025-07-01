import React from 'react';
import { Group, Paper } from '@mantine/core';
import { CameraControl } from './CameraControl';
import { MicrophoneControl } from './MicrophoneControl';
import { ScreenShareControl } from './ScreenShareControl';
import { ChatControl } from './ChatControl';
import { SettingsControl } from './SettingsControl';
import { LeaveRoomControl } from './LeaveRoomControl';

interface ControlBarProps {
  variant?: 'default' | 'minimal' | 'custom';
  showCamera?: boolean;
  showMicrophone?: boolean;
  showScreenShare?: boolean;
  showChat?: boolean;
  showSettings?: boolean;
  showLeaveRoom?: boolean;
  onLeaveRoom?: () => void;
  onToggleChat?: (isOpen: boolean) => void;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  style?: React.CSSProperties;
}

export function ControlBar({
  variant = 'default',
  showCamera = true,
  showMicrophone = true,
  showScreenShare = true,
  showChat = true,
  showSettings = true,
  showLeaveRoom = true,
  onLeaveRoom,
  onToggleChat,
  size = 'md',
  className,
  style
}: ControlBarProps) {
  const controls = [];

  if (showCamera) {
    controls.push(<CameraControl key="camera" size={size} />);
  }

  if (showMicrophone) {
    controls.push(<MicrophoneControl key="microphone" size={size} />);
  }

  if (showScreenShare) {
    controls.push(<ScreenShareControl key="screenshare" size={size} />);
  }

  if (showChat) {
    controls.push(<ChatControl key="chat" onToggleChat={onToggleChat} size={size} />);
  }

  if (showSettings) {
    controls.push(<SettingsControl key="settings" size={size} />);
  }

  if (showLeaveRoom) {
    controls.push(<LeaveRoomControl key="leave" onLeaveRoom={onLeaveRoom} size={size} />);
  }

  if (variant === 'minimal') {
    return (
      <Group gap="xs" className={className} style={style}>
        {controls}
      </Group>
    );
  }

  return (
    <Paper 
      p="md" 
      withBorder 
      shadow="sm"
      className={className}
      style={style}
    >
      <Group justify="center" gap="md">
        {controls}
      </Group>
    </Paper>
  );
} 