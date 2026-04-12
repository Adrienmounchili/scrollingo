import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
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
        <div className="max-w-[430px] mx-auto relative min-h-screen bg-background">
          <Routes>
            <Route path="/" element={<LoginScreen />} />
            <Route path="/onboarding" element={<OnboardingScreen />} />
            <Route path="/feed" element={<FeedScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />
            <Route path="/categories" element={<CategoriesScreen />} />
            <Route path="/search" element={<SearchScreen />} />
            <Route path="/settings" element={<SettingsScreen />} />
            <Route path="/smart-cache" element={<SmartCacheScreen />} />
            <Route path="/challenges" element={<ChallengesScreen />} />
            <Route path="/progress-report" element={<ProgressReportScreen />} />
            <Route path="/voice" element={<VoiceScreen />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
