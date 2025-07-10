import { useState, useEffect, lazy, Suspense } from 'react';
import { Stack } from '@mantine/core';
const VideoRoom = lazy(() => import('./VideoRoom'));
import { UserInfoForm } from './UserInfoForm';

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
  const [token, setToken] = useState('');
  const [roomName, setRoomName] = useState('demo-room');
  const [userName, setUserName] = useState('');
  const [isGeneratingToken, setIsGeneratingToken] = useState(false);
  const [readyToJoin, setReadyToJoin] = useState(false);

  // Set userName from authentication provider if available
  useEffect(() => {
    if (!userName) {
      fetch('/api/me', { credentials: 'include' })
          .then(res => res.ok ? res.json() : null)
          .then(data => {
            if (data && data.user) {
              // Google profile: displayName, Facebook: displayName or name
              setUserName(data.user.displayName || data.user.name || '');
            }
          })
          .catch(() => {});
    }
  }, [userName]);

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

  // Handler to reset state when leaving the room
  const handleLeaveRoom = () => {
    setReadyToJoin(false);
    setToken('');
  };

  return (
      <>
        {readyToJoin && token && roomName && userName ? (
            <Stack gap="md">
              <Suspense fallback={<div>Loading video room...</div>}>
                <VideoRoom
                    serverUrl={LIVEKIT_URL}
                    token={token}
                    roomName={roomName}
                    onLeaveRoom={handleLeaveRoom}
                />
              </Suspense>
            </Stack>
        ) : (
            <UserInfoForm
                userName={userName}
                roomName={roomName}
                isGeneratingToken={isGeneratingToken}
                onUserNameChange={setUserName}
                onRoomNameChange={setRoomName}
                onJoinRoom={joinRoom}
            />
        )}
      </>
  );
}