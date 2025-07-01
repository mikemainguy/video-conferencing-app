import React, { useMemo, useEffect } from 'react';
import { useTracks, ParticipantTile, useRoomContext } from '@livekit/components-react';
import { Track } from 'livekit-client';
import { Paper, Text, SimpleGrid, Card, TextInput, Button as MantineButton, Flex } from '@mantine/core';
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { getTrackReferenceId } from '@livekit/components-core';
import './CustomVideoConference.css';
import { ControlBar } from './controls/ControlBar';
import { SortableParticipantTile } from './controls/SortableParticipantTile';
import { ChatPanel } from './controls/ChatPanel';

function getParticipantName(participant: any) {
  if (participant?.metadata) {
    try {
      const meta = JSON.parse(participant.metadata);
      if (meta.name) return meta.name;
    } catch {}
  }
  return participant?.identity || '';
}

export function CustomVideoConference({ onLeaveRoom }: { onLeaveRoom?: () => void }) {
  const tracks = useTracks([Track.Source.Camera, Track.Source.ScreenShare]);
  const [order, setOrder] = React.useState<string[]>(() => tracks.map(getTrackReferenceId));
  const [showChat, setShowChat] = React.useState(false);
  const [chatMessage, setChatMessage] = React.useState('');
  const [chatMessages, setChatMessages] = React.useState<{
    sender: string; 
    message: string; 
    timestamp: number; 
    color: string;
  }[]>([]);
  const [unreadParticipants, setUnreadParticipants] = React.useState<Set<string>>(new Set());
  const [latestMessages, setLatestMessages] = React.useState<Map<string, string>>(new Map());
  const room = useRoomContext();

  // Listen for incoming chat messages
  React.useEffect(() => {
    if (!room) return;
    const handleData = (payload: Uint8Array, participant: any) => {
      try {
        const msg = JSON.parse(new TextDecoder().decode(payload));
        if (msg.type === 'chat' && msg.message) {
          const senderName = participant?.name || participant?.identity || 'Unknown';
          const messageData = {
            sender: senderName,
            message: msg.message,
            timestamp: msg.timestamp || Date.now(),
            color: msg.color || '#228be6'
          };
          
          setChatMessages((prev) => [...prev, messageData]);
          
          // Store the latest message from this participant
          setLatestMessages(prev => new Map(prev).set(senderName, msg.message));
          
          // Always add to unread participants
          setUnreadParticipants(prev => new Set(prev).add(senderName));
        }
      } catch {}
    };
    room.on('dataReceived', handleData);
    return () => {
      room.off('dataReceived', handleData);
    };
  }, [room, showChat]);

  // Send chat message
  const sendChatMessage = async () => {
    if (!room || !chatMessage.trim()) return;
    try {
      const messageData = {
        type: 'chat',
        message: chatMessage,
        timestamp: Date.now(),
        color: '#40c057' // Green color for local messages
      };
      
      const encoder = new TextEncoder();
      await room.localParticipant.publishData(
        encoder.encode(JSON.stringify(messageData)),
        { reliable: true }
      );
      
      setChatMessages((prev) => [...prev, { 
        sender: 'You', 
        message: chatMessage,
        timestamp: messageData.timestamp,
        color: messageData.color
      }]);
      setChatMessage('');
    } catch (err) {
      alert('Failed to send message');
    }
  };

  // Helper function to get participant name from track
  const getParticipantNameFromTrack = (trackRef: any) => {
    if (trackRef?.participant) {
      return getParticipantName(trackRef.participant);
    }
    return '';
  };

  // Helper function to check if participant has unread messages
  const hasUnreadMessages = (trackRef: any) => {
    const participantName = getParticipantNameFromTrack(trackRef);
    return unreadParticipants.has(participantName);
  };

  // Helper function to get message preview for participant
  const getMessagePreview = (trackRef: any) => {
    const participantName = getParticipantNameFromTrack(trackRef);
    const latestMessage = latestMessages.get(participantName);
    if (latestMessage) {
      return latestMessage.length > 30 ? latestMessage.substring(0, 30) + '...' : latestMessage;
    }
    return '';
  };

  // Separate screen share and camera tracks
  const screenShareTracks = useMemo(
    () => tracks.filter(t => t.source === Track.Source.ScreenShare),
    [tracks]
  );
  const cameraTracks = useMemo(
    () => tracks.filter(t => t.source === Track.Source.Camera),
    [tracks]
  );

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setOrder((items) => arrayMove(items, items.indexOf(active.id as string), items.indexOf(over?.id as string)));
    }
  };

  const orderedCameraTracks = useMemo(
    () => order.map(id => cameraTracks.find(t => getTrackReferenceId(t) === id)).filter(Boolean),
    [order, cameraTracks]
  );

  // Update order if camera tracks change (e.g., participant joins/leaves)
  useEffect(() => {
    setOrder(cameraTracks.map(getTrackReferenceId));
  }, [cameraTracks.length, cameraTracks]);

  return (
    <Paper p="md" withBorder shadow="md" style={{ background: '#f8fafc', width: '100%', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
      {/* Custom Control Bar with chat toggle */}
      <ControlBar
        showCamera={true}
        showMicrophone={true}
        showScreenShare={true}
        showChat={true}
        showSettings={true}
        showLeaveRoom={true}
        onToggleChat={setShowChat}
        onLeaveRoom={onLeaveRoom}
        size="xs"
      />
      
      {/* Chat Panel */}
      {showChat && (
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}>
          <ChatPanel
            chatMessage={chatMessage}
            setChatMessage={setChatMessage}
            sendChatMessage={sendChatMessage}
          />
        </div>
      )}
      
      {/* Screen share row */}
      {screenShareTracks.length > 0 && (
        <div style={{ display: 'flex', gap: 16, marginBottom: 32, justifyContent: 'center', flexWrap: 'wrap', width: '100%' }}>
          {screenShareTracks.map((trackRef) =>
            trackRef ? (
              <SortableParticipantTile key={getTrackReferenceId(trackRef)} trackRef={trackRef} isScreenShare={true}>
                <ParticipantTile trackRef={trackRef} />
              </SortableParticipantTile>
            ) : null
          )}
        </div>
      )}
      {/* Camera grid */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={order} strategy={rectSortingStrategy}>
          <Flex wrap="wrap" gap="md" justify="center" align="flex-start" style={{ flex: 1, width: '100%', minHeight: 0, overflow: 'auto' }}>
            {order.map((id) => {
              const trackRef = tracks.find((t) => getTrackReferenceId(t) === id);
              return trackRef ? (
                <SortableParticipantTile 
                  key={id} 
                  trackRef={trackRef}
                  hasUnreadMessage={hasUnreadMessages(trackRef)}
                  participantName={getParticipantNameFromTrack(trackRef)}
                  messagePreview={getMessagePreview(trackRef)}
                >
                  <ParticipantTile trackRef={trackRef} />
                </SortableParticipantTile>
              ) : null;
            })}
          </Flex>
        </SortableContext>
      </DndContext>
    </Paper>
  );
} 