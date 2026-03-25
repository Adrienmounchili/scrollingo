import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MOCK_QUIZZES } from "@/data/mockData";
import { X, Clock } from "lucide-react";

interface QuizOverlayProps {
  videoId: string;
  onClose: () => void;
}

const QuizOverlay = ({ videoId, onClose }: QuizOverlayProps) => {
  const quiz = MOCK_QUIZZES.find((q) => q.videoId === videoId) || MOCK_QUIZZES[0];
  const [selected, setSelected] = useState<number | null>(null);
  const [timeLeft] = useState(10);

  const handleSelect = useCallback((index: number) => {
    if (selected !== null) return;
    setSelected(index);
  }, [selected]);

  const isCorrect = selected === quiz.correctIndex;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-40 bg-srolla-dark/90 backdrop-blur-sm flex flex-col items-center justify-center px-5"
    >
      <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground">
        <X className="w-6 h-6" />
      </button>

      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-6">
          <Clock className="w-4 h-4 text-primary" />
          <span className="text-primary text-sm font-semibold">{timeLeft}s</span>
          <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: `${timeLeft * 10}%` }} />
          </div>
        </div>

        <h3 className="text-primary-foreground text-lg font-bold mb-6 text-center">
          {quiz.question}
        </h3>

        <div className="space-y-3">
          {quiz.options.map((option, i) => {
            let optionStyle = "bg-card border-border text-foreground";
            if (selected !== null) {
              if (i === quiz.correctIndex) {
                optionStyle = "bg-srolla-success/20 border-srolla-success text-srolla-success";
              } else if (i === selected && !isCorrect) {
                optionStyle = "bg-srolla-error/20 border-srolla-error text-srolla-error";
              }
            }

            return (
              <motion.button
                key={i}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleSelect(i)}
                className={`w-full py-4 px-5 rounded-xl border font-medium text-sm text-left transition-all ${optionStyle}`}
              >
                {option}
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence>
          {selected !== null && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 rounded-xl bg-card border border-border"
            >
              <p className="text-sm text-muted-foreground">{quiz.explanation}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl text-muted-foreground text-sm font-medium border border-border"
          >
            Passer
          </button>
          {selected !== null && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold"
            >
              Continuer
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default QuizOverlay;
