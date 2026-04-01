import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MOCK_QUIZZES } from "@/data/mockData";
import { X, Clock } from "lucide-react";

interface QuizOverlayProps {
  videoId: string;
  onClose: () => void;
  mandatory?: boolean;
}

const QuizOverlay = ({ videoId, onClose, mandatory = false }: QuizOverlayProps) => {
  const quiz = MOCK_QUIZZES.find((q) => q.videoId === videoId) || MOCK_QUIZZES[0];
  const [selected, setSelected] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(10);

  useEffect(() => {
    if (selected !== null) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [selected]);

  const handleSelect = useCallback((index: number) => {
    if (selected !== null) return;
    setSelected(index);
  }, [selected]);

  const isCorrect = selected === quiz.correctIndex;
  const optionLabels = ["A", "B", "C", "D"];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center px-5"
    >
      {!mandatory && (
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground">
          <X className="w-6 h-6" />
        </button>
      )}

      <div className="w-full max-w-sm">
        {/* Timer */}
        <div className="flex items-center justify-between mb-4">
          {mandatory && (
            <span className="text-xs text-primary font-semibold bg-primary/10 px-3 py-1 rounded-full">
              🤖 Quiz obligatoire
            </span>
          )}
          <div className="flex items-center gap-1 bg-card/80 px-3 py-1 rounded-lg ml-auto">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-primary text-sm font-bold">
              {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:{String(timeLeft % 60).padStart(2, "0")}
            </span>
          </div>
        </div>

        <h2 className="text-xl font-extrabold text-primary-foreground text-center mb-2">QUIZ TIME!</h2>
        <h3 className="text-primary-foreground text-base font-medium mb-6 text-center">{quiz.question}</h3>

        <div className="space-y-3">
          {quiz.options.map((option, i) => {
            let optionStyle = "bg-primary/80 border-primary/50 text-primary-foreground";
            if (selected !== null) {
              if (i === quiz.correctIndex) {
                optionStyle = "bg-green-500/90 border-green-400 text-white";
              } else if (i === selected && !isCorrect) {
                optionStyle = "bg-red-500/90 border-red-400 text-white";
              } else {
                optionStyle = "bg-primary/40 border-primary/30 text-primary-foreground/60";
              }
            }
            return (
              <motion.button
                key={i}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleSelect(i)}
                className={`w-full py-4 px-5 rounded-xl border font-medium text-sm text-left transition-all flex items-center gap-3 ${optionStyle}`}
              >
                <span className="font-bold">{optionLabels[i]})</span>
                <span>{option}</span>
                {selected !== null && i === quiz.correctIndex && <span className="ml-auto">✓</span>}
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence>
          {selected !== null && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
                  <circle cx="9" cy="11" r="2" fill="hsl(var(--primary-foreground))" />
                  <circle cx="19" cy="11" r="2" fill="hsl(var(--primary-foreground))" />
                  <path d="M9 17c0 0 2 3 5 3s5-3 5-3" stroke="hsl(var(--primary-foreground))" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3 flex-1">
                <p className="text-sm text-foreground">{isCorrect ? "Super ! " : ""}{quiz.explanation}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-6">
          {selected !== null ? (
            <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onClose} className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold text-base">
              Continuer
            </motion.button>
          ) : !mandatory ? (
            <button onClick={onClose} className="w-full py-3 rounded-xl text-muted-foreground text-sm font-medium border border-border">
              Passer
            </button>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
};

export default QuizOverlay;
