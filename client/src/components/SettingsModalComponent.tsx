import React from 'react';
import { Modal, Title } from '@mantine/core';

interface SettingsModalProps {
  opened: boolean;
  onClose: () => void;
}

export function SettingsModal({ opened, onClose }: SettingsModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<Title order={3}>Settings</Title>}
      size="md"
    >
      {/* Modal content will be added later */}
    </Modal>
  );
}