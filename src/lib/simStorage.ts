export const STORAGE_KEYS = {
  auth: "scrollingo_auth",
  likes: "scrollingo_likes",
  saved: "scrollingo_saved",
  convos: "scrollingo_convos",
  cachedVideos: "scrollingo_cached_videos",
  quizHistory: "scrollingo_quiz_history",
} as const;

export type AuthSession = {
  email?: string;
  phone?: string;
  pseudo?: string;
  method: "email" | "otp" | "google";
  loggedInAt: string;
};

export type CachedVideoEntry = {
  id: string;
  url: string;
  cachedAt: string;
};

export type QuizHistoryEntry = {
  videoId: string;
  question: string;
  selectedIndex: number;
  correctIndex: number;
  correct: boolean;
  answeredAt: string;
};

const readJSON = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const writeJSON = (key: string, value: unknown) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const saveAuthSession = (session: AuthSession) => {
  writeJSON(STORAGE_KEYS.auth, session);
};

export const clearAuthSession = () => {
  localStorage.removeItem(STORAGE_KEYS.auth);
};

export const getSavedVideoIds = () => readJSON<string[]>(STORAGE_KEYS.saved, []);

export const getSavedConversations = () => readJSON<Record<string, string[]>>(STORAGE_KEYS.convos, {});

export const getQuizHistory = () => readJSON<QuizHistoryEntry[]>(STORAGE_KEYS.quizHistory, []);

export const recordQuizAttempt = (entry: QuizHistoryEntry) => {
  const current = getQuizHistory();
  writeJSON(STORAGE_KEYS.quizHistory, [entry, ...current].slice(0, 50));
};

export const getCachedVideos = () => readJSON<CachedVideoEntry[]>(STORAGE_KEYS.cachedVideos, []);

export const cacheVideosLocally = (videos: Array<{ id: string; url: string }>) => {
  if (videos.length === 0) return;

  const current = getCachedVideos();
  const map = new Map(current.map((video) => [video.id, video]));

  videos.forEach((video) => {
    if (!video.url) return;
    map.set(video.id, {
      id: video.id,
      url: video.url,
      cachedAt: new Date().toISOString(),
    });
  });

  writeJSON(STORAGE_KEYS.cachedVideos, Array.from(map.values()).slice(-6));
};
