#!/bin/bash

# Create SSL directory if it doesn't exist
mkdir -p ssl

# Generate self-signed certificate
openssl req -x509 -newkey rsa:4096 -keyout ssl/express.key -out ssl/express.crt -days 365 -nodes -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"

echo "Self-signed SSL certificates generated:"
echo "  Key: ssl/express.key"
echo "  Cert: ssl/express.crt"
echo ""
echo "Note: You'll need to accept the self-signed certificate in your browser."
echo "For development, you can access https://localhost:3001" 