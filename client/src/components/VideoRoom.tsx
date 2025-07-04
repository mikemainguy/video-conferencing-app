import { useState, useEffect } from 'react';
import {
  LiveKitRoom,
  useTracks,
  useLocalParticipant,
} from '@livekit/components-react';
import {CustomVideoConference} from './CustomVideoConference';
import { Room, RoomEvent, Track } from 'livekit-client';
import { Button, Center, Container, Text, Stack, Group, Paper, Alert, Collapse } from '@mantine/core';
import { ControlBar } from './controls';
import { DeviceTest } from './controls/DeviceTest';

interface VideoRoomProps {
  serverUrl: string;
  token: string;
  roomName?: string;
  onLeaveRoom?: () => void;
}

// Wrapper component to handle room context
function VideoRoomContent({ roomName, disconnectFromRoom }: { roomName: string; disconnectFromRoom: () => void }) {
  const { localParticipant } = useLocalParticipant();
  const [showDebug, setShowDebug] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  return (
    <Stack gap="md">
      <Group justify="space-between" align="center">
        <Text fw={500}>Room: {roomName}</Text>
        {/* Debug button hidden */}
        {/* <Button 
          size="xs" 
          variant="subtle" 
          onClick={() => setShowDebug(!showDebug)}
        >
          {showDebug ? 'Hide Debug' : 'Show Debug'}
        </Button> */}
      </Group>
      
      {/* Debug panel hidden */}
      {/* <Collapse in={showDebug}>
        <DeviceTest localParticipant={localParticipant} />
      </Collapse> */}
      
      {permissionError && (
        <Alert color="yellow" title="Permission Warning">
          <Text size="sm">{permissionError}</Text>
          <Text size="xs" c="dimmed" mt="xs">
            You can still use the controls to try enabling them again.
          </Text>
        </Alert>
      )}
      
      <CustomVideoConference onLeaveRoom={disconnectFromRoom} roomName={roomName}/>
    </Stack>
  );
}

export function VideoRoom({ serverUrl, token, roomName = 'default-room', onLeaveRoom }: VideoRoomProps) {
  const [room, setRoom] = useState<Room | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isBrowser, setIsBrowser] = useState(false);

  // Check if we're in a browser environment
  useEffect(() => {
    setIsBrowser(typeof window !== 'undefined' && typeof navigator !== 'undefined');
  }, []);

  const connectToRoom = async () => {
    if (!token) {
      setError('Token is required to connect to the room');
      return;
    }

    if (!isBrowser) {
      setError('This application must run in a browser environment');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const newRoom = new Room();
      
      // Set up room event listeners
      newRoom.on(RoomEvent.Connected, () => {
        setIsConnected(true);
        setIsConnecting(false);
        console.log('Connected to room:', roomName);
      });

      newRoom.on(RoomEvent.Disconnected, () => {
        setIsConnected(false);
        setIsConnecting(false);
        console.log('Disconnected from room:', roomName);
      });

      newRoom.on(RoomEvent.ConnectionStateChanged, (state: any) => {
        console.log('Connection state changed:', state);
      });

      // Connect to the room
      await newRoom.connect(serverUrl, token, {
        autoSubscribe: true,
      });

      // Request both camera and microphone at once, then publish
      if (isBrowser && navigator.mediaDevices) {
        try {
          const { createLocalTracks } = await import('livekit-client');
          const tracks = await createLocalTracks({ audio: true, video: true });
          for (const track of tracks) {
            await newRoom.localParticipant.publishTrack(track);
          }
          console.log('Camera and microphone enabled successfully');
        } catch (err) {
          console.warn('Failed to enable camera and microphone:', err);
        }
      }

      setRoom(newRoom);
    } catch (err) {
      console.error('Failed to connect to room:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect to room');
      setIsConnecting(false);
    }
  };

  const disconnectFromRoom = () => {
    if (room) {
      room.disconnect();
      setRoom(null);
    }
    if (onLeaveRoom) {
      onLeaveRoom();
    }
  };

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (room) {
        room.disconnect();
      }
    };
  }, [room]);

  // Auto-connect when all required props are present
  useEffect(() => {
    if (!isConnected && !isConnecting && token && serverUrl && isBrowser) {
      connectToRoom();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, isConnecting, token, serverUrl, isBrowser]);

  if (!isBrowser) {
    return (
      <Container size="sm" py="xl">
        <Paper p="md" withBorder>
          <Stack gap="md">
            <Text c="red" fw={500}>Browser Required</Text>
            <Text size="sm">This application requires a browser environment to access camera and microphone.</Text>
          </Stack>
        </Paper>
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="sm" py="xl">
        <Paper p="md" withBorder>
          <Stack gap="md">
            <Text c="red" fw={500}>Connection Error</Text>
            <Text size="sm">{error}</Text>
            <Button onClick={connectToRoom} loading={isConnecting}>
              Try Again
            </Button>
          </Stack>
        </Paper>
      </Container>
    );
  }

  if (!isConnected) {
    return (
      <Center>
      <Container size="sm" py="xl">
        <Paper p="md" withBorder>
          <Stack gap="md">
            <Text fw={500}>Connecting to Video Room...</Text>
            <Text size="sm" c="dimmed">
              Room: {roomName}
            </Text>
          </Stack>
        </Paper>
      </Container>
      </Center>
    );
  }

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        boxSizing: 'border-box',
        padding: 16,
        background: '#f8fafc',
        overflow: 'hidden',
      }}
    >
        {room && (
          <LiveKitRoom
            room={room}
            token={token}
            serverUrl={serverUrl}
            connect={true}
            video={true}
            audio={true}
          >
          <VideoRoomContent roomName={roomName} disconnectFromRoom={disconnectFromRoom} />
          </LiveKitRoom>
        )}
    </div>
  );
}

// Hook to get all video tracks from participants
export function useVideoTracks() {
  const tracks = useTracks([Track.Source.Camera]);
  return tracks;
}

// Hook to get all audio tracks from participants
export function useAudioTracks() {
  const tracks = useTracks([Track.Source.Microphone]);
  return tracks;
} 