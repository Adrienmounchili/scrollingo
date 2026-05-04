import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoginScreen from "./pages/LoginScreen";
import OnboardingScreen from "./pages/OnboardingScreen";
import FeedScreen from "./pages/FeedScreen";
import ProfileScreen from "./pages/ProfileScreen";
import CategoriesScreen from "./pages/CategoriesScreen";
import SearchScreen from "./pages/SearchScreen";
import SettingsScreen from "./pages/SettingsScreen";
import SmartCacheScreen from "./pages/SmartCacheScreen";
import ChallengesScreen from "./pages/ChallengesScreen";
import ProgressReportScreen from "./pages/ProgressReportScreen";
import VoiceScreen from "./pages/VoiceScreen";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <div className="max-w-[430px] mx-auto relative min-h-screen bg-background">
            <Routes>
              <Route path="/" element={<LoginScreen />} />
              <Route path="/onboarding" element={<ProtectedRoute><OnboardingScreen /></ProtectedRoute>} />
              <Route path="/feed" element={<ProtectedRoute><FeedScreen /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfileScreen /></ProtectedRoute>} />
              <Route path="/categories" element={<ProtectedRoute><CategoriesScreen /></ProtectedRoute>} />
              <Route path="/search" element={<ProtectedRoute><SearchScreen /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><SettingsScreen /></ProtectedRoute>} />
              <Route path="/smart-cache" element={<ProtectedRoute><SmartCacheScreen /></ProtectedRoute>} />
              <Route path="/challenges" element={<ProtectedRoute><ChallengesScreen /></ProtectedRoute>} />
              <Route path="/progress-report" element={<ProtectedRoute><ProgressReportScreen /></ProtectedRoute>} />
              <Route path="/voice" element={<ProtectedRoute><VoiceScreen /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
