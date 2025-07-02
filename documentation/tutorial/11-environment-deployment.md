# Step 11: Environment & Deployment

This step covers setting up environment variables, production builds, and deployment configuration for the video conferencing application.

## 🚀 Step 11.1: Environment Variables

Create `client/.env`:

```bash
VITE_LIVEKIT_URL=wss://your-livekit-server.com
VITE_TOKEN_ENDPOINT=http://localhost:3001/api/token
VITE_API_BASE_URL=http://localhost:3001
```

Create `client/.env.production`:

```bash
VITE_LIVEKIT_URL=wss://your-production-livekit-server.com
VITE_TOKEN_ENDPOINT=https://your-domain.com/api/token
VITE_API_BASE_URL=https://your-domain.com
```

## 🚀 Step 11.2: Production Build Scripts

Update `client/package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
  }
}
```

Update `server/package.json`:

```json
{
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "build": "echo 'No build step needed for Node.js server'"
  }
}
```

## 🚀 Step 11.3: Production Server Configuration

Update `server/index.js` for production:

```javascript
const express = require('express');
const cors = require('cors');
const path = require('path');
const { AccessToken } = require('livekit-server-sdk');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration for production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-domain.com'] 
    : ['http://localhost:3000'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
}

// API endpoints
app.post('/api/token', (req, res) => {
  const { roomName, participantName } = req.body;
  
  const at = new AccessToken(
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET,
    {
      identity: participantName,
      name: participantName,
    }
  );
  
  at.addGrant({ roomJoin: true, room: roomName });
  const token = at.toJwt();
  
  res.json({ token });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Chat endpoints
const chatMessages = new Map();

app.get('/api/messages/:roomName', (req, res) => {
  const { roomName } = req.params;
  const messages = chatMessages.get(roomName) || [];
  res.json(messages);
});

app.post('/api/messages/:roomName', (req, res) => {
  const { roomName } = req.params;
  const message = req.body;
  
  if (!chatMessages.has(roomName)) {
    chatMessages.set(roomName, []);
  }
  
  const messages = chatMessages.get(roomName);
  messages.push({
    ...message,
    timestamp: new Date(message.timestamp)
  });
  
  if (messages.length > 100) {
    messages.splice(0, messages.length - 100);
  }
  
  res.json({ success: true });
});

// Serve React app for all other routes in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});
```

## 🚀 Step 11.4: Production Environment Variables

Create `server/.env.production`:

```bash
NODE_ENV=production
PORT=3001
LIVEKIT_API_KEY=your_production_api_key
LIVEKIT_API_SECRET=your_production_api_secret
CORS_ORIGIN=https://your-domain.com
```

## 🚀 Step 11.5: Build and Deploy

### Development Build
```bash
# Build client
cd client
npm run build

# Start server
cd ../server
npm start
```

### Production Deployment
```bash
# Install dependencies
npm install
cd client && npm install && cd ..
cd server && npm install && cd ..

# Build client
cd client
npm run build

# Start production server
cd ../server
NODE_ENV=production npm start
```

## 🚀 Step 11.6: Docker Deployment (Optional)

Create `Dockerfile`:

```dockerfile
# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Install dependencies
RUN npm install
RUN cd client && npm install
RUN cd server && npm install

# Copy source code
COPY . .

# Build client
RUN cd client && npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy server files
COPY server/package*.json ./
RUN npm install --only=production

# Copy built client and server
COPY --from=build /app/client/dist ./client/dist
COPY --from=build /app/server/index.js ./

# Create production environment file
RUN echo "NODE_ENV=production" > .env

EXPOSE 3001

CMD ["node", "index.js"]
```

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  video-conference:
    build: .
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - PORT=3001
      - LIVEKIT_API_KEY=${LIVEKIT_API_KEY}
      - LIVEKIT_API_SECRET=${LIVEKIT_API_SECRET}
    restart: unless-stopped
```

## 🚀 Step 11.7: SSL/HTTPS Setup

Create `generate-ssl.sh`:

```bash
#!/bin/bash

# Generate SSL certificates for development
mkdir -p ssl

# Generate self-signed certificate
openssl req -x509 -newkey rsa:4096 -keyout ssl/key.pem -out ssl/cert.pem -days 365 -nodes -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"

echo "SSL certificates generated in ssl/ directory"
echo "For production, use Let's Encrypt or your hosting provider's SSL"
```

Update `server/index.js` for HTTPS:

```javascript
const https = require('https');
const fs = require('fs');

// ... existing code ...

if (process.env.NODE_ENV === 'production' || process.env.USE_HTTPS === 'true') {
  const httpsOptions = {
    key: fs.readFileSync('./ssl/key.pem'),
    cert: fs.readFileSync('./ssl/cert.pem')
  };
  
  https.createServer(httpsOptions, app).listen(PORT, () => {
    console.log(`HTTPS Server running on port ${PORT}`);
  });
} else {
  app.listen(PORT, () => {
    console.log(`HTTP Server running on port ${PORT}`);
  });
}
```

## ✅ What We've Accomplished

- ✅ Set up environment variables for different environments
- ✅ Created production build configuration
- ✅ Added static file serving for production
- ✅ Implemented CORS configuration
- ✅ Created Docker deployment option
- ✅ Added SSL/HTTPS support
- ✅ Production-ready server configuration

## 🔗 Next Steps

- **[Step 12: Advanced Features](./12-advanced-features.md)** - Chat history and notifications
- **[Back to Overview](./00-overview.md)** - Return to tutorial overview

---

**Continue to [Step 12: Advanced Features](./12-advanced-features.md)** 