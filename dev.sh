#!/bin/bash

# Development server launcher for 4gotagain.com

PORT=8080
URL="http://localhost:$PORT"

echo "🚀 Starting development server..."
echo "📡 Server will be available at: $URL"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Open browser after a short delay (in background)
(sleep 1 && xdg-open "$URL" 2>/dev/null) &

# Start the server
python3 -m http.server $PORT
