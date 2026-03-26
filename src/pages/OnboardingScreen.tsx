import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { BookOpen, Bot, BrainCircuit } from "lucide-react";

const steps = [
  {
    icon: BookOpen,
    title: "Apprends en scrollant",
    description: "Découvre des contenus éducatifs captivants et apprends naturellement en scrollant.",
  },
  {
    icon: Bot,
    title: "Ton compagnon IA",
    description: "Un assistant intelligent qui t'accompagne, te donne des astuces et t'encourage.",
  },
  {
    icon: BrainCircuit,
    title: "Quiz personnalisés",
    description: "Après chaque contenu, teste tes connaissances avec des quiz adaptés à ton niveau.",
  },
];

const OnboardingScreen = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate("/feed");
    }
  };

  const step = steps[currentStep];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-between px-6 py-12">
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center text-center"
          >
            <div className="w-28 h-28 rounded-full bg-primary/15 flex items-center justify-center mb-8">
              <step.icon className="w-14 h-14 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">{step.title}</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex gap-2 mb-8">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === currentStep ? "w-8 bg-primary" : "w-2 bg-muted"
            }`}
          />
        ))}
      </div>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleNext}
        className="w-full max-w-sm py-4 bg-primary text-primary-foreground rounded-xl font-bold text-base"
      >
        {currentStep === steps.length - 1 ? "C'est parti ! 🚀" : "Suivant"}
      </motion.button>

      {currentStep < steps.length - 1 && (
        <button
          onClick={() => navigate("/feed")}
          className="mt-4 text-muted-foreground text-sm"
        >
          Passer
        </button>
      )}
    </div>
  );
};

export default OnboardingScreen;
