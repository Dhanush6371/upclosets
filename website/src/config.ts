// Configuration for API endpoints
export const config = {
  // Backend API endpoint for getting LiveKit tokens
  // Default to localhost:5002, but can be overridden via env vars
  backendUrl: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5002',
  // LiveKit server URL (can be overridden via env vars)
  livekitUrl: import.meta.env.VITE_LIVEKIT_URL || 'ws://localhost:7880',
};

