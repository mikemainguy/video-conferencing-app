#!/bin/bash

# Clean script for video conferencing app
# Removes all node_modules directories from root and workspaces

set -e  # Exit on any error

echo "🧹 Cleaning all node_modules directories..."

# Function to check if directory exists and remove it
clean_directory() {
    local dir="$1"
    if [ -d "$dir" ]; then
        echo "  Removing $dir"
        rm -rf "$dir"
    else
        echo "  Skipping $dir (not found)"
    fi
}

# Clean root node_modules
echo "📁 Cleaning root node_modules..."
clean_directory "node_modules"

# Clean workspace node_modules
echo "📁 Cleaning workspace node_modules..."
clean_directory "client/node_modules"
clean_directory "server/node_modules"

# Clean any other potential node_modules (just in case)
echo "📁 Checking for any other node_modules..."
find . -name "node_modules" -type d -exec echo "  Found: {}" \; 2>/dev/null | grep -v "node_modules/node_modules" || true

echo "✅ Cleanup complete!"
echo ""
echo "To reinstall dependencies, run:"
echo "  npm run install:all" 