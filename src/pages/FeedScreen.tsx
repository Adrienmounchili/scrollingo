import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Share2, Bookmark, Home, Compass, Plus, Bell, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MOCK_VIDEOS } from "@/data/mockData";
import AICompanion from "@/components/AICompanion";
import QuizOverlay from "@/components/QuizOverlay";

const FeedScreen = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedVideos, setLikedVideos] = useState<Set<string>>(new Set());
  const [showQuiz, setShowQuiz] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"abonnements" | "pourtoi">("pourtoi");
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const scrollTop = scrollRef.current.scrollTop;
    const height = scrollRef.current.clientHeight;
    const newIndex = Math.round(scrollTop / height);
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
      // Show quiz randomly (30% chance)
      if (Math.random() < 0.3) {
        setTimeout(() => setShowQuiz(MOCK_VIDEOS[newIndex]?.id || null), 1500);
      }
    }
  }, [currentIndex]);

  const toggleLike = useCallback((id: string) => {
    setLikedVideos((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  return (
    <div className="h-screen w-full bg-srolla-dark relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-5 pt-4 pb-2">
        <h1 className="text-xl font-extrabold">
          <span className="text-primary-foreground">SROLL</span>
          <span className="text-primary">A</span>
        </h1>
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab("abonnements")}
            className={`text-sm font-semibold transition-colors ${
              activeTab === "abonnements" ? "text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            Abonnements
          </button>
          <button
            onClick={() => setActiveTab("pourtoi")}
            className={`text-sm font-semibold transition-colors ${
              activeTab === "pourtoi"
                ? "text-primary-foreground border-b-2 border-primary pb-1"
                : "text-muted-foreground"
            }`}
          >
            Pour Toi
          </button>
        </div>
      </div>

      {/* Video Feed */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="h-full overflow-y-scroll snap-y-mandatory scrollbar-hide"
      >
        {MOCK_VIDEOS.map((video, index) => (
          <div
            key={video.id}
            className="h-screen w-full snap-start relative flex items-end"
          >
            {/* Background image */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${video.bgImage})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-srolla-dark via-srolla-dark/30 to-transparent" />
            </div>

            {/* Right side actions */}
            <div className="absolute right-4 bottom-32 flex flex-col items-center gap-6 z-10">
              <button onClick={() => toggleLike(video.id)} className="flex flex-col items-center">
                <Heart
                  className={`w-7 h-7 transition-colors ${
                    likedVideos.has(video.id) ? "fill-primary text-primary" : "text-primary-foreground"
                  }`}
                />
                <span className="text-primary-foreground text-xs mt-1">{video.likes}</span>
              </button>
              <button className="flex flex-col items-center">
                <MessageCircle className="w-7 h-7 text-primary-foreground" />
                <span className="text-primary-foreground text-xs mt-1">{video.comments}</span>
              </button>
              <button>
                <Bookmark className="w-7 h-7 text-primary-foreground" />
              </button>
              <button>
                <Share2 className="w-7 h-7 text-primary-foreground" />
              </button>
            </div>

            {/* Bottom info */}
            <div className="relative z-10 px-5 pb-24 w-full pr-16">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-primary-foreground font-bold text-sm">{video.teacher}</span>
                <span className="text-xs font-bold bg-primary text-primary-foreground px-2 py-0.5 rounded-md">
                  {video.language}
                </span>
              </div>
              <h3 className="text-primary-foreground font-bold text-base mb-1">{video.title}</h3>
              <p className="text-primary-foreground/70 text-sm">
                {video.description} {video.languageFlag}
              </p>
            </div>
          </div>
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

      {/* Bottom Navigation */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-srolla-dark/95 backdrop-blur-sm border-t border-border">
        <div className="flex items-center justify-around py-2 pb-4">
          <button className="flex flex-col items-center gap-1 text-primary">
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
          <button
            onClick={() => navigate("/profile")}
            className="flex flex-col items-center gap-1 text-muted-foreground"
          >
            <User className="w-6 h-6" />
            <span className="text-[10px] font-medium">Profil</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedScreen;
