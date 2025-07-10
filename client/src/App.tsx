import { useEffect, useState } from 'react';
import { Loader, Center } from '@mantine/core';
import { VideoRoomLobby } from './components/VideoRoomLobby';
import LoginPage from './components/LoginPage';

function App() {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    fetch('/api/me', { credentials: 'include' })
      .then((res) => {
        if (res.ok) setIsAuthenticated(true);
        else setIsAuthenticated(false);
      })
      .catch(() => setIsAuthenticated(false))
      .finally(() => setAuthChecked(true));
  }, []);

  if (!authChecked) {
    return (
      <Center style={{ minHeight: '100vh' }}>
        <Loader size="lg" />
      </Center>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (

      <VideoRoomLobby />

  );
}

export default App;
