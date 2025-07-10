import React from 'react';
import { Card } from '@mantine/core';
import { useSortable } from '@dnd-kit/sortable';
import './SortableParticipantTile.css';
import {VideoTrack} from "@livekit/components-react";

export function SortableParticipantTile({
                                            trackRef,
                                            hasUnreadMessage = false,
                                            participantName = '',
                                            messagePreview = '',
                                            w = '20%',
                                        }: {
    trackRef: any;
    hasUnreadMessage?: boolean;
    participantName?: string;
    messagePreview?: string;
    style?: React.CSSProperties;
    w?: string | number | undefined;
}) {
    const id = trackRef?.id || trackRef?.publication?.trackSid || String(Math.random());
    const { attributes, listeners, setNodeRef } = useSortable({ id });

    return (
        <Card
            ref={setNodeRef}
            p={0}
            radius="md"
            w={w}
            withBorder={false}
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
            <VideoTrack trackRef={trackRef} />

        </Card>
    );
}