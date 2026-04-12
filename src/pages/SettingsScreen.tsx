import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronRight, Wifi, Trophy, FileText, Mic, LogOut } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import AICompanion from "@/components/AICompanion";

const settingsItems = [
  { label: "Smart Cache (Hors-ligne)", icon: Wifi, path: "/smart-cache", desc: "Gérer le contenu hors-ligne" },
  { label: "Défis communautaires", icon: Trophy, path: "/challenges", desc: "Classement & badges" },
  { label: "Rapport de progression", icon: FileText, path: "/progress-report", desc: "Exporter en PDF" },
  { label: "Prononciation", icon: Mic, path: "/voice", desc: "Entraîne ta voix" },
];

const SettingsScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-5 pt-6 pb-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-extrabold text-foreground">Paramètres</h1>
      </div>

      <div className="px-5 space-y-2">
        {settingsItems.map((item) => (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className="w-full flex items-center gap-3 bg-card border border-border rounded-2xl p-4 text-foreground hover:bg-muted transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <item.icon className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        ))}

        <div className="pt-4">
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-3 bg-card border border-destructive/30 rounded-2xl p-4 text-destructive hover:bg-destructive/5 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="flex-1 text-left text-sm font-semibold">Se déconnecter</span>
          </button>
        </div>
      </div>

      <AICompanion />
      <BottomNav />
    </div>
  );
};

export default SettingsScreen;
