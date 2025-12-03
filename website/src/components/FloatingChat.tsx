import { useState, useEffect, useRef } from "react";
import {
  MessageCircle,
  X,
  Send,
  Mic,
  MicOff,
  Image as ImageIcon,
  Package,
  Loader2,
  User,
  MessageSquare,
} from "lucide-react";
import { useRouter } from "../utils/router";
import { useLiveKitChat } from "../hooks/useLiveKitChat";
import Avatar3D from "./Avatar3D";

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [showAvatar, setShowAvatar] = useState(false);
  const { navigate } = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
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
  } = useLiveKitChat();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Connect when chat opens
  useEffect(() => {
    if (isOpen && !isConnected && !isConnecting) {
      connect();
    }
  }, [isOpen, isConnected, isConnecting, connect]);

  // Disconnect when chat closes
  useEffect(() => {
    if (!isOpen && isConnected) {
      disconnect();
    }
  }, [isOpen, isConnected, disconnect]);

  const quickActions = [
    {
      icon: <Send size={18} />,
      label: "Consultation",
      action: () => navigate("/contact"),
    },
    {
      icon: <ImageIcon size={18} />,
      label: "Catalog",
      action: () => navigate("/gallery"),
    },
    {
      icon: <Package size={18} />,
      label: "Track Order",
      action: () => navigate("/process"),
    },
  ];

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (message.trim() && isConnected) {
      await sendMessage(message);
      setMessage("");
    }
  };

  const handleMicClick = async () => {
    if (!isConnected) {
      await connect();
      // Wait a bit for connection, then enable voice
      setTimeout(() => {
        toggleVoiceMode();
      }, 1000);
      return;
    }
    await toggleVoiceMode();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white rounded-2xl shadow-2xl w-80 md:w-96 overflow-hidden animate-slide-up">
          <div className="bg-gold text-white p-4 flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-lg">UpClosets Assistant</h3>
              <p className="text-sm opacity-90">How can I help you today?</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAvatar(!showAvatar)}
                className="hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
                title={showAvatar ? "Show chat" : "Show avatar"}
              >
                {showAvatar ? <MessageSquare size={20} /> : <User size={20} />}
              </button>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
            >
              <X size={24} />
            </button>
            </div>
          </div>

          {showAvatar ? (
            <div className="h-96 bg-gradient-to-b from-blue-50 to-purple-50">
              <Avatar3D />
            </div>
          ) : (
          <div className="p-4 h-64 overflow-y-auto bg-light-bg">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-3 text-sm">
                {error}
              </div>
            )}

            {isConnecting && (
              <div className="flex items-center justify-center py-8">
                <Loader2 size={24} className="animate-spin text-gold" />
                <span className="ml-2 text-dark-text">
                  Connecting to assistant...
                </span>
              </div>
            )}

            {!isConnecting && (
              <div className="space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-3 rounded-lg shadow-sm ${
                      msg.sender === "user"
                        ? "bg-gold text-white ml-auto max-w-[80%]"
                        : "bg-white text-dark-text"
                    }`}
                  >
                    {msg.sender === "agent" && (
                      <div className="mb-1">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            msg.channel === "voice"
                              ? "bg-green-100 text-green-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {msg.channel === "voice" ? "Voice" : "Text"}
                        </span>
                      </div>
                    )}
                    <p className="text-sm">{msg.text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        msg.sender === "user"
                          ? "text-white/70"
                          : "text-gray-500"
                      }`}
                    >
                      {msg.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                ))}
                {isVoiceMode && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded text-sm">
                    {isMuted ? "🔇 Microphone muted" : "🎤 Listening..."}
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
          )}

          <div className="p-4 bg-white border-t">
            <div className="flex flex-wrap gap-2 mb-3">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => {
                    action.action();
                    setIsOpen(false);
                  }}
                  className="flex items-center space-x-2 bg-light-bg hover:bg-gold hover:text-white text-dark-text px-3 py-2 rounded-full text-sm font-medium transition-all"
                >
                  {action.icon}
                  <span>{action.label}</span>
                </button>
              ))}
            </div>

            <div className="flex space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    handleSendMessage();
                  }
                }}
                placeholder={
                  isVoiceMode ? "Voice mode active..." : "Type your message..."
                }
                disabled={isVoiceMode || !isConnected}
                className={`flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-gold ${
                  isVoiceMode || !isConnected
                    ? "bg-gray-100 cursor-not-allowed"
                    : ""
                }`}
              />
              <button
                onClick={handleSendMessage}
                disabled={!isConnected || isVoiceMode || !message.trim()}
                className={`p-2 rounded-full transition-colors ${
                  isConnected && !isVoiceMode && message.trim()
                    ? "bg-gold text-white hover:bg-opacity-90"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                <Send size={20} />
              </button>
              <button
                onClick={handleMicClick}
                className={`p-2 rounded-full transition-colors ${
                  isVoiceMode
                    ? isMuted
                      ? "bg-gray-300 text-gray-600 hover:bg-gray-400"
                      : "bg-green-500 text-white hover:bg-green-600"
                    : "bg-light-bg text-dark-text hover:bg-gold hover:text-white"
                }`}
                title={
                  isVoiceMode
                    ? isMuted
                      ? "Unmute microphone"
                      : "Mute microphone"
                    : "Start voice chat"
                }
              >
                {isVoiceMode ? (
                  isMuted ? (
                    <MicOff size={20} />
                  ) : (
                    <Mic size={20} />
                  )
                ) : (
                  <Mic size={20} />
                )}
              </button>
            </div>
            {isVoiceMode && (
              <div className="mt-2 flex justify-center">
                <button
                  onClick={toggleMute}
                  className={`px-4 py-1 rounded-full text-sm transition-colors ${
                    isMuted
                      ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      : "bg-green-100 text-green-700 hover:bg-green-200"
                  }`}
                >
                  {isMuted ? "Unmute" : "Mute"}
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-white text-gold border-2 border-gold rounded-full p-4 shadow-2xl hover:shadow-gold/50 hover:scale-110 transition-all duration-300 animate-pulse-soft"
        >
          <MessageCircle size={32} />
        </button>
      )}
    </div>
  );
}
