import React, { useState, useEffect } from 'react';
import { Button, Stack, Text, Paper, Group, Alert } from '@mantine/core';

interface DeviceTestProps {
  localParticipant?: any; // Optional - only passed when in room context
}

export function DeviceTest({ localParticipant }: DeviceTestProps) {
  const [cameraStatus, setCameraStatus] = useState<string>('Unknown');
  const [microphoneStatus, setMicrophoneStatus] = useState<string>('Unknown');
  const [isTesting, setIsTesting] = useState(false);
  const [isBrowser, setIsBrowser] = useState(false);

  // Check if we're in a browser environment
  useEffect(() => {
    setIsBrowser(typeof window !== 'undefined' && typeof navigator !== 'undefined');
  }, []);

  const checkDeviceStatus = async () => {
    if (!isBrowser) {
      setCameraStatus('Browser required');
      setMicrophoneStatus('Browser required');
      return;
    }

    setIsTesting(true);
    
    try {
      // Check camera
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop());
        setCameraStatus('Available');
      } catch (error) {
        setCameraStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }

      // Check microphone
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
        setMicrophoneStatus('Available');
      } catch (error) {
        setMicrophoneStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    } finally {
      setIsTesting(false);
    }
  };

  const checkLiveKitStatus = () => {
    if (!localParticipant) {
      console.log('No LiveKit participant available');
      return;
    }

    // Import Track dynamically to avoid SSR issues
    import('livekit-client').then(({ Track }) => {
      const cameraTrack = localParticipant.getTrackPublication(Track.Source.Camera);
      const microphoneTrack = localParticipant.getTrackPublication(Track.Source.Microphone);

      console.log('Camera track:', cameraTrack);
      console.log('Microphone track:', microphoneTrack);
      console.log('Local participant:', localParticipant);
    });
  };

  useEffect(() => {
    if (isBrowser) {
      checkDeviceStatus();
    }
  }, [isBrowser]);

  if (!isBrowser) {
    return (
      <Paper p="md" withBorder>
        <Stack gap="md">
          <Text fw={500}>Device Status</Text>
          <Alert color="yellow" title="Browser Required">
            <Text size="sm">Device testing requires a browser environment.</Text>
          </Alert>
        </Stack>
      </Paper>
    );
  }

  return (
    <Paper p="md" withBorder>
      <Stack gap="md">
        <Text fw={500}>Device Status</Text>
        
        <Group>
          <Text size="sm">Camera: {cameraStatus}</Text>
          <Text size="sm">Microphone: {microphoneStatus}</Text>
        </Group>

        <Group>
          <Button 
            size="sm" 
            onClick={checkDeviceStatus} 
            loading={isTesting}
          >
            Test Devices
          </Button>
          
          <Button 
            size="sm" 
            variant="outline"
            onClick={checkLiveKitStatus}
            disabled={!localParticipant}
          >
            Check LiveKit Status
          </Button>
        </Group>

        {!localParticipant && (
          <Alert color="blue" title="LiveKit Status">
            <Text size="sm">Not connected to a room. Join a room to see LiveKit participant info.</Text>
          </Alert>
        )}

        {localParticipant && (
          <Alert color="blue" title="LiveKit Participant Info">
            <Text size="xs">Identity: {localParticipant.identity}</Text>
            <Text size="xs">SID: {localParticipant.sid}</Text>
            <Text size="xs">Connected: {localParticipant.connectionQuality}</Text>
          </Alert>
        )}
      </Stack>
    </Paper>
  );
} 