# Step 3: Frontend Foundation

This step covers setting up the React app structure, configuring Vite, and implementing basic routing.

## 🚀 Step 3.1: Setup Vite Configuration

Create `client/vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
```

## 🚀 Step 3.2: Create Basic App Structure

Create `client/src/App.tsx`:

```typescript
import { MantineProvider } from '@mantine/core';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { VideoRoomLobby } from './components/VideoRoomLobby';
import { VideoRoom } from './components/VideoRoom';

function App() {
  return (
    <MantineProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<VideoRoomLobby />} />
          <Route path="/room" element={<VideoRoom />} />
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
}

export default App;
```

## 🚀 Step 3.3: Create Component Directory Structure

```bash
cd client/src
mkdir -p components/controls utils
```

## 🚀 Step 3.4: Update Main Entry Point

Update `client/src/main.tsx`:

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

## 🚀 Step 3.5: Test the Setup

```bash
cd client
npm run dev
```

Visit `http://localhost:3000` to see the basic app structure.

## 📁 Directory Structure

```
client/src/
├── components/
│   ├── controls/
│   ├── VideoRoomLobby.tsx
│   └── VideoRoom.tsx
├── utils/
├── App.tsx
├── main.tsx
└── index.css
```

## ✅ What We've Accomplished

- ✅ Configured Vite with API proxy
- ✅ Set up React Router for navigation
- ✅ Integrated Mantine UI provider
- ✅ Created component directory structure
- ✅ Prepared for component development

## 🔗 Next Steps

- **[Step 4: Core Components](./04-core-components.md)** - Create lobby and video room components
- **[Step 5: Video Conference](./05-video-conference.md)** - Implement basic video grid

---

**Continue to [Step 4: Core Components](./04-core-components.md)** 