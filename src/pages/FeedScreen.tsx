import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Share2, Bookmark, Download, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MOCK_VIDEOS } from "@/data/mockData";
import AICompanion from "@/components/AICompanion";
import QuizOverlay from "@/components/QuizOverlay";
import BottomNav from "@/components/BottomNav";
import AIConversationOverlay from "@/components/AIConversationOverlay";
import { toast } from "sonner";

const FeedScreen = () => {
  const navigate = useNavigate();
  const [likedVideos, setLikedVideos] = useState<Set<string>>(new Set());
  const [showQuiz, setShowQuiz] = useState<string | null>(null);
  const [viewedCards, setViewedCards] = useState<Set<string>>(new Set());
  const [mandatoryQuiz, setMandatoryQuiz] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState<string>("1");
  const [savedConversations, setSavedConversations] = useState<Record<string, string[]>>({});

  const toggleLike = useCallback((id: string) => {
    setLikedVideos((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleDownload = useCallback((videoId: string) => {
    const video = MOCK_VIDEOS.find(v => v.id === videoId);
    const convo = savedConversations[videoId] || [];
    const convoText = convo.length > 0 ? ` + ${convo.length} messages IA` : "";
    toast.success(`Sauvegardé : "${video?.title}"${convoText} + vocabulaire + tests`);
  }, [savedConversations]);

  const handleCardViewed = useCallback((videoId: string) => {
    setCurrentVideoId(videoId);
    if (!viewedCards.has(videoId)) {
      setViewedCards((prev) => new Set(prev).add(videoId));
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
      {/* Header */}
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

      {/* Full-screen vertical snap scroll */}
      <div className="h-full snap-y-mandatory overflow-y-scroll scrollbar-hide">
        {MOCK_VIDEOS.map((video) => (
          <div
            key={video.id}
            className="snap-start h-screen w-full relative flex-shrink-0"
          >
            {/* Full-screen background image */}
            <img
              src={video.bgImage}
              alt={video.title}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-300 ${showAIChat ? "blur-sm brightness-50" : ""}`}
            />
            <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-all duration-300 ${showAIChat ? "bg-black/60" : ""}`} />

            {/* Content overlay */}
            <div className="absolute inset-0 flex flex-col justify-end pb-24 px-4">
              {/* Video info */}
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
                </div>

                {/* Right action buttons */}
                <div className="flex flex-col items-center gap-5 mb-4">
                  <button onClick={() => toggleLike(video.id)} className="flex flex-col items-center gap-1">
                    <Heart className={`w-7 h-7 ${likedVideos.has(video.id) ? "fill-red-500 text-red-500" : "text-white"}`} />
                    <span className="text-white text-[11px] font-semibold">{video.likes}</span>
                  </button>
                  <button className="flex flex-col items-center gap-1">
                    <MessageCircle className="w-7 h-7 text-white" />
                    <span className="text-white text-[11px] font-semibold">{video.comments}</span>
                  </button>
                  <button>
                    <Share2 className="w-7 h-7 text-white" />
                  </button>
                  <button onClick={() => handleDownload(video.id)}>
                    <Download className="w-7 h-7 text-white" />
                  </button>
                  <button>
                    <Bookmark className="w-7 h-7 text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* Viewport enter trigger */}
            <motion.div
              className="absolute top-1/2 left-0 w-1 h-1"
              onViewportEnter={() => handleCardViewed(video.id)}
            />
          </div>
        ))}
      </div>

      {/* AI Conversation Overlay */}
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
