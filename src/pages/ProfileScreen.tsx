import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Settings, LogOut, ChevronRight, User, CheckCircle2, Clock, TrendingUp, Wifi, Trophy, FileText, Mic } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import AICompanion from "@/components/AICompanion";
import WeeklyProgress from "@/components/WeeklyProgress";
import { MOCK_VIDEOS } from "@/data/mockData";
import { clearAuthSession, getQuizHistory, getSavedConversations, getSavedVideoIds } from "@/lib/simStorage";

const interests = ["Langues", "Culture", "Voyages", "Musique"];
const levels = ["Débutant", "Intermédiaire", "Avancé"];

const CEFR_LEVELS = [
  { code: "A1", label: "Découverte", reached: true },
  { code: "A2", label: "Survie", reached: true },
  { code: "B1", label: "Seuil", reached: false, current: true },
  { code: "B2", label: "Avancé", reached: false },
];

const quickFeatures = [
  { label: "Hors-ligne", icon: Wifi, path: "/smart-cache", color: "text-primary" },
  { label: "Défis", icon: Trophy, path: "/challenges", color: "text-primary" },
  { label: "Rapport", icon: FileText, path: "/progress-report", color: "text-primary" },
  { label: "Voix", icon: Mic, path: "/voice", color: "text-primary" },
];

const ProfileScreen = () => {
  const navigate = useNavigate();
  const [selectedInterests, setSelectedInterests] = useState<Set<string>>(new Set(["Langues", "Musique"]));
  const [levelIdx] = useState(1);
  const [activeLesson, setActiveLesson] = useState("Vocabulaire");

  const downloadedVideos = getSavedVideoIds().flatMap((id) => {
    const video = MOCK_VIDEOS.find((item) => item.id === id);
    return video ? [video] : [];
  });

  const conversationEntries = Object.entries(getSavedConversations())
    .filter(([, messages]) => messages.length > 0)
    .slice(0, 3);

  const recentProgress = getQuizHistory()
    .slice(0, 3)
    .map((item, index) => ({
      key: `${item.videoId}-${item.answeredAt}-${index}`,
      label: item.question,
      detail: item.correct ? "Bonne réponse" : "À revoir",
      status: item.correct ? "Réussi !" : "Continue",
    }));

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
      <div className="px-5 pt-6 pb-4 flex items-center justify-between">
        <h1 className="text-xl font-extrabold text-foreground">Mon Profil</h1>
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
          <User className="w-5 h-5 text-primary" />
        </div>
      </div>

      <div className="px-5 mb-4">
        <div className="grid grid-cols-4 gap-2">
          {quickFeatures.map((f) => (
            <button
              key={f.label}
              onClick={() => navigate(f.path)}
              className="flex flex-col items-center gap-1.5 bg-card border border-border rounded-xl p-3 hover:bg-muted transition-colors"
            >
              <f.icon className={`w-5 h-5 ${f.color}`} />
              <span className="text-[10px] font-medium text-foreground">{f.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 mb-4">
        <div className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold text-foreground">Progression CECRL</h3>
          </div>
          <div className="flex items-end justify-between gap-1 mb-3">
            {CEFR_LEVELS.map((l, i) => (
              <div key={l.code} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className={`w-full rounded-t-lg transition-all ${
                    l.reached ? "bg-primary" : l.current ? "bg-primary/40" : "bg-muted"
                  }`}
                  style={{ height: `${(i + 1) * 20 + 10}px` }}
                />
                <span className={`text-[10px] font-bold ${l.reached || l.current ? "text-primary" : "text-muted-foreground"}`}>
                  {l.code}
                </span>
                <span className="text-[9px] text-muted-foreground">{l.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-5 mb-4">
        <div className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Clock className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">24h 30min</p>
            <p className="text-xs text-muted-foreground">Temps d'étude total</p>
          </div>
        </div>
      </div>

      <div className="px-5 mb-4">
        <WeeklyProgress />
      </div>

      <div className="px-5 mb-4">
        <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
          <div>
            <p className="text-xs font-bold text-primary mb-1">✅ Ce que tu sais déjà faire</p>
            <p className="text-xs text-muted-foreground">Te présenter, poser des questions simples, commander au restaurant, demander ton chemin.</p>
          </div>
          <div className="border-t border-border pt-3">
            <p className="text-xs font-bold text-primary mb-1">🚀 Ce que tu pourras bientôt faire</p>
            <p className="text-xs text-muted-foreground">Exprimer ton opinion, raconter une histoire, comprendre les actualités simples.</p>
          </div>
        </div>
      </div>

      <div className="px-5 mb-4">
        <div className="bg-card border border-border rounded-2xl p-4">
          <h3 className="text-sm font-bold text-foreground mb-3">Mes Téléchargements</h3>
          {downloadedVideos.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {downloadedVideos.map((video) => (
                <div key={video.id} className="rounded-xl overflow-hidden border border-border">
                  <img src={video.bgImage} alt={video.title} className="w-full h-20 object-cover" />
                  <p className="text-xs font-medium text-foreground p-2 text-center">{video.title}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Aucune vidéo enregistrée pour le moment.</p>
          )}
        </div>
      </div>

      <div className="px-5 mb-4">
        <div className="bg-card border border-border rounded-2xl p-4">
          <h3 className="text-sm font-bold text-foreground mb-2">Conversations IA</h3>
          {conversationEntries.length > 0 ? (
            <div className="space-y-3">
              {conversationEntries.map(([videoId, messages]) => {
                const videoTitle = MOCK_VIDEOS.find((video) => video.id === videoId)?.title ?? "Vidéo";
                return (
                  <div key={videoId} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <MessageBubbleIcon />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{videoTitle}</p>
                      <p className="text-xs text-muted-foreground">{messages.length} messages enregistrés</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <MessageBubbleIcon />
              </div>
              <p className="text-sm text-muted-foreground">Tes échanges avec l'IA apparaîtront ici.</p>
            </div>
          )}
        </div>
      </div>

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
                  activeLesson === lesson ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {lesson}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-5 mb-4">
        <div className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-foreground">Niveau actuel</span>
            <span className="text-sm font-bold text-primary">{levels[levelIdx]}</span>
          </div>
          <div className="flex gap-1 mb-2">
            {levels.map((_, i) => (
              <div key={i} className={`flex-1 h-2 rounded-full ${i <= levelIdx ? "bg-primary" : "bg-muted"}`} />
            ))}
          </div>
          <p className="text-muted-foreground text-xs">72% vers le niveau Avancé</p>
        </div>
      </div>

      <div className="px-5 mb-4">
        <div className="bg-card border border-border rounded-2xl p-4">
          <h3 className="text-sm font-bold text-foreground mb-3">Progrès Récents</h3>
          {recentProgress.length > 0 ? (
            <div className="space-y-3">
              {recentProgress.map((item) => (
                <div key={item.key} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-foreground block truncate">{item.label}</span>
                    <span className="text-sm text-muted-foreground">{item.detail}</span>
                  </div>
                  <span className="text-xs text-primary font-medium italic">{item.status}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Tes scores de quiz apparaîtront ici.</p>
          )}
        </div>
      </div>

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
                  selectedInterests.has(interest) ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {interest}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-5 space-y-2">
        {[
          { label: "Paramètres", icon: Settings, action: () => navigate("/settings") },
          {
            label: "Se déconnecter",
            icon: LogOut,
            action: () => {
              clearAuthSession();
              navigate("/");
            },
          },
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

      <AICompanion />
      <BottomNav />
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