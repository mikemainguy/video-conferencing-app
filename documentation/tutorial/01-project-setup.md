# Step 1: Project Setup

This step covers initializing the monorepo structure, creating the client and server directories, and installing all necessary dependencies.

## 🚀 Step 1.1: Initialize the Monorepo Structure

```bash
mkdir video-conferencing-app
cd video-conferencing-app
npm init -y
```

## 🚀 Step 1.2: Create Client (React + Vite)

```bash
npm create vite@latest client -- --template react-ts
cd client
npm install
```

## 🚀 Step 1.3: Create Server (Express)

```bash
mkdir server
cd server
npm init -y
npm install express cors dotenv livekit-server-sdk
npm install --save-dev nodemon
```

## 🚀 Step 1.4: Install Core Dependencies

```bash
# In client directory
npm install @livekit/components-react @livekit/components-core
npm install @mantine/core @mantine/hooks @mantine/modals
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
npm install react-router-dom
```

## 📁 Final Directory Structure

```
video-conferencing-app/
├── client/
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
├── server/
│   ├── index.js
│   ├── package.json
│   └── .env
└── package.json
```

## ✅ What We've Accomplished

- ✅ Created monorepo structure
- ✅ Set up React + TypeScript client with Vite
- ✅ Set up Express server
- ✅ Installed all necessary dependencies
- ✅ Prepared for LiveKit integration

## 🔗 Next Steps

- **[Step 2: Backend Setup](./02-backend-setup.md)** - Create Express server with LiveKit integration
- **[Step 3: Frontend Foundation](./03-frontend-foundation.md)** - Set up React app structure and routing

---

**Continue to [Step 2: Backend Setup](./02-backend-setup.md)** 