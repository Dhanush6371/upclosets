import { useState, useEffect, useRef, useCallback } from 'react';
import { Room, RoomEvent, RemoteParticipant, RemoteTrack, RemoteTrackPublication, Track, createLocalAudioTrack } from 'livekit-client';
import { config } from '../config';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  channel: 'text' | 'voice';
  timestamp: Date;
}

interface UseLiveKitChatReturn {
  room: Room | null;
  isConnected: boolean;
  isConnecting: boolean;
  messages: ChatMessage[];
  isVoiceMode: boolean;
  isMuted: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  sendMessage: (text: string) => Promise<void>;
  toggleVoiceMode: () => Promise<void>;
  toggleMute: () => Promise<void>;
}

export function useLiveKitChat(): UseLiveKitChatReturn {
  const [room, setRoom] = useState<Room | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const roomRef = useRef<Room | null>(null);
  const localAudioTrackRef = useRef<any>(null);

  // Fetch LiveKit token from backend
  const getToken = async (roomName?: string): Promise<{ token: string; room: string }> => {
    try {
      const params = new URLSearchParams();
      params.append('name', 'user-' + Date.now());
      if (roomName) {
        params.append('room', roomName);
      }

      const response = await fetch(`${config.backendUrl}/getToken?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to get token');
      }
      const data = await response.json();
      return { token: data.token, room: data.room };
    } catch (err) {
      console.error('Error getting token:', err);
      throw new Error('Failed to get access token');
    }
  };

  // Connect to LiveKit room
  const connect = useCallback(async () => {
    if (isConnecting || isConnected) return;

    setIsConnecting(true);
    setError(null);

    try {
      const newRoom = new Room({
        adaptiveStream: true,
        dynacast: true,
      });

      // Set up event listeners
      newRoom.on(RoomEvent.Connected, () => {
        console.log('Connected to room');
        setIsConnected(true);
        setIsConnecting(false);
      });

      newRoom.on(RoomEvent.Disconnected, () => {
        console.log('Disconnected from room');
        setIsConnected(false);
        setIsConnecting(false);
        setRoom(null);
        roomRef.current = null;
      });

      // Register text stream handler for 'lk.chat' topic (LiveKit's recommended way)
      newRoom.registerTextStreamHandler('lk.chat', async (reader, participantInfo) => {
        try {
          // Read the entire text stream
          const text = await reader.readAll();
          
          // Only process messages from agent participants
          if (participantInfo && participantInfo.identity.startsWith('agent')) {
            const message: ChatMessage = {
              id: `text-${Date.now()}-${Math.random()}`,
              text,
              sender: 'agent',
              channel: 'text',
              timestamp: new Date(),
            };
            setMessages(prev => [...prev, message]);
          }
        } catch (err) {
          console.error('Error reading text stream:', err);
        }
      });

      // Also listen for transcriptions from agent's voice responses
      newRoom.on(RoomEvent.TranscriptionReceived, (transcription: any) => {
        try {
          if (transcription.participant && transcription.participant.identity.startsWith('agent')) {
            const message: ChatMessage = {
              id: Date.now().toString(),
              text: transcription.text,
              sender: 'agent',
              channel: 'voice',
              timestamp: new Date(),
            };
            setMessages(prev => {
              // Avoid duplicates - check if last message is similar
              const lastMsg = prev[prev.length - 1];
              if (lastMsg && lastMsg.sender === 'agent' && lastMsg.text === transcription.text) {
                return prev;
              }
              return [...prev, message];
            });
          }
        } catch (err) {
          console.error('Error parsing transcription:', err);
        }
      });

      newRoom.on(RoomEvent.ParticipantConnected, (participant: RemoteParticipant) => {
        console.log('Participant connected:', participant.identity);
        
        // Subscribe to agent's audio tracks
        participant.on('trackSubscribed', (track: RemoteTrack, _publication: RemoteTrackPublication) => {
          if (track.kind === Track.Kind.Audio) {
            const audioElement = track.attach();
            document.body.appendChild(audioElement);
            console.log('Subscribed to agent audio track');
          }
        });
      });

      newRoom.on(RoomEvent.TrackSubscribed, (track: RemoteTrack, _publication: RemoteTrackPublication, participant: RemoteParticipant) => {
        if (track.kind === Track.Kind.Audio && participant.identity.startsWith('agent')) {
          const audioElement = track.attach();
          document.body.appendChild(audioElement);
          console.log('Subscribed to agent audio track');
        }
      });

      newRoom.on(RoomEvent.TrackUnsubscribed, (track: RemoteTrack, _publication: RemoteTrackPublication, _participant: RemoteParticipant) => {
        track.detach();
      });

      // Connect to room
      const tokenData = await getToken();
      await newRoom.connect(config.livekitUrl, tokenData.token);
      
      roomRef.current = newRoom;
      setRoom(newRoom);

      // Ensure agent starts in text-only mode (disable voice replies by default)
      try {
        const payload = new TextEncoder().encode(JSON.stringify({ voice: false }));
        await newRoom.localParticipant.publishData(payload, { reliable: true } as any);
      } catch (e) {
        console.error('Failed to send initial voice control packet', e);
      }

      // Add welcome message
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        text: 'Welcome to UpClosets of NOVA! I\'m here to help you learn about our custom closet and storage solutions. How can I assist you today?',
        sender: 'agent',
        channel: 'text',
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);

    } catch (err: any) {
      console.error('Connection error:', err);
      setError(err.message || 'Failed to connect to chat');
      setIsConnecting(false);
    }
  }, [isConnecting, isConnected]);

  // Disconnect from room
  const disconnect = useCallback(async () => {
    if (roomRef.current) {
      // Stop local audio track if active
      if (localAudioTrackRef.current) {
        localAudioTrackRef.current.stop();
        localAudioTrackRef.current = null;
      }

      await roomRef.current.disconnect();
      roomRef.current = null;
      setRoom(null);
      setIsConnected(false);
      setIsVoiceMode(false);
      setIsMuted(false);
    }
  }, []);

  // Send text message
  const sendMessage = useCallback(async (text: string) => {
    if (!roomRef.current || !isConnected || !text.trim()) return;

    try {
      // Add user message to UI
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        text: text.trim(),
        sender: 'user',
        channel: 'text',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMessage]);

      // Send text message using LiveKit's sendText method (for lk.chat topic)
      await roomRef.current.localParticipant.sendText(text.trim(), {
        topic: 'lk.chat',
      });
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
    }
  }, [isConnected]);

  // Inform backend whether voice replies are enabled
  const sendVoiceControl = useCallback(async (enabled: boolean) => {
    if (!roomRef.current) return;
    try {
      const payload = new TextEncoder().encode(JSON.stringify({ voice: enabled }));
      await roomRef.current.localParticipant.publishData(payload, { reliable: true } as any);
    } catch (err) {
      console.error('Error sending voice control:', err);
    }
  }, []);

  // Toggle voice mode
  const toggleVoiceMode = useCallback(async () => {
    if (!roomRef.current || !isConnected) {
      await connect();
      return;
    }

    if (isVoiceMode) {
      // Disable voice mode
      if (localAudioTrackRef.current) {
        await localAudioTrackRef.current.stop();
        await roomRef.current.localParticipant.unpublishTrack(localAudioTrackRef.current);
        localAudioTrackRef.current = null;
      }
      setIsVoiceMode(false);
      setIsMuted(false);
      await sendVoiceControl(false);
    } else {
      // Enable voice mode
      try {
        const audioTrack = await createLocalAudioTrack();
        
        await roomRef.current.localParticipant.publishTrack(audioTrack);
        localAudioTrackRef.current = audioTrack;
        setIsVoiceMode(true);
        setIsMuted(false);
        await sendVoiceControl(true);
      } catch (err) {
        console.error('Error enabling microphone:', err);
        setError('Failed to enable microphone. Please check permissions.');
      }
    }
  }, [isVoiceMode, isConnected, connect, sendVoiceControl]);

  // Toggle mute
  const toggleMute = useCallback(async () => {
    if (!localAudioTrackRef.current) return;

    if (isMuted) {
      await localAudioTrackRef.current.unmute();
      setIsMuted(false);
    } else {
      await localAudioTrackRef.current.mute();
      setIsMuted(true);
    }
  }, [isMuted]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    room,
    isConnected,
    isConnecting,
    messages,
    isVoiceMode,
    isMuted,
    error,
    connect,
    disconnect,
    sendMessage,
    toggleVoiceMode,
    toggleMute,
  };
}

// Ensure agent starts in text-only mode after connection
// Trigger initial control signal when connection becomes true
// Note: this hook is inside the same module; consumers already re-render on isConnected
export function useInitVoiceOffWhenConnected(isConnected: boolean, sendVoiceControl: (enabled: boolean) => Promise<void>) {
  const initializedRef = useRef(false);
  useEffect(() => {
    if (isConnected && !initializedRef.current) {
      initializedRef.current = true;
      sendVoiceControl(false).catch(() => {});
    }
  }, [isConnected, sendVoiceControl]);
}

