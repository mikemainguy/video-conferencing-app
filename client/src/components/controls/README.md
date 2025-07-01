# Custom Control Bar Components

This directory contains customizable control bar components for your LiveKit video application. These components replace the default LiveKit ControlBar with more flexible, customizable options.

## Components

### ControlBar
The main control bar component that combines all individual controls.

**Props:**
- `variant`: 'default' | 'minimal' | 'custom' - Controls the visual style
- `showCamera`: boolean - Show/hide camera control
- `showMicrophone`: boolean - Show/hide microphone control
- `showScreenShare`: boolean - Show/hide screen share control
- `showChat`: boolean - Show/hide chat control
- `showSettings`: boolean - Show/hide settings control
- `showLeaveRoom`: boolean - Show/hide leave room control
- `onLeaveRoom`: () => void - Callback when leave room is clicked
- `className`: string - Additional CSS classes
- `style`: React.CSSProperties - Additional inline styles

### Individual Control Components

#### CameraControl
Controls camera on/off functionality.

**Props:**
- `size`: Button size ('xs' | 'sm' | 'md' | 'lg' | 'xl')
- `variant`: Button variant
- `color`: Button color
- `disabled`: boolean - Disable the control
- `className`: string - Additional CSS classes
- `style`: React.CSSProperties - Additional inline styles

#### MicrophoneControl
Controls microphone mute/unmute functionality.

**Props:** Same as CameraControl

#### ScreenShareControl
Controls screen sharing functionality.

**Props:** Same as CameraControl

#### ChatControl
Controls chat panel visibility.

**Props:**
- All standard button props
- `onToggleChat`: (isOpen: boolean) => void - Callback when chat is toggled

#### SettingsControl
Controls settings panel visibility.

**Props:**
- All standard button props
- `onToggleSettings`: (isOpen: boolean) => void - Callback when settings is toggled

#### LeaveRoomControl
Controls leaving the room functionality.

**Props:**
- All standard button props
- `onLeaveRoom`: () => void - Callback when leave room is clicked

## Usage Examples

### Basic Usage
```tsx
import { ControlBar } from './components/controls';

<ControlBar onLeaveRoom={handleLeaveRoom} />
```

### Customized Control Bar
```tsx
<ControlBar
  variant="minimal"
  showCamera={true}
  showMicrophone={true}
  showScreenShare={false}
  showChat={false}
  showSettings={true}
  showLeaveRoom={true}
  onLeaveRoom={handleLeaveRoom}
  style={{ backgroundColor: '#f0f0f0' }}
/>
```

### Using Individual Controls
```tsx
import { CameraControl, MicrophoneControl } from './components/controls';

<Group>
  <CameraControl size="lg" color="green" />
  <MicrophoneControl variant="outline" />
</Group>
```

### Custom Styling
```tsx
<ControlBar
  variant="default"
  style={{
    '--mantine-color-blue-6': '#ff6b6b',
    '--mantine-color-blue-7': '#ff5252',
    '--mantine-color-blue-8': '#ff3838',
  } as React.CSSProperties}
/>
```

## Customization Tips

1. **Colors**: Use CSS custom properties to override Mantine's default colors
2. **Layout**: The `variant="minimal"` removes the Paper wrapper for custom layouts
3. **Individual Controls**: Import and use individual controls for maximum flexibility
4. **Event Handlers**: Use the callback props to integrate with your application state
5. **Styling**: Combine `className` and `style` props for custom styling

## Integration with VideoRoom

The VideoRoom component has been updated to use the custom ControlBar. You can further customize it by:

1. Modifying the ControlBar props in VideoRoom.tsx
2. Creating your own control bar layout using individual components
3. Adding new control components to the controls directory

## Adding New Controls

To add a new control component:

1. Create a new file in the `controls` directory
2. Follow the pattern of existing controls
3. Export it from `index.ts`
4. Add it to the ControlBar component if needed

Example:
```tsx
// NewControl.tsx
import React from 'react';
import { Button, Tooltip } from '@mantine/core';

interface NewControlProps {
  // ... props
}

export function NewControl({ ... }: NewControlProps) {
  // ... implementation
}
``` 