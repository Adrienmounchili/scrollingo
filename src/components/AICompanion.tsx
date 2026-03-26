import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const AI_COMPANION_MESSAGES = [
  "Veux-tu répéter ce mot ? 🎧",
  "Super progression ! 🌟",
  "Écoute bien cette règle 📖",
  "Répète après moi ! 🗣️",
  "Tu as appris 5 nouveaux mots ! 🔥",
  "Nouveau mot débloqué ! 🔓",
  "Prêt pour un quiz ? 🧠",
];

const AICompanion = () => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [showBubble, setShowBubble] = useState(true);

  const handleTap = useCallback(() => {
    setMessageIndex((prev) => (prev + 1) % AI_COMPANION_MESSAGES.length);
    setShowBubble(true);
  }, []);

  return (
    <div className="fixed bottom-24 left-4 z-30 flex items-end gap-2">
      <AnimatePresence>
        {showBubble && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3 max-w-[200px] shadow-lg"
          >
            <p className="text-xs text-foreground leading-relaxed">
              {AI_COMPANION_MESSAGES[messageIndex]}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={handleTap}
        className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg animate-float"
      >
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <circle cx="9" cy="11" r="2.5" fill="hsl(var(--primary-foreground))" />
          <circle cx="19" cy="11" r="2.5" fill="hsl(var(--primary-foreground))" />
          <path
            d="M8 18c0 0 3 4 6 4s6-4 6-4"
            stroke="hsl(var(--primary-foreground))"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </motion.button>
    </div>
  );
};

export default AICompanion;
