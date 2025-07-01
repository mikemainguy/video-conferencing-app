# LiveKit Server Setup

This guide explains how to set up a LiveKit server and token server locally for development.

## Prerequisites

- Ubuntu 20.04 or later (tested on 22.04)
- A user with sudo privileges
- Node.js (v22+) and npm

## 1. Update Your System

```bash
sudo apt update && sudo apt upgrade -y
```

## 2. Install Node.js and LiveKit Server

Install Node.js and download the LiveKit server binary from the official site.

## 3. Run LiveKit Server

Set your API key and secret in a `.env` file or as environment variables:

```bash
LIVEKIT_API_KEY=your-livekit-api-key
LIVEKIT_API_SECRET=your-livekit-api-secret
```

Start the LiveKit server:

```bash
livekit-server --config livekit.yaml
```

## 4. Run the Express Token Server

In a separate terminal:

```bash
cd server
npm install
npm start
```

## 5. Generate Access Tokens

You can generate JWT access tokens for clients to join rooms using the Express server's `/api/token` endpoint.

## 6. Test Your Server

- Connect your client app to `ws://localhost:7880` (or `wss://localhost:7880` if using SSL)
- Use the generated token to join a room

## References
- [LiveKit Docs](https://docs.livekit.io/)
- [LiveKit GitHub](https://github.com/livekit/livekit-server)
- [LiveKit Server SDK JS](https://github.com/livekit/server-sdk-js)

---

**Note:** For production, always use SSL (wss) and secure your API keys and secrets. 