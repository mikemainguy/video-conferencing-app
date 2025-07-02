import React from 'react';
import { Card } from '@mantine/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TILE_MAX_WIDTH, TILE_MIN_WIDTH } from './sharedTileConstants';
import './SortableParticipantTile.css';

export function SortableParticipantTile({ 
  trackRef, 
  children, 
  hasUnreadMessage = false,
  participantName = '',
  messagePreview = '',
  style
}: { 
  trackRef: any; 
  children: React.ReactNode; 
  hasUnreadMessage?: boolean;
  participantName?: string;
  messagePreview?: string;
  style?: React.CSSProperties;
}) {
  const id = trackRef?.id || trackRef?.publication?.trackSid || String(Math.random());
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  return (
    <Card
      ref={setNodeRef}
      w="100%"
      p={0}
      style={{
        flex: '1 1 200px',
        minWidth: TILE_MIN_WIDTH,
        maxWidth: TILE_MAX_WIDTH,
        aspectRatio: '16/9',
        width: '100%',
        transition,
        transform: CSS.Transform.toString(transform),
        touchAction: 'none',
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'center',
        position: 'relative',
        ...style
      }}
      radius="md"
      withBorder={false}
      className="hide-participant-metadata video-card"
      {...attributes}
      {...listeners}
    >
      {/* Chat notification pill */}
      {hasUnreadMessage && messagePreview && (
        <div
          key={`${participantName}-${messagePreview}`}
          className="chat-pill"
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            background: '#ff6b6b',
            color: 'white',
            padding: '6px 10px',
            borderRadius: 12,
            fontSize: 11,
            fontWeight: 500,
            zIndex: 10,
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            cursor: 'pointer',
            maxWidth: 200,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
          title={`New message from ${participantName}: ${messagePreview}`}
        >
          💬 {messagePreview}
        </div>
      )}
      
      <div style={{ width: '100%', height: '100%' }}>
        {children}
      </div>
    </Card>
  );
} 