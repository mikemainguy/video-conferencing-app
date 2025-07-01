import React, { useState, useEffect } from 'react';
import { Button, Tooltip } from '@mantine/core';
import { useLocalParticipant } from '@livekit/components-react';
import { Track } from 'livekit-client';

interface MicrophoneControlProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'filled' | 'outline' | 'light' | 'white' | 'subtle' | 'gradient';
  color?: string;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function MicrophoneControl({
  size = 'md',
  variant = 'default',
  color = 'blue',
  disabled = false,
  className,
  style
}: MicrophoneControlProps) {
  const { localParticipant } = useLocalParticipant();
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isBrowser, setIsBrowser] = useState(false);

  // Check if we're in a browser environment
  useEffect(() => {
    setIsBrowser(typeof window !== 'undefined' && typeof navigator !== 'undefined');
  }, []);

  // Monitor microphone track state
  useEffect(() => {
    if (!localParticipant || !isBrowser) return;

    const updateMicrophoneState = () => {
      const microphoneTrack = localParticipant.getTrackPublication(Track.Source.Microphone);
      setIsEnabled(microphoneTrack?.isMuted === false);
    };

    // Initial state
    updateMicrophoneState();

    // Listen for track updates
    const handleTrackPublished = (track: any) => {
      if (track.source === Track.Source.Microphone) {
        updateMicrophoneState();
      }
    };

    const handleTrackUnpublished = (track: any) => {
      if (track.source === Track.Source.Microphone) {
        updateMicrophoneState();
      }
    };

    const handleTrackMuted = (track: any) => {
      if (track.source === Track.Source.Microphone) {
        updateMicrophoneState();
      }
    };

    const handleTrackUnmuted = (track: any) => {
      if (track.source === Track.Source.Microphone) {
        updateMicrophoneState();
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

  const toggleMicrophone = async () => {
    if (!localParticipant || disabled || isLoading || !isBrowser) return;

    setIsLoading(true);
    setError(null);

    try {
      if (isEnabled) {
        await localParticipant.setMicrophoneEnabled(false);
      } else {
        await localParticipant.setMicrophoneEnabled(true);
      }
    } catch (error) {
      console.error('Failed to toggle microphone:', error);
      setError(error instanceof Error ? error.message : 'Failed to toggle microphone');
      
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
        🎤 Mic (Browser Required)
      </Button>
    );
  }

  return (
    <Tooltip 
      label={
        error 
          ? `Error: ${error}` 
          : isEnabled 
            ? 'Mute microphone' 
            : 'Unmute microphone'
      }
      position="top"
    >
      <Button
        size={size}
        variant={variant}
        color={error ? 'red' : isEnabled ? color : 'gray'}
        onClick={toggleMicrophone}
        disabled={disabled || isLoading}
        loading={isLoading}
        className={className}
        style={style}
      >
        {isEnabled ? '🎤 Mic' : '🎤 Muted'}
      </Button>
    </Tooltip>
  );
} 