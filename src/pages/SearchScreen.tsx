import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Search, ArrowLeft, Lock, CheckCircle2 } from "lucide-react";
import AICompanion from "@/components/AICompanion";

const CATEGORIES = [
  { id: "humor", label: "Humour", emoji: "😂", available: true },
  { id: "sports", label: "Sports", emoji: "⚽", available: true },
  { id: "news", label: "Actualités", emoji: "📰", available: true },
  { id: "music", label: "Musique", emoji: "🎵", available: false },
  { id: "science", label: "Science", emoji: "🔬", available: false },
  { id: "cinema", label: "Cinéma", emoji: "🎬", available: true },
];

const SEARCH_RESULTS = [
  { id: "s1", title: "Les expressions sportives en anglais", teacher: "@coach_english", category: "sports", level: "A2" },
  { id: "s2", title: "Comprendre les blagues en anglais", teacher: "@funny_english", category: "humor", level: "B1" },
  { id: "s3", title: "Vocabulaire des actualités", teacher: "@news_vocab", category: "news", level: "B2" },
  { id: "s4", title: "Chansons faciles pour apprendre", teacher: "@music_learn", category: "music", level: "A1" },
];

const SearchScreen = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredResults = SEARCH_RESULTS.filter((r) => {
    const matchesQuery = !query || r.title.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = !selectedCategory || r.category === selectedCategory;
    return matchesQuery && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <div className="px-5 pt-6 pb-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-foreground">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher un contenu..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Category Filters */}
      <div className="px-5 mb-4">
        <p className="text-sm font-semibold text-foreground mb-3">Catégories</p>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <motion.button
              key={cat.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => cat.available && setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1.5 transition-colors ${
                !cat.available
                  ? "bg-muted text-muted-foreground opacity-50"
                  : selectedCategory === cat.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-foreground"
              }`}
            >
              <span>{cat.emoji}</span>
              {cat.label}
              {!cat.available && <Lock className="w-3 h-3" />}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="px-5 space-y-3">
        <p className="text-sm font-semibold text-foreground">{filteredResults.length} résultats</p>
        {filteredResults.map((result) => {
          const cat = CATEGORIES.find((c) => c.id === result.category);
          return (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-2xl p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-bold text-foreground text-sm">{result.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{result.teacher}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                      Niveau {result.level}
                    </span>
                    {cat?.available ? (
                      <span className="text-xs text-primary flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Disponible pour ton niveau
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Débloquer au prochain niveau
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <AICompanion />
    </div>
  );
};

export default SearchScreen;
