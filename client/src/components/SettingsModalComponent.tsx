import { Modal, Title } from '@mantine/core';

interface SettingsModalProps {
  isOpened: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpened, onClose }: SettingsModalProps) {
  return (
    <Modal
      opened={isOpened}
      onClose={onClose}
      centered={true}
      title={<Title order={3}>Settings</Title>}
      size="md"
    >
      ABC
    </Modal>
  );
}