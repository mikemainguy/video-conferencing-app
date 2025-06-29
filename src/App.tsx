import { useState } from 'react'
import { Container, Group, Image, Title, Button, Text, Code, Stack } from '@mantine/core'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Container size="xs" py="xl">
      <Group justify="center" mb="md">
        <a href="https://vite.dev" target="_blank" rel="noopener noreferrer">
          <Image src={viteLogo} alt="Vite logo" w={64} h={64} radius="md" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
          <Image src={reactLogo} alt="React logo" w={64} h={64} radius="md" />
        </a>
      </Group>
      <Title order={1} ta="center" mb="md">Vite + React + Mantine</Title>
      <Stack align="center" gap="md">
        <Button onClick={() => setCount((count) => count + 1)} size="md">
          count is {count}
        </Button>
        <Text>
          Edit <Code>src/App.tsx</Code> and save to test HMR
        </Text>
      </Stack>
      <Text ta="center" mt="lg" c="dimmed" size="sm">
        Click on the Vite and React logos to learn more
      </Text>
    </Container>
  )
}

export default App
