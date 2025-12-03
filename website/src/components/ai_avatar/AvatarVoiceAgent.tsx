import { useState, useEffect } from "react";
import { useLocalParticipant } from "@livekit/components-react";
import { Mic, MicOff, X } from "lucide-react";
import Avatar3D from "./Avatar3D";

interface AvatarVoiceAgentProps {
  onClose?: () => void;
}

const AvatarVoiceAgent = ({ onClose }: AvatarVoiceAgentProps) => {
  const { localParticipant } = useLocalParticipant();
  const [isListening, setIsListening] = useState(
    localParticipant ? localParticipant.isMicrophoneEnabled : false
  );

  useEffect(() => {
    if (localParticipant) {
      setIsListening(localParticipant.isMicrophoneEnabled);
    }
  }, [localParticipant]);

  const toggleListening = () => {
    if (localParticipant) {
      const newListeningState = !isListening;
      localParticipant.setMicrophoneEnabled(newListeningState);
      setIsListening(newListeningState);
    }
  };

  const handleClose = () => {
    if (localParticipant) {
      localParticipant.setMicrophoneEnabled(false);
    }
    if (onClose) onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "6rem",
        right: "1.5rem",
        backgroundColor: "transparent",
        width: "250px",
        height: "300px",
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ flex: 1, position: 'relative', width: '100%', height: '100%' }}>
        <Avatar3D />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.5rem" }}>
        {/* Left: Mic toggle button */}
        <button
          onClick={toggleListening}
          style={{
            padding: "0.5rem",
            borderRadius: "50%",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(10px)",
            color: isListening ? "#D4AF37" : "#6b7280",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.3s ease",
          }}
          aria-label={isListening ? "Stop listening" : "Start listening"}
        >
          {isListening ? <Mic size={16} /> : <MicOff size={16} />}
        </button>

        {/* Right: Close (X) button */}
        <button
          onClick={handleClose}
          style={{
            padding: "0.5rem",
            borderRadius: "50%",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(10px)",
            color: "#6b7280",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.3s ease",
          }}
          aria-label="Close"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default AvatarVoiceAgent;

