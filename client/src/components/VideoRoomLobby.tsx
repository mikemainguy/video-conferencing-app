import { useState } from 'react';
import { Container, TextInput, Button, Stack, Paper, Text, Alert, Group } from '@mantine/core';
import { VideoRoom } from './VideoRoom';

// Check for required environment variables
const LIVEKIT_URL = import.meta.env.VITE_LIVEKIT_URL;
const TOKEN_ENDPOINT = import.meta.env.VITE_TOKEN_ENDPOINT;

if (!LIVEKIT_URL) {
  console.error('❌ VITE_LIVEKIT_URL environment variable is missing. Please set it in your .env file.');
}

if (!TOKEN_ENDPOINT) {
  console.error('❌ VITE_TOKEN_ENDPOINT environment variable is missing. Please set it in your .env file.');
}
console.log(TOKEN_ENDPOINT);
export function VideoRoomLobby() {
  const [serverUrl, setServerUrl] = useState(LIVEKIT_URL || '');
  const [token, setToken] = useState('');
  const [roomName, setRoomName] = useState('demo-room');
  const [userName, setUserName] = useState('');
  const [isGeneratingToken, setIsGeneratingToken] = useState(false);
  const [readyToJoin, setReadyToJoin] = useState(false);

  const joinRoom = async () => {
    if (!roomName) {
      alert('Please enter a room name first');
      return;
    }
    if (!userName) {
      alert('Please enter your name first');
      return;
    }
    if (!TOKEN_ENDPOINT) {
      alert('Token endpoint is not configured. Please check your environment variables.');
      return;
    }
    setIsGeneratingToken(true);
    try {
      const response = await fetch(TOKEN_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identity: userName,
          name: userName,
          room: roomName,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setToken(data.token);
      setReadyToJoin(true);
    } catch (error) {
      console.error('Failed to generate token:', error);
      alert('Failed to generate token. Make sure the server is running and the endpoint is correct.');
    } finally {
      setIsGeneratingToken(false);
    }
  };

  const handleBackToSetup = () => {
    setReadyToJoin(false);
    setToken('');
  };

  // Handler to reset state when leaving the room
  const handleLeaveRoom = () => {
    setReadyToJoin(false);
    setToken('');
  };

  return (
    <Container py="xl">
      {readyToJoin && token && serverUrl && roomName && userName ? (
        <Stack gap="md">
          <VideoRoom 
            serverUrl={serverUrl}
            token={token}
            roomName={roomName}
            onLeaveRoom={handleLeaveRoom}
          />
        </Stack>
      ) : (
        <Paper p="xl" withBorder>
          <Stack gap="lg">
          
            <TextInput
              label="Your Name"
              placeholder="Enter your name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              description="This will be your display name in the room"
              required
            />
            <Button 
              onClick={joinRoom}
              loading={isGeneratingToken}
              disabled={!serverUrl || !roomName || !userName}
              size="md"
            >
              Join
            </Button>
            <TextInput
              label="LiveKit Server URL"
              placeholder="ws://localhost:7880"
              value={serverUrl}
              onChange={(e) => setServerUrl(e.target.value)}
              description="Your LiveKit server WebSocket URL (default: ws://localhost:7880)"
            />

            <TextInput
              label="Room Name"
              placeholder="demo-room"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              description="Name of the room to join"
            />



          </Stack>
        </Paper>
      )}
    </Container>
  );
} 