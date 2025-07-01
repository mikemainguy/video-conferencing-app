import React, { useState, useEffect } from 'react';
import { Button, Tooltip } from '@mantine/core';
import { useLocalParticipant } from '@livekit/components-react';
import { Track } from 'livekit-client';

interface CameraControlProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'filled' | 'outline' | 'light' | 'white' | 'subtle' | 'gradient';
  color?: string;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function CameraControl({
  size = 'md',
  variant = 'default',
  color = 'blue',
  disabled = false,
  className,
  style
}: CameraControlProps) {
  const { localParticipant } = useLocalParticipant();
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isBrowser, setIsBrowser] = useState(false);

  // Check if we're in a browser environment
  useEffect(() => {
    setIsBrowser(typeof window !== 'undefined' && typeof navigator !== 'undefined');
  }, []);

  // Monitor camera track state
  useEffect(() => {
    if (!localParticipant || !isBrowser) return;

    const updateCameraState = () => {
      const cameraTrack = localParticipant.getTrackPublication(Track.Source.Camera);
      setIsEnabled(cameraTrack?.isMuted === false);
    };

    // Initial state
    updateCameraState();

    // Listen for track updates
    const handleTrackPublished = (track: any) => {
      if (track.source === Track.Source.Camera) {
        updateCameraState();
      }
    };

    const handleTrackUnpublished = (track: any) => {
      if (track.source === Track.Source.Camera) {
        updateCameraState();
      }
    };

    const handleTrackMuted = (track: any) => {
      if (track.source === Track.Source.Camera) {
        updateCameraState();
      }
    };

    const handleTrackUnmuted = (track: any) => {
      if (track.source === Track.Source.Camera) {
        updateCameraState();
      }
    };

    localParticipant.on('trackPublished', handleTrackPublished);
    localParticipant.on('trackUnpublished', handleTrackUnpublished);
    localParticipant.on('trackMuted', handleTrackMuted);
    localParticipant.on('trackUnmuted', handleTrackUnmuted);

    return () => {
      localParticipant.off('trackPublished', handleTrackPublished);
      localParticipant.off('trackUnpublished', handleTrackUnpublished);
      localParticipant.off('trackMuted', handleTrackMuted);
      localParticipant.off('trackUnmuted', handleTrackUnmuted);
    };
  }, [localParticipant, isBrowser]);

  const toggleCamera = async () => {
    if (!localParticipant || disabled || isLoading || !isBrowser) return;

    setIsLoading(true);
    setError(null);

    try {
      if (isEnabled) {
        await localParticipant.setCameraEnabled(false);
      } else {
        await localParticipant.setCameraEnabled(true);
      }
    } catch (error) {
      console.error('Failed to toggle camera:', error);
      setError(error instanceof Error ? error.message : 'Failed to toggle camera');
      
      // Show error for 3 seconds
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isBrowser) {
    return (
      <Button
        size={size}
        variant={variant}
        color="gray"
        disabled={true}
        className={className}
        style={style}
      >
        📹 Camera (Browser Required)
      </Button>
    );
  }

  return (
    <Tooltip 
      label={
        error 
          ? `Error: ${error}` 
          : isEnabled 
            ? 'Turn off camera' 
            : 'Turn on camera'
      }
      position="top"
    >
      <Button
        size={size}
        variant={variant}
        color={error ? 'red' : isEnabled ? color : 'gray'}
        onClick={toggleCamera}
        disabled={disabled || isLoading}
        loading={isLoading}
        className={className}
        style={style}
      >
        {isEnabled ? '📹 Camera' : '📹 Camera Off'}
      </Button>
    </Tooltip>
  );
} 