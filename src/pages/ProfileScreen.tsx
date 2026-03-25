import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Settings, LogOut, ChevronRight, Home, Compass, Plus, Bell, User } from "lucide-react";

const interests = ["Sports", "Musique", "Humour", "Actualités", "Cuisine", "Voyages"];
const levels = ["Débutant", "Intermédiaire", "Avancé"];

const ProfileScreen = () => {
  const navigate = useNavigate();
  const [selectedInterests, setSelectedInterests] = useState<Set<string>>(new Set(["Musique", "Humour"]));
  const [level] = useState(1); // 0=Débutant, 1=Intermédiaire, 2=Avancé

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) => {
      const next = new Set(prev);
      if (next.has(interest)) next.delete(interest);
      else next.add(interest);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-srolla-dark pb-24">
      {/* Header */}
      <div className="px-5 pt-6 pb-4 flex items-center justify-between">
        <h1 className="text-xl font-extrabold text-primary-foreground">Mon Profil</h1>
        <button className="text-muted-foreground">
          <Settings className="w-6 h-6" />
        </button>
      </div>

      {/* Avatar & Info */}
      <div className="flex flex-col items-center px-5 mb-8">
        <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mb-3 border-2 border-primary">
          <User className="w-12 h-12 text-primary" />
        </div>
        <h2 className="text-lg font-bold text-primary-foreground">@learner_42</h2>
        <p className="text-muted-foreground text-sm">Membre depuis mars 2025</p>
      </div>

      {/* Level */}
      <div className="px-5 mb-6">
        <div className="bg-card border border-border rounded-xl p-4">
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

      {/* Stats */}
      <div className="px-5 mb-6 grid grid-cols-3 gap-3">
        {[
          { label: "Vidéos vues", value: "142" },
          { label: "Quiz réussis", value: "38" },
          { label: "Jours actifs", value: "12" },
        ].map((stat) => (
          <div key={stat.label} className="bg-card border border-border rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-primary">{stat.value}</p>
            <p className="text-[10px] text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Interests */}
      <div className="px-5 mb-6">
        <h3 className="text-sm font-semibold text-foreground mb-3">Centres d'intérêt</h3>
        <div className="flex flex-wrap gap-2">
          {interests.map((interest) => (
            <motion.button
              key={interest}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleInterest(interest)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedInterests.has(interest)
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-muted-foreground"
              }`}
            >
              {interest}
            </motion.button>
          ))}
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
            className="w-full flex items-center gap-3 bg-card border border-border rounded-xl p-4 text-foreground hover:bg-muted transition-colors"
          >
            <item.icon className="w-5 h-5 text-muted-foreground" />
            <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        ))}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-srolla-dark/95 backdrop-blur-sm border-t border-border">
        <div className="flex items-center justify-around py-2 pb-4">
          <button onClick={() => navigate("/feed")} className="flex flex-col items-center gap-1 text-muted-foreground">
            <Home className="w-6 h-6" />
            <span className="text-[10px] font-medium">Accueil</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-muted-foreground">
            <Compass className="w-6 h-6" />
            <span className="text-[10px] font-medium">Découvrir</span>
          </button>
          <button className="w-12 h-12 rounded-full bg-primary flex items-center justify-center -mt-4 shadow-lg">
            <Plus className="w-6 h-6 text-primary-foreground" />
          </button>
          <button className="flex flex-col items-center gap-1 text-muted-foreground relative">
            <Bell className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full text-[8px] text-primary-foreground font-bold flex items-center justify-center">
              3
            </span>
            <span className="text-[10px] font-medium">Boîte</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-primary">
            <User className="w-6 h-6" />
            <span className="text-[10px] font-medium">Profil</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
