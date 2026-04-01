import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Home, Grid3X3, User, Settings, Lock, CheckCircle2, ChevronRight } from "lucide-react";
import AICompanion from "@/components/AICompanion";

const THEMES = [
  {
    id: "greetings",
    title: "Salutations",
    emoji: "👋",
    unlocked: true,
    progress: 80,
    vocabCount: 15,
    grammarCount: 3,
  },
  {
    id: "shopping",
    title: "Shopping",
    emoji: "🛍️",
    unlocked: true,
    progress: 45,
    vocabCount: 22,
    grammarCount: 4,
  },
  {
    id: "travel",
    title: "Voyages",
    emoji: "✈️",
    unlocked: false,
    progress: 0,
    vocabCount: 30,
    grammarCount: 5,
  },
  {
    id: "food",
    title: "Nourriture",
    emoji: "🍕",
    unlocked: false,
    progress: 0,
    vocabCount: 25,
    grammarCount: 4,
  },
];

const CategoriesScreen = () => {
  const navigate = useNavigate();
  const [expandedTheme, setExpandedTheme] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-5 pt-6 pb-4">
        <h1 className="text-xl font-extrabold text-foreground">Catégories</h1>
        <p className="text-muted-foreground text-sm mt-1">Apprends par thèmes structurés</p>
      </div>

      <div className="px-4 space-y-3">
        {THEMES.map((theme) => (
          <motion.div
            key={theme.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-card border border-border rounded-2xl overflow-hidden ${
              !theme.unlocked ? "opacity-60" : ""
            }`}
          >
            <button
              onClick={() => theme.unlocked && setExpandedTheme(expandedTheme === theme.id ? null : theme.id)}
              className="w-full p-4 flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl">
                {theme.emoji}
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground">{theme.title}</span>
                  {!theme.unlocked && <Lock className="w-4 h-4 text-muted-foreground" />}
                  {theme.unlocked && theme.progress === 100 && <CheckCircle2 className="w-4 h-4 text-primary" />}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">{theme.vocabCount} mots</span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">{theme.grammarCount} règles</span>
                </div>
                {theme.unlocked && (
                  <div className="mt-2 h-1.5 rounded-full bg-muted w-full">
                    <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${theme.progress}%` }} />
                  </div>
                )}
              </div>
              {theme.unlocked && <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${expandedTheme === theme.id ? "rotate-90" : ""}`} />}
            </button>

            {expandedTheme === theme.id && theme.unlocked && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                className="px-4 pb-4 space-y-2"
              >
                <button className="w-full py-3 px-4 bg-primary/5 border border-primary/20 rounded-xl text-left flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">📚 Vocabulaire</span>
                  <span className="text-xs text-primary font-semibold">{theme.vocabCount} mots</span>
                </button>
                <button className="w-full py-3 px-4 bg-primary/5 border border-primary/20 rounded-xl text-left flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">📝 Grammaire</span>
                  <span className="text-xs text-primary font-semibold">{theme.grammarCount} règles</span>
                </button>
                <button className="w-full py-3 px-4 bg-primary/5 border border-primary/20 rounded-xl text-left flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">🧠 Test du thème</span>
                  <span className="text-xs text-muted-foreground">Débloquer le suivant</span>
                </button>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {!THEMES[2].unlocked && (
        <div className="px-5 mt-4">
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4">
            <p className="text-sm text-foreground font-medium">🔒 Thèmes verrouillés</p>
            <p className="text-xs text-muted-foreground mt-1">Réussis le test du thème précédent pour débloquer la suite !</p>
          </div>
        </div>
      )}

      <AICompanion />

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-background/95 backdrop-blur-sm border-t border-border">
        <div className="max-w-[430px] mx-auto flex items-center justify-around py-3 pb-5">
          <button onClick={() => navigate("/feed")} className="flex flex-col items-center gap-1 text-muted-foreground">
            <Home className="w-6 h-6" />
            <span className="text-[10px] font-medium">Accueil</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-primary">
            <Grid3X3 className="w-6 h-6" />
            <span className="text-[10px] font-medium">Catégories</span>
          </button>
          <button onClick={() => navigate("/profile")} className="flex flex-col items-center gap-1 text-muted-foreground">
            <User className="w-6 h-6" />
            <span className="text-[10px] font-medium">Profil</span>
          </button>
          <button onClick={() => navigate("/settings")} className="flex flex-col items-center gap-1 text-muted-foreground">
            <Settings className="w-6 h-6" />
            <span className="text-[10px] font-medium">Paramètres</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoriesScreen;
