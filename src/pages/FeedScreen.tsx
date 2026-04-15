import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Share2, Bookmark, Download, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MOCK_VIDEOS } from "@/data/mockData";
import AICompanion from "@/components/AICompanion";
import QuizOverlay from "@/components/QuizOverlay";
import BottomNav from "@/components/BottomNav";
import AIConversationOverlay from "@/components/AIConversationOverlay";
import { toast } from "sonner";
import { cacheVideosLocally } from "@/lib/simStorage";

const getStoredLikes = (): Record<string, number> => {
  try { return JSON.parse(localStorage.getItem("scrollingo_likes") || "{}"); } catch { return {}; }
};
const getStoredSaved = (): string[] => {
  try { return JSON.parse(localStorage.getItem("scrollingo_saved") || "[]"); } catch { return []; }
};
const getStoredConvos = (): Record<string, string[]> => {
  try { return JSON.parse(localStorage.getItem("scrollingo_convos") || "{}"); } catch { return {}; }
};

const formatCount = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n);

const FeedScreen = () => {
  const navigate = useNavigate();
  const [likedVideos, setLikedVideos] = useState<Set<string>>(() => {
    const stored = getStoredLikes();
    return new Set(Object.keys(stored).filter(k => stored[k] > 0));
  });
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>(() => {
    const stored = getStoredLikes();
    const counts: Record<string, number> = {};
    MOCK_VIDEOS.forEach(v => { counts[v.id] = stored[v.id] ?? v.likes; });
    return counts;
  });
  const [savedVideos, setSavedVideos] = useState<Set<string>>(() => new Set(getStoredSaved()));
  const [showQuiz, setShowQuiz] = useState<string | null>(null);
  const [viewedCards, setViewedCards] = useState<Set<string>>(new Set());
  const [mandatoryQuiz, setMandatoryQuiz] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState<string>("1");
  const [savedConversations, setSavedConversations] = useState<Record<string, string[]>>(getStoredConvos);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  useEffect(() => {
    localStorage.setItem("scrollingo_convos", JSON.stringify(savedConversations));
  }, [savedConversations]);

  const toggleLike = useCallback((id: string) => {
    setLikedVideos(prev => {
      const next = new Set(prev);
      const wasLiked = next.has(id);
      if (wasLiked) next.delete(id); else next.add(id);

      setLikeCounts(prev2 => {
        const base = MOCK_VIDEOS.find(v => v.id === id)?.likes || 0;
        const updated = { ...prev2, [id]: wasLiked ? base : base + 1 };
        const toStore: Record<string, number> = {};
        Object.entries(updated).forEach(([k, v]) => {
          const orig = MOCK_VIDEOS.find(vid => vid.id === k)?.likes || 0;
          if (v !== orig) toStore[k] = 1;
        });
        localStorage.setItem("scrollingo_likes", JSON.stringify(toStore));
        return updated;
      });
      return next;
    });
  }, []);

  const toggleSave = useCallback((id: string) => {
    setSavedVideos(prev => {
      const next = new Set(prev);
      const video = MOCK_VIDEOS.find(v => v.id === id);
      if (next.has(id)) {
        next.delete(id);
        toast.info(`Retiré des téléchargements`);
      } else {
        next.add(id);
        const convo = savedConversations[id] || [];
        const convoText = convo.length > 0 ? ` + ${convo.length} messages IA` : "";
        toast.success(`Sauvegardé : "${video?.title}"${convoText}`);
      }
      localStorage.setItem("scrollingo_saved", JSON.stringify([...next]));
      return next;
    });
  }, [savedConversations]);

  const handleCardViewed = useCallback((videoId: string) => {
    setCurrentVideoId(videoId);

    const videoIndex = MOCK_VIDEOS.findIndex((video) => video.id === videoId);
    if (videoIndex >= 0) {
      cacheVideosLocally(
        MOCK_VIDEOS.slice(videoIndex, videoIndex + 3)
          .filter((video) => Boolean(video.videoUrl))
          .map((video) => ({ id: video.id, url: video.videoUrl }))
      );
    }

    Object.entries(videoRefs.current).forEach(([id, el]) => {
      if (!el) return;
      if (id === videoId) { el.play().catch(() => {}); }
      else { el.pause(); }
    });
    if (!viewedCards.has(videoId)) {
      setViewedCards(prev => new Set(prev).add(videoId));
      const isMandatory = Math.random() > 0.5;
      setMandatoryQuiz(isMandatory);
      setTimeout(() => setShowQuiz(videoId), 800);
    }
  }, [viewedCards]);

  const handleAIOpen = () => setShowAIChat(true);

  const handleSaveConversation = (videoId: string, messages: string[]) => {
    setSavedConversations(prev => ({ ...prev, [videoId]: messages }));
  };

  return (
    <div className="h-screen w-full bg-background relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-background/90 to-transparent px-5 pt-4 pb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-extrabold">
            <span className="text-foreground">SCROLL</span>
            <span className="text-primary">INGO</span>
          </h1>
          <span className="text-xs text-muted-foreground font-medium bg-srolla-blue-light/20 text-primary px-3 py-1 rounded-full">
            🔥 12 jours
          </span>
        </div>
      </div>

      <div className="h-full snap-y-mandatory overflow-y-scroll scrollbar-hide">
        {MOCK_VIDEOS.map((video) => (
          <div
            key={video.id}
            className="snap-start h-screen w-full relative flex-shrink-0"
          >
            {video.videoUrl ? (
              <video
                ref={el => { videoRefs.current[video.id] = el; }}
                src={video.videoUrl}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-300 ${showAIChat ? "blur-sm brightness-50" : ""}`}
                loop
                muted
                playsInline
                preload="metadata"
              />
            ) : (
              <img
                src={video.bgImage}
                alt={video.title}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-300 ${showAIChat ? "blur-sm brightness-50" : ""}`}
              />
            )}
            <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-all duration-300 ${showAIChat ? "bg-black/60" : ""}`} />

            <div className="absolute inset-0 flex flex-col justify-end pb-24 px-4">
              <div className="flex items-end gap-3">
                <div className="flex-1 mb-2">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-10 h-10 rounded-full bg-srolla-blue-medium/30 border-2 border-srolla-blue-medium flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white font-bold text-sm">{video.teacher}</span>
                    <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-md font-bold">
                      {video.language}
                    </span>
                    <span className="text-white text-xs">{video.languageFlag}</span>
                  </div>
                  <h3 className="text-white font-extrabold text-lg leading-tight mb-1">{video.title}</h3>
                  <p className="text-white/80 text-sm">{video.description}</p>
                  {video.newWords && video.newWords.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {video.newWords.map(w => (
                        <span key={w} className="text-[10px] bg-srolla-blue-light/30 text-white px-2 py-0.5 rounded-full">
                          {w}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-center gap-5 mb-4">
                  <button onClick={() => toggleLike(video.id)} className="flex flex-col items-center gap-1">
                    <Heart className={`w-7 h-7 transition-colors ${likedVideos.has(video.id) ? "fill-red-500 text-red-500" : "text-white"}`} />
                    <span className="text-white text-[11px] font-semibold">{formatCount(likeCounts[video.id] ?? video.likes)}</span>
                  </button>
                  <button className="flex flex-col items-center gap-1">
                    <MessageCircle className="w-7 h-7 text-white" />
                    <span className="text-white text-[11px] font-semibold">{video.comments}</span>
                  </button>
                  <button>
                    <Share2 className="w-7 h-7 text-white" />
                  </button>
                  <button onClick={() => toggleSave(video.id)}>
                    <Download className={`w-7 h-7 transition-colors ${savedVideos.has(video.id) ? "text-primary" : "text-white"}`} />
                  </button>
                  <button onClick={() => toggleSave(video.id)}>
                    <Bookmark className={`w-7 h-7 transition-colors ${savedVideos.has(video.id) ? "fill-primary text-primary" : "text-white"}`} />
                  </button>
                </div>
              </div>
            </div>

            <motion.div
              className="absolute top-1/2 left-0 w-1 h-1"
              onViewportEnter={() => handleCardViewed(video.id)}
            />
          </div>
        ))}
      </div>

      <AnimatePresence>
        {showAIChat && (
          <AIConversationOverlay
            videoId={currentVideoId}
            onClose={() => setShowAIChat(false)}
            onSaveConversation={handleSaveConversation}
          />
        )}
      </AnimatePresence>

      <AICompanion onOpenChat={handleAIOpen} />

      <AnimatePresence>
        {showQuiz && (
          <QuizOverlay videoId={showQuiz} onClose={() => setShowQuiz(null)} mandatory={mandatoryQuiz} />
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
};

export default FeedScreen;