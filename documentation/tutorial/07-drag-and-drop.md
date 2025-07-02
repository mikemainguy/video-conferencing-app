# Step 7: Drag & Drop

This step covers implementing drag-and-drop functionality for reordering participant video tiles using @dnd-kit.

## 🚀 Step 7.1: Sortable Participant Tile

Create `client/src/components/controls/SortableParticipantTile.tsx`:

```typescript
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ParticipantTile } from '@livekit/components-react';
import { Box } from '@mantine/core';

interface SortableParticipantTileProps {
  participant: any;
  id: string;
}

export function SortableParticipantTile({ participant, id }: SortableParticipantTileProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      style={{ cursor: 'grab', aspectRatio: '16/9' }}
    >
      <ParticipantTile participant={participant} />
    </Box>
  );
}
```

## 🚀 Step 7.2: Update Video Conference with Drag & Drop

Update `client/src/components/CustomVideoConference.tsx`:

```typescript
import { useParticipants } from '@livekit/components-react';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { useState, useEffect } from 'react';
import { Box, Grid } from '@mantine/core';
import { SortableParticipantTile } from './controls/SortableParticipantTile';

export function CustomVideoConference() {
  const participants = useParticipants();
  const [participantOrder, setParticipantOrder] = useState<string[]>([]);

  // Update participant order when participants change
  useEffect(() => {
    const newOrder = participants.map(p => p.identity);
    setParticipantOrder(prev => {
      // Keep existing order for participants that are still present
      const existing = prev.filter(id => newOrder.includes(id));
      // Add new participants at the end
      const newParticipants = newOrder.filter(id => !existing.includes(id));
      return [...existing, ...newParticipants];
    });
  }, [participants]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setParticipantOrder((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over?.id as string);
        const newItems = [...items];
        newItems.splice(oldIndex, 1);
        newItems.splice(newIndex, 0, active.id as string);
        return newItems;
      });
    }
  };

  // Sort participants according to the order
  const sortedParticipants = participantOrder
    .map(id => participants.find(p => p.identity === id))
    .filter(Boolean);

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={participantOrder} strategy={rectSortingStrategy}>
        <Box style={{ flex: 1, padding: '16px' }}>
          <Grid gutter="md">
            {sortedParticipants.map((participant) => (
              <Grid.Col key={participant!.identity} span={6} md={4} lg={3}>
                <SortableParticipantTile
                  participant={participant}
                  id={participant!.identity}
                />
              </Grid.Col>
            ))}
          </Grid>
        </Box>
      </SortableContext>
    </DndContext>
  );
}
```

## 🚀 Step 7.3: Add Drag & Drop Styling

Add to `client/src/components/CustomVideoConference.css`:

```css
.sortable-participant-tile {
  cursor: grab;
  transition: transform 0.2s ease;
}

.sortable-participant-tile:active {
  cursor: grabbing;
}

.sortable-participant-tile.dragging {
  opacity: 0.5;
  transform: rotate(5deg);
}

.video-grid {
  min-height: 200px;
}
```

## 🚀 Step 7.4: Test Drag & Drop

1. Join a room with multiple participants
2. Try dragging video tiles to reorder them
3. Verify the order persists during the session

## ✅ What We've Accomplished

- ✅ Created sortable participant tile component
- ✅ Integrated @dnd-kit drag and drop
- ✅ Added visual feedback during dragging
- ✅ Maintained participant order state
- ✅ Smooth drag and drop interactions

## 🔗 Next Steps

- **[Step 8: Chat System](./08-chat-system.md)** - Implement real-time messaging
- **[Step 9: Screen Sharing](./09-screen-sharing.md)** - Enhanced screen sharing features

---

**Continue to [Step 8: Chat System](./08-chat-system.md)** 