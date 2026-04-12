import { motion } from "framer-motion";
import { ArrowLeft, Download, BookOpen, Clock, Trophy, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import BottomNav from "@/components/BottomNav";

const reportData = {
  name: "Utilisateur Demo",
  level: "B1 — Seuil",
  studyHours: 24.5,
  streak: 12,
  wordsLearned: 156,
  quizzesCompleted: 42,
  quizAccuracy: 82,
  themes: [
    { name: "Salutations", status: "Complété", score: "95%" },
    { name: "Courses", status: "Complété", score: "88%" },
    { name: "Voyages", status: "En cours", score: "64%" },
    { name: "Nourriture", status: "Verrouillé", score: "—" },
  ],
  recentQuizzes: [
    { date: "10 Avr", topic: "Verbes irréguliers", score: "9/10" },
    { date: "8 Avr", topic: "Les couleurs", score: "10/10" },
    { date: "5 Avr", topic: "Ser vs Estar", score: "7/10" },
    { date: "3 Avr", topic: "Expressions idiom.", score: "8/10" },
  ],
};

const ProgressReportScreen = () => {
  const navigate = useNavigate();

  const handleExport = () => {
    toast.success("📄 Rapport PDF généré ! (simulation)");
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-5 pt-6 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-extrabold text-foreground">Rapport</h1>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleExport}
          className="flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-bold"
        >
          <Download className="w-4 h-4" /> PDF
        </motion.button>
      </div>

      {/* PDF Preview Card */}
      <div className="px-5">
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-srolla-blue-medium p-5 text-primary-foreground">
            <h2 className="text-lg font-extrabold">SCROLLINGO</h2>
            <p className="text-sm opacity-90">Rapport de progression</p>
            <p className="text-xs opacity-70 mt-1">{reportData.name} • Avril 2026</p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-px bg-border">
            {[
              { icon: BarChart3, label: "Niveau CECRL", value: reportData.level },
              { icon: Clock, label: "Heures d'étude", value: `${reportData.studyHours}h` },
              { icon: BookOpen, label: "Mots appris", value: reportData.wordsLearned },
              { icon: Trophy, label: "Quiz réussis", value: `${reportData.quizzesCompleted} (${reportData.quizAccuracy}%)` },
            ].map((stat) => (
              <div key={stat.label} className="bg-card p-4 flex items-start gap-2">
                <stat.icon className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                  <p className="text-sm font-bold text-foreground">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Themes */}
          <div className="p-4 border-t border-border">
            <h3 className="text-sm font-bold text-foreground mb-3">Thèmes étudiés</h3>
            <div className="space-y-2">
              {reportData.themes.map((t) => (
                <div key={t.name} className="flex items-center justify-between text-sm">
                  <span className="text-foreground">{t.name}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      t.status === "Complété" ? "bg-green-100 text-green-700" :
                      t.status === "En cours" ? "bg-primary/10 text-primary" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {t.status}
                    </span>
                    <span className="text-xs text-muted-foreground w-8 text-right">{t.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quiz History */}
          <div className="p-4 border-t border-border">
            <h3 className="text-sm font-bold text-foreground mb-3">Derniers quiz</h3>
            <div className="space-y-2">
              {reportData.recentQuizzes.map((q) => (
                <div key={q.date + q.topic} className="flex items-center justify-between text-sm">
                  <span className="text-xs text-muted-foreground w-14">{q.date}</span>
                  <span className="text-foreground flex-1">{q.topic}</span>
                  <span className="text-xs font-bold text-primary">{q.score}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-muted/50 p-3 text-center">
            <p className="text-[10px] text-muted-foreground">
              Généré par SCROLLINGO • {new Date().toLocaleDateString("fr-FR")}
            </p>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default ProgressReportScreen;
