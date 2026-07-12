#!/bin/bash

# Start Next.js server on port 3001 in background
cd /app/web-server
NODE_OPTIONS=--experimental-modules bun server.js &
NEXT_PID=$!

# Start backend server on port 3000
cd /app/backend
bun server.ts

# Kill Next.js server when backend exits
kill $NEXT_PID 2>/dev/null
