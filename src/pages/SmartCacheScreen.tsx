import { useState } from "react";
import { motion } from "framer-motion";
import { Wifi, WifiOff, Battery, Download, Trash2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";

const SmartCacheScreen = () => {
  const navigate = useNavigate();
  const [cacheLevel] = useState(72); // percentage
  const [offlineDays] = useState(2.5);

  const cachedContent = [
    { type: "Vidéos", count: 18, size: "245 MB", icon: "🎬" },
    { type: "Réponses IA", count: 42, size: "12 MB", icon: "🤖" },
    { type: "Quiz & Tests", count: 30, size: "8 MB", icon: "📝" },
    { type: "Vocabulaire", count: 156, size: "2 MB", icon: "📚" },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-5 pt-6 pb-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-extrabold text-foreground">Smart Cache</h1>
      </div>

      {/* Hero explanation */}
      <div className="px-5 mb-5">
        <div className="bg-gradient-to-br from-primary to-srolla-blue-medium rounded-2xl p-5 text-primary-foreground">
          <div className="flex items-center gap-2 mb-2">
            <WifiOff className="w-5 h-5" />
            <h2 className="font-bold text-lg">Apprends hors-ligne</h2>
          </div>
          <p className="text-sm opacity-90">
            Smart Cache télécharge automatiquement tes prochaines leçons quand tu as du Wi-Fi — même 5 minutes suffisent !
          </p>
        </div>
      </div>

      {/* Offline reserve indicator */}
      <div className="px-5 mb-5">
        <div className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Battery className="w-5 h-5 text-primary" />
              <span className="text-sm font-bold text-foreground">Réserve hors-ligne</span>
            </div>
            <span className="text-xs font-bold text-primary">{offlineDays} jours</span>
          </div>
          <div className="w-full h-4 bg-muted rounded-full overflow-hidden mb-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${cacheLevel}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-primary to-srolla-blue-light"
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>267 / 500 MB utilisés</span>
            <span>{cacheLevel}%</span>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="px-5 mb-5">
        <h3 className="text-sm font-bold text-foreground mb-3">Comment ça marche</h3>
        <div className="space-y-3">
          {[
            { icon: <Wifi className="w-4 h-4" />, title: "Connexion Wi-Fi détectée", desc: "L'app précharge 2-3 jours de contenu" },
            { icon: <Download className="w-4 h-4" />, title: "Téléchargement silencieux", desc: "Vidéos, quiz et réponses IA préparés" },
            { icon: <WifiOff className="w-4 h-4" />, title: "Mode hors-ligne activé", desc: "Continue ton apprentissage sans internet" },
            { icon: <Trash2 className="w-4 h-4" />, title: "Nettoyage automatique", desc: "L'ancien contenu est supprimé pour libérer l'espace" },
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3 bg-card border border-border rounded-xl p-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                {step.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{step.title}</p>
                <p className="text-xs text-muted-foreground">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cached content */}
      <div className="px-5 mb-5">
        <h3 className="text-sm font-bold text-foreground mb-3">Contenu en cache</h3>
        <div className="grid grid-cols-2 gap-3">
          {cachedContent.map((item) => (
            <div key={item.type} className="bg-card border border-border rounded-xl p-3 text-center">
              <span className="text-2xl">{item.icon}</span>
              <p className="text-sm font-bold text-foreground mt-1">{item.count}</p>
              <p className="text-xs text-muted-foreground">{item.type}</p>
              <p className="text-[10px] text-primary font-medium mt-1">{item.size}</p>
            </div>
          ))}
        </div>
      </div>

      {/* App size info */}
      <div className="px-5 mb-5">
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
          <p className="text-xs text-primary font-medium text-center">
            📱 Taille de l'app : ~75 MB • Cache max : 500 MB • Nettoyage auto activé
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default SmartCacheScreen;
