# Step 2: Backend Setup

This step covers creating the Express server with LiveKit integration, setting up environment variables, and implementing the token generation endpoint.

## 🚀 Step 2.1: Create Express Server

Create `server/index.js`:

```javascript
const express = require('express');
const cors = require('cors');
const { AccessToken } = require('livekit-server-sdk');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Token generation endpoint
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

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## 🚀 Step 2.2: Environment Configuration

Create `server/.env`:

```bash
LIVEKIT_API_KEY=your_api_key
LIVEKIT_API_SECRET=your_api_secret
PORT=3001
NODE_ENV=development
```

## 🚀 Step 2.3: Add Scripts to package.json

Update `server/package.json`:

```json
{
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  }
}
```

## 🚀 Step 2.4: Test the Server

```bash
cd server
npm run dev
```

Test the health endpoint:
```bash
curl http://localhost:3001/api/health
```

## ✅ What We've Accomplished

- ✅ Created Express server with CORS support
- ✅ Implemented LiveKit token generation endpoint
- ✅ Added health check endpoint
- ✅ Set up environment variable configuration
- ✅ Added development scripts

## 🔗 Next Steps

- **[Step 3: Frontend Foundation](./03-frontend-foundation.md)** - Set up React app structure and routing
- **[Step 4: Core Components](./04-core-components.md)** - Create lobby and video room components

---

**Continue to [Step 3: Frontend Foundation](./03-frontend-foundation.md)** 