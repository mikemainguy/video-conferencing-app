import { Center, Paper, Stack, Title, Button, Group } from '@mantine/core';
import { IconBrandGoogle, IconBrandFacebook } from '@tabler/icons-react';

export default function LoginPage() {
  return (
    <Center style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Paper p="xl" shadow="md" withBorder style={{ minWidth: 320 }}>
        <Stack gap="lg" align="center">
          <Title order={2}>Sign in to Video App</Title>
          <Group gap="md">
            <Button
              component="a"
              href="/auth/google"
              leftSection={<IconBrandGoogle size={18} />}
              color="blue"
              variant="outline"
              size="md"
            >
              Login with Google
            </Button>
            <Button
              component="a"
              href="/auth/facebook"
              leftSection={<IconBrandFacebook size={18} />}
              color="indigo"
              variant="outline"
              size="md"
            >
              Login with Facebook
            </Button>
          </Group>
        </Stack>
      </Paper>
    </Center>
  );
} 