#!/bin/bash

# Setup script for LiveKit environment variables

echo "Setting up LiveKit environment variables..."

# Create .env file in server directory
cat > server/.env << EOF
# LiveKit API Configuration
LIVEKIT_API_KEY=devkey_0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
LIVEKIT_API_SECRET=secret_0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef

# Server Configuration
PORT=3001
NODE_ENV=development
EOF

echo "✅ Environment file created at server/.env"
echo "✅ API keys and secrets updated to meet minimum requirements (64 characters each)"
echo ""
echo "Next steps:"
echo "1. Copy the environment variables to your shell:"
echo "   export LIVEKIT_API_KEY=devkey_0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
echo "   export LIVEKIT_API_SECRET=secret_0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
echo ""
echo "2. Or source the .env file:"
echo "   source server/.env"
echo ""
echo "3. Start the server:"
echo "   npm run dev:server" 