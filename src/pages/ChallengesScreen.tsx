import { useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Medal, Star, Flame, ArrowLeft, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";

const WEEKLY_CHALLENGES = [
  { id: "1", title: "Complete 5 leçons", target: 5, current: 3, reward: "🥉 Badge Bronze", icon: "📚" },
  { id: "2", title: "Réussis 3 quiz sans erreur", target: 3, current: 1, reward: "🎯 Précision", icon: "🧠" },
  { id: "3", title: "30 min d'écoute", target: 30, current: 22, reward: "🎧 Audiophile", icon: "👂" },
  { id: "4", title: "Parle avec l'IA 10 fois", target: 10, current: 7, reward: "💬 Social", icon: "🤖" },
];

const LEADERBOARD = [
  { rank: 1, name: "Apprenant_42", xp: 2450, level: "B1", isYou: false },
  { rank: 2, name: "LinguaFan", xp: 2380, level: "B1", isYou: false },
  { rank: 3, name: "PolyglotteJr", xp: 2200, level: "B1", isYou: false },
  { rank: 4, name: "Toi", xp: 2150, level: "B1", isYou: true },
  { rank: 5, name: "WordMaster", xp: 2100, level: "B1", isYou: false },
  { rank: 6, name: "FluentDream", xp: 1980, level: "B1", isYou: false },
];

const BADGES = [
  { icon: "🔥", name: "7 jours consécutifs", earned: true },
  { icon: "🏆", name: "Premier quiz parfait", earned: true },
  { icon: "📖", name: "100 mots appris", earned: true },
  { icon: "🌟", name: "Niveau B1 atteint", earned: false },
  { icon: "💎", name: "30 jours consécutifs", earned: false },
  { icon: "🎓", name: "Toutes catégories", earned: false },
];

const ChallengesScreen = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"challenges" | "leaderboard" | "badges">("challenges");

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-5 pt-6 pb-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-extrabold text-foreground">Défis de la semaine</h1>
      </div>

      {/* Tabs */}
      <div className="px-5 mb-4">
        <div className="flex gap-2">
          {([
            { key: "challenges", label: "Défis", icon: Flame },
            { key: "leaderboard", label: "Classement", icon: Users },
            { key: "badges", label: "Badges", icon: Medal },
          ] as const).map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                tab === t.key ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground"
              }`}
            >
              <t.icon className="w-3.5 h-3.5" /> {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === "challenges" && (
        <div className="px-5 space-y-3">
          <div className="bg-gradient-to-br from-primary to-srolla-blue-medium rounded-2xl p-4 text-primary-foreground mb-4">
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="w-5 h-5" />
              <span className="font-bold">Semaine 12</span>
            </div>
            <p className="text-sm opacity-90">Termine les défis pour gagner des badges et monter au classement !</p>
            <p className="text-xs opacity-70 mt-1">⏰ Reste 3 jours</p>
          </div>
          {WEEKLY_CHALLENGES.map((c) => {
            const pct = Math.min(100, (c.current / c.target) * 100);
            const done = c.current >= c.target;
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-card border rounded-xl p-4 ${done ? "border-primary/40 bg-primary/5" : "border-border"}`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl">{c.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-foreground">{c.title}</p>
                    <p className="text-xs text-muted-foreground">{c.reward}</p>
                  </div>
                  {done && <Star className="w-5 h-5 text-primary fill-primary" />}
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${done ? "bg-primary" : "bg-srolla-blue-medium"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1 text-right">
                  {c.current}/{c.target}
                </p>
              </motion.div>
            );
          })}
        </div>
      )}

      {tab === "leaderboard" && (
        <div className="px-5 space-y-2">
          <p className="text-xs text-muted-foreground mb-2">Classement anonyme — même niveau (B1)</p>
          {LEADERBOARD.map((u) => (
            <div
              key={u.rank}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                u.isYou ? "bg-primary/10 border-primary/30" : "bg-card border-border"
              }`}
            >
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                u.rank <= 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>
                {u.rank}
              </span>
              <div className="flex-1">
                <p className={`text-sm font-semibold ${u.isYou ? "text-primary" : "text-foreground"}`}>
                  {u.name} {u.isYou && "⭐"}
                </p>
              </div>
              <span className="text-sm font-bold text-primary">{u.xp} XP</span>
            </div>
          ))}
        </div>
      )}

      {tab === "badges" && (
        <div className="px-5">
          <div className="grid grid-cols-3 gap-3">
            {BADGES.map((b) => (
              <div
                key={b.name}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border text-center ${
                  b.earned ? "bg-primary/5 border-primary/30" : "bg-muted/50 border-border opacity-50"
                }`}
              >
                <span className="text-3xl">{b.icon}</span>
                <p className="text-[10px] font-medium text-foreground leading-tight">{b.name}</p>
                {b.earned && <span className="text-[9px] text-primary font-bold">Obtenu ✓</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default ChallengesScreen;
