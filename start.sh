#!/bin/bash
set -e

echo "Starting Video App with LiveKit..."

# Set default environment variables if not provided
export LIVEKIT_API_KEY=${LIVEKIT_API_KEY:-"your-api-key"}
export LIVEKIT_API_SECRET=${LIVEKIT_API_SECRET:-"your-api-secret"}
export NODE_ENV=${NODE_ENV:-"production"}

# Update LiveKit config with environment variables
sed -i "s/APIkey: your-api-key/APIkey: $LIVEKIT_API_KEY/g" /app/livekit.yaml
sed -i "s/APISecret: your-api-secret/APISecret: $LIVEKIT_API_SECRET/g" /app/livekit.yaml

# Start LiveKit server
livekit-server --config /app/livekit.yaml &

# Start Express server
cd /app/server && node index.js &

wait 