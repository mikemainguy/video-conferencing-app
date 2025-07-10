import { TextInput, Button, Stack, Paper, Center } from '@mantine/core';

interface UserInfoFormProps {
  userName: string;
  roomName: string;
  isGeneratingToken: boolean;
  onUserNameChange: (value: string) => void;
  onRoomNameChange: (value: string) => void;
  onJoinRoom: () => void;
}

export function UserInfoForm({
  userName,
  roomName,
  isGeneratingToken,
  onUserNameChange,
  onRoomNameChange,
  onJoinRoom
}: UserInfoFormProps) {
  return (
    <Center><Paper w="50%" m="xl" p="xl" withBorder>
      <Stack gap="lg">
        <TextInput
          label="Your Name"
          placeholder="Enter your name"
          value={userName}
          onChange={(e) => onUserNameChange(e.target.value)}
          description="This will be your display name in the room"
          required
        />
        <TextInput
          label="Room Name"
          placeholder="demo-room"
          value={roomName}
          onChange={(e) => onRoomNameChange(e.target.value)}
          description="Name of the room to join"
        />
        <Button 
          onClick={onJoinRoom}
          loading={isGeneratingToken}
          disabled={!roomName || !userName}
          size="md"
        >
          Join
        </Button>
      </Stack>
    </Paper>
    </Center>
  );
}