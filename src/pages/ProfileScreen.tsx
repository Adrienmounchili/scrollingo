import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Settings, LogOut, ChevronRight, Home, User, CheckCircle2 } from "lucide-react";

const interests = ["Langues", "Culture", "Voyages", "Musique"];
const levels = ["Débutant", "Intermédiaire", "Avancé"];

const downloads = [
  { title: "Actually & Late", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop" },
  { title: "Dog & Car", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop" },
];

const recentProgress = [
  { label: "Quiz d'hier", detail: "8/10", status: "Réussi !" },
  { label: "Révision: Les Couleurs", detail: "100%", status: "Complété" },
];

const ProfileScreen = () => {
  const navigate = useNavigate();
  const [selectedInterests, setSelectedInterests] = useState<Set<string>>(new Set(["Langues", "Musique"]));
  const [level] = useState(1);
  const [activeLesson, setActiveLesson] = useState("Vocabulaire");

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) => {
      const next = new Set(prev);
      if (next.has(interest)) next.delete(interest);
      else next.add(interest);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="px-5 pt-6 pb-4 flex items-center justify-between">
        <h1 className="text-xl font-extrabold text-foreground">Mon Profil</h1>
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
          <User className="w-5 h-5 text-primary" />
        </div>
      </div>

      {/* Downloads Section */}
      <div className="px-5 mb-4">
        <div className="bg-card border border-border rounded-2xl p-4">
          <h3 className="text-sm font-bold text-foreground mb-3">Mes Téléchargements</h3>
          <div className="grid grid-cols-2 gap-3">
            {downloads.map((dl) => (
              <div key={dl.title} className="rounded-xl overflow-hidden border border-border">
                <img src={dl.image} alt={dl.title} className="w-full h-20 object-cover" />
                <p className="text-xs font-medium text-foreground p-2 text-center">{dl.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Conversations */}
      <div className="px-5 mb-4">
        <div className="bg-card border border-border rounded-2xl p-4">
          <h3 className="text-sm font-bold text-foreground mb-2">Conversations IA</h3>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <MessageBubbleIcon />
            </div>
            <p className="text-sm text-muted-foreground">Tes échanges avec l'IA</p>
          </div>
        </div>
      </div>

      {/* Lessons */}
      <div className="px-5 mb-4">
        <div className="bg-card border border-border rounded-2xl p-4">
          <h3 className="text-sm font-bold text-foreground mb-3">Mes Leçons</h3>
          <div className="flex gap-2">
            {["Vocabulaire", "Grammaire", "Expressions"].map((lesson) => (
              <motion.button
                key={lesson}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveLesson(lesson)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeLesson === lesson
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {lesson}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Level */}
      <div className="px-5 mb-4">
        <div className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-foreground">Niveau actuel</span>
            <span className="text-sm font-bold text-primary">{levels[level]}</span>
          </div>
          <div className="flex gap-1 mb-2">
            {levels.map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-2 rounded-full ${i <= level ? "bg-primary" : "bg-muted"}`}
              />
            ))}
          </div>
          <p className="text-muted-foreground text-xs">72% vers le niveau Avancé</p>
        </div>
      </div>

      {/* Recent Progress */}
      <div className="px-5 mb-4">
        <div className="bg-card border border-border rounded-2xl p-4">
          <h3 className="text-sm font-bold text-foreground mb-3">Progrès Récents</h3>
          <div className="space-y-3">
            {recentProgress.map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                <div className="flex-1">
                  <span className="text-sm font-medium text-foreground">{item.label}</span>
                  <span className="text-sm text-muted-foreground ml-2">{item.detail}</span>
                </div>
                <span className="text-xs text-primary font-medium italic">{item.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interests */}
      <div className="px-5 mb-4">
        <div className="bg-card border border-border rounded-2xl p-4">
          <h3 className="text-sm font-bold text-foreground mb-3">Centres d'intérêt</h3>
          <div className="flex flex-wrap gap-2">
            {interests.map((interest) => (
              <motion.button
                key={interest}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleInterest(interest)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedInterests.has(interest)
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {interest}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="px-5 space-y-2">
        {[
          { label: "Paramètres", icon: Settings },
          { label: "Se déconnecter", icon: LogOut, action: () => navigate("/") },
        ].map((item) => (
          <button
            key={item.label}
            onClick={item.action}
            className="w-full flex items-center gap-3 bg-card border border-border rounded-2xl p-4 text-foreground hover:bg-muted transition-colors"
          >
            <item.icon className="w-5 h-5 text-muted-foreground" />
            <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        ))}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-background/95 backdrop-blur-sm border-t border-border">
        <div className="max-w-[430px] mx-auto flex items-center justify-around py-3 pb-5">
          <button onClick={() => navigate("/feed")} className="flex flex-col items-center gap-1 text-muted-foreground">
            <Home className="w-6 h-6" />
            <span className="text-[10px] font-medium">Accueil</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-primary">
            <User className="w-6 h-6" />
            <span className="text-[10px] font-medium">Profil</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-muted-foreground">
            <Settings className="w-6 h-6" />
            <span className="text-[10px] font-medium">Paramètres</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const MessageBubbleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    <circle cx="9" cy="10" r="1" fill="hsl(var(--primary))" />
    <circle cx="12" cy="10" r="1" fill="hsl(var(--primary))" />
    <circle cx="15" cy="10" r="1" fill="hsl(var(--primary))" />
  </svg>
);

export default ProfileScreen;
