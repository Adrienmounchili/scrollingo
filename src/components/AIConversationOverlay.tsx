import { useState } from "react";
import { motion } from "framer-motion";
import { X, Send } from "lucide-react";
import { AI_MESSAGES } from "@/data/mockData";

interface AIConversationOverlayProps {
  videoId: string;
  onClose: () => void;
  onSaveConversation: (videoId: string, messages: string[]) => void;
}

type Message = { from: "ai" | "user"; text: string };

const INITIAL_MESSAGES: Message[] = [
  { from: "ai", text: "Salut ! 👋 J'ai remarqué ce mot intéressant dans la vidéo." },
  { from: "ai", text: "Veux-tu qu'on le pratique ensemble ? 🎯" },
];

const AI_REPLIES = [
  "Excellent ! Continue comme ça ! 🌟",
  "Presque ! Essaie encore une fois 💪",
  "Parfait ! Tu progresses vite ! 🚀",
  "Bonne réponse ! Voici un autre exemple...",
  "Intéressant ! As-tu essayé de l'utiliser dans une phrase ?",
];

const AIConversationOverlay = ({ videoId, onClose, onSaveConversation }: AIConversationOverlayProps) => {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { from: "user" as const, text: input };
    const aiReply = { from: "ai" as const, text: AI_REPLIES[Math.floor(Math.random() * AI_REPLIES.length)] };
    const newMessages = [...messages, userMsg, aiReply];
    setMessages(newMessages);
    onSaveConversation(videoId, newMessages.map(m => `${m.from}: ${m.text}`));
    setInput("");
  };

  return (
    <motion.div
      initial={{ y: "-100%" }}
      animate={{ y: 0 }}
      exit={{ y: "-100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed top-0 left-0 right-0 h-1/2 z-40 bg-background/95 backdrop-blur-md rounded-b-3xl shadow-2xl border-b border-border flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-srolla-blue-medium flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 28 28" fill="none">
              <circle cx="9" cy="11" r="2.5" fill="white" />
              <circle cx="19" cy="11" r="2.5" fill="white" />
              <path d="M8 18c0 0 3 4 6 4s6-4 6-4" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-sm font-bold text-foreground">Compagnon IA</span>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3 scrollbar-hide">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${
                msg.from === "user"
                  ? "bg-primary text-primary-foreground rounded-br-sm"
                  : "bg-srolla-blue-light/20 text-foreground rounded-bl-sm"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="px-4 pb-4 pt-2 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Écris ta réponse..."
          className="flex-1 bg-muted rounded-full px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-srolla-blue-medium"
        />
        <button
          onClick={handleSend}
          className="w-10 h-10 rounded-full bg-primary flex items-center justify-center"
        >
          <Send className="w-4 h-4 text-primary-foreground" />
        </button>
      </div>
    </motion.div>
  );
};

export default AIConversationOverlay;
