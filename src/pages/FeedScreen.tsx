import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Share2, Bookmark, Home, User, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MOCK_VIDEOS } from "@/data/mockData";
import AICompanion from "@/components/AICompanion";
import QuizOverlay from "@/components/QuizOverlay";

const FeedScreen = () => {
  const navigate = useNavigate();
  const [likedVideos, setLikedVideos] = useState<Set<string>>(new Set());
  const [showQuiz, setShowQuiz] = useState<string | null>(null);
  const [viewedCards, setViewedCards] = useState<Set<string>>(new Set());

  const toggleLike = useCallback((id: string) => {
    setLikedVideos((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleCardViewed = useCallback((videoId: string) => {
    if (!viewedCards.has(videoId)) {
      setViewedCards((prev) => new Set(prev).add(videoId));
      // Show quiz after viewing a card (with delay)
      setTimeout(() => setShowQuiz(videoId), 800);
    }
  }, [viewedCards]);

  return (
    <div className="min-h-screen w-full bg-background relative">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border px-5 pt-4 pb-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-extrabold">
            <span className="text-foreground">SCROLL</span>
            <span className="text-primary">INGO</span>
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-medium bg-muted px-3 py-1 rounded-full">
              🔥 12 jours
            </span>
          </div>
        </div>
      </div>

      {/* Educational Cards Feed */}
      <div className="px-4 py-4 space-y-4 pb-24">
        {MOCK_VIDEOS.map((video) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm"
            onViewportEnter={() => handleCardViewed(video.id)}
          >
            {/* Card image */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={video.bgImage}
                alt={video.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-3 flex items-center gap-2">
                <span className="text-xs font-bold bg-primary text-primary-foreground px-2 py-1 rounded-md">
                  {video.language}
                </span>
                <span className="text-white text-xs">{video.languageFlag}</span>
              </div>
              {/* Keyword overlay like reference */}
              <div className="absolute top-4 left-4">
                <span className="text-2xl font-extrabold text-white drop-shadow-lg uppercase tracking-wide">
                  {video.title.split(" ").slice(0, 2).join(" ")}
                </span>
              </div>
            </div>

            {/* Card content */}
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <span className="text-foreground font-semibold text-sm">{video.teacher}</span>
              </div>
              <h3 className="text-foreground font-bold text-base mb-1">{video.title}</h3>
              <p className="text-muted-foreground text-sm mb-3">{video.description}</p>

              {/* Action bar */}
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <button
                  onClick={() => toggleLike(video.id)}
                  className="flex items-center gap-1.5"
                >
                  <Heart
                    className={`w-5 h-5 transition-colors ${
                      likedVideos.has(video.id) ? "fill-primary text-primary" : "text-muted-foreground"
                    }`}
                  />
                  <span className="text-xs text-muted-foreground">{video.likes}</span>
                </button>
                <button className="flex items-center gap-1.5">
                  <MessageCircle className="w-5 h-5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{video.comments}</span>
                </button>
                <button>
                  <Share2 className="w-5 h-5 text-muted-foreground" />
                </button>
                <button>
                  <Bookmark className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* AI Companion */}
      <AICompanion />

      {/* Quiz Overlay */}
      <AnimatePresence>
        {showQuiz && (
          <QuizOverlay videoId={showQuiz} onClose={() => setShowQuiz(null)} />
        )}
      </AnimatePresence>

      {/* Bottom Navigation - 3 items */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-background/95 backdrop-blur-sm border-t border-border">
        <div className="max-w-[430px] mx-auto flex items-center justify-around py-3 pb-5">
          <button className="flex flex-col items-center gap-1 text-primary">
            <Home className="w-6 h-6" />
            <span className="text-[10px] font-medium">Accueil</span>
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="flex flex-col items-center gap-1 text-muted-foreground"
          >
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

export default FeedScreen;
