import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Mic, MicOff, Volume2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";

const PHRASES = [
  { id: "1", text: "Bonjour, comment allez-vous ?", translation: "Hello, how are you?", difficulty: "A1" },
  { id: "2", text: "Je voudrais réserver une table", translation: "I would like to book a table", difficulty: "A2" },
  { id: "3", text: "Pourriez-vous m'indiquer le chemin ?", translation: "Could you show me the way?", difficulty: "B1" },
];

type FeedbackLevel = "none" | "recording" | "good" | "average" | "poor";

const VoiceScreen = () => {
  const navigate = useNavigate();
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackLevel>("none");
  const [isRecording, setIsRecording] = useState(false);

  const phrase = PHRASES[currentPhrase];

  const handleRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      // Simulate random feedback
      const results: FeedbackLevel[] = ["good", "average", "poor"];
      const result = results[Math.floor(Math.random() * results.length)];
      setFeedback(result);
    } else {
      setIsRecording(true);
      setFeedback("recording");
      // Auto-stop after 3s
      setTimeout(() => {
        setIsRecording(false);
        const results: FeedbackLevel[] = ["good", "good", "average", "poor"];
        setFeedback(results[Math.floor(Math.random() * results.length)]);
      }, 3000);
    }
  };

  const feedbackConfig = {
    good: { color: "bg-green-500", text: "Excellente prononciation ! 🎉", border: "border-green-500" },
    average: { color: "bg-yellow-500", text: "Pas mal, essaie encore ! 💪", border: "border-yellow-500" },
    poor: { color: "bg-red-500", text: "À retravailler 🔄", border: "border-red-500" },
    none: { color: "", text: "", border: "" },
    recording: { color: "", text: "", border: "" },
  };

  const nextPhrase = () => {
    setCurrentPhrase((p) => (p + 1) % PHRASES.length);
    setFeedback("none");
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-5 pt-6 pb-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-extrabold text-foreground">Prononciation</h1>
      </div>

      <div className="px-5 flex flex-col items-center">
        {/* Phrase card */}
        <div className="w-full bg-card border border-border rounded-2xl p-6 mb-6 text-center">
          <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full mb-3 inline-block">
            {phrase.difficulty}
          </span>
          <p className="text-xl font-bold text-foreground mb-2">{phrase.text}</p>
          <p className="text-sm text-muted-foreground">{phrase.translation}</p>
          <button className="mt-3 text-primary flex items-center gap-1 mx-auto text-sm">
            <Volume2 className="w-4 h-4" /> Écouter
          </button>
        </div>

        {/* Recording button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleRecord}
          className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 transition-all ${
            isRecording
              ? "bg-red-500 animate-pulse shadow-lg shadow-red-500/30"
              : "bg-primary shadow-lg shadow-primary/30"
          }`}
        >
          {isRecording ? (
            <MicOff className="w-10 h-10 text-primary-foreground" />
          ) : (
            <Mic className="w-10 h-10 text-primary-foreground" />
          )}
        </motion.button>

        <p className="text-sm text-muted-foreground mb-6">
          {isRecording ? "Parle maintenant..." : "Appuie pour enregistrer"}
        </p>

        {/* Feedback */}
        <AnimatePresence>
          {feedback !== "none" && feedback !== "recording" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`w-full rounded-2xl border-2 p-5 mb-4 ${feedbackConfig[feedback].border} bg-card`}
            >
              {/* Color bar */}
              <div className="flex gap-1 mb-3">
                {["poor", "average", "good"].map((level) => (
                  <div
                    key={level}
                    className={`flex-1 h-3 rounded-full transition-all ${
                      level === "poor" ? (feedback === "poor" || feedback === "average" || feedback === "good" ? "bg-red-400" : "bg-muted") :
                      level === "average" ? (feedback === "average" || feedback === "good" ? "bg-yellow-400" : "bg-muted") :
                      feedback === "good" ? "bg-green-400" : "bg-muted"
                    }`}
                  />
                ))}
              </div>
              <p className="text-center text-sm font-bold text-foreground">
                {feedbackConfig[feedback].text}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Next button */}
        <button
          onClick={nextPhrase}
          className="text-primary text-sm font-semibold"
        >
          Phrase suivante →
        </button>
      </div>

      <BottomNav />
    </div>
  );
};

export default VoiceScreen;
