#!/bin/sh
set -e

# Start Vite dev server (client)
cd /app/client && npm run dev -- --host 0.0.0.0 &

# Start Express with nodemon (server)
cd /app/server && npx nodemon index.js &

# Start LiveKit server
livekit-server --config /app/livekit.yaml &

wait 