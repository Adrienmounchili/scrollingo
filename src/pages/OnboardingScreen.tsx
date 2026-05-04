import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, Calendar, Globe, BarChart3, Heart } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

const LANGUAGES = [
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "it", label: "Italiano", flag: "🇮🇹" },
  { code: "ja", label: "日本語", flag: "🇯🇵" },
];

const LEVELS = ["Débutant", "Intermédiaire", "Avancé"];
const INTERESTS = ["Sports", "Musique", "Humour", "Actualités", "Voyages"];

const OnboardingScreen = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  // Step 1
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Step 2
  const [username, setUsername] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  // Step 3
  const [nativeLang, setNativeLang] = useState("fr");
  const [targetLang, setTargetLang] = useState("en");
  // Step 4
  const [level, setLevel] = useState("");
  // Step 5
  const [interests, setInterests] = useState<Set<string>>(new Set());

  const totalSteps = 5;

  const toggleInterest = (i: string) => {
    setInterests((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const canNext = () => {
    switch (step) {
      case 0: return email.includes("@") && password.length >= 4;
      case 1: return username.trim().length > 0;
      case 2: return nativeLang && targetLang && nativeLang !== targetLang;
      case 3: return level !== "";
      case 4: return interests.size > 0;
      default: return true;
    }
  };

  const [saving, setSaving] = useState(false);

  const handleNext = async () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
      return;
    }

    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { error } = await supabase.from("user_profiles").upsert({
        id: user.id,
        email: user.email ?? null,
        phone: user.phone ?? null,
        pseudo: username || user.user_metadata?.pseudo || null,
        birth_date: birthDate || null,
        gender: gender || null,
        native_language: nativeLang,
        target_language: targetLang,
        level,
        interests: Array.from(interests),
        updated_at: new Date().toISOString(),
      });

      if (error) {
        toast.error("Erreur lors de la sauvegarde du profil");
        setSaving(false);
        return;
      }

      await supabase.auth.updateUser({ data: { onboarding_completed: true } });
    }

    setSaving(false);
    navigate("/feed");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col px-6 py-8">
      {/* Progress */}
      <div className="flex gap-1.5 mb-8">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
              i <= step ? "bg-primary" : "bg-muted"
            }`}
          />
        ))}
      </div>

      <div className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className="flex-1 flex flex-col"
          >
            {/* Step 1: Email/Password */}
            {step === 0 && (
              <div className="flex-1 flex flex-col">
                <h2 className="text-2xl font-bold text-foreground mb-2">Crée ton compte</h2>
                <p className="text-muted-foreground text-sm mb-6">Entre ton email et ton mot de passe</p>
                <div className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="email"
                      placeholder="Adresse email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="password"
                      placeholder="Mot de passe (min. 4 caractères)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Profile */}
            {step === 1 && (
              <div className="flex-1 flex flex-col">
                <h2 className="text-2xl font-bold text-foreground mb-2">Ton profil</h2>
                <p className="text-muted-foreground text-sm mb-6">Dis-nous en plus sur toi</p>
                <div className="space-y-4">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Nom d'utilisateur"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground mb-3">Genre</p>
                    <div className="flex gap-2">
                      {["Homme", "Femme", "Autre"].map((g) => (
                        <button
                          key={g}
                          onClick={() => setGender(g)}
                          className={`flex-1 py-3 rounded-xl text-sm font-medium transition-colors ${
                            gender === g
                              ? "bg-primary text-primary-foreground"
                              : "bg-card border border-border text-foreground"
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Languages */}
            {step === 2 && (
              <div className="flex-1 flex flex-col">
                <h2 className="text-2xl font-bold text-foreground mb-2">Tes langues</h2>
                <p className="text-muted-foreground text-sm mb-6">Quelle langue parles-tu et laquelle veux-tu apprendre ?</p>
                <div className="space-y-6">
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Globe className="w-4 h-4 text-primary" /> Langue maternelle
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {LANGUAGES.map((l) => (
                        <button
                          key={l.code}
                          onClick={() => setNativeLang(l.code)}
                          className={`py-3 rounded-xl text-sm font-medium transition-colors ${
                            nativeLang === l.code
                              ? "bg-primary text-primary-foreground"
                              : "bg-card border border-border text-foreground"
                          }`}
                        >
                          {l.flag} {l.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Globe className="w-4 h-4 text-primary" /> Langue cible
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {LANGUAGES.filter((l) => l.code !== nativeLang).map((l) => (
                        <button
                          key={l.code}
                          onClick={() => setTargetLang(l.code)}
                          className={`py-3 rounded-xl text-sm font-medium transition-colors ${
                            targetLang === l.code
                              ? "bg-primary text-primary-foreground"
                              : "bg-card border border-border text-foreground"
                          }`}
                        >
                          {l.flag} {l.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Level */}
            {step === 3 && (
              <div className="flex-1 flex flex-col">
                <h2 className="text-2xl font-bold text-foreground mb-2">Ton niveau</h2>
                <p className="text-muted-foreground text-sm mb-6">Où en es-tu dans ton apprentissage ?</p>
                <div className="space-y-3">
                  {LEVELS.map((l, i) => (
                    <button
                      key={l}
                      onClick={() => setLevel(l)}
                      className={`w-full py-5 px-5 rounded-2xl text-left transition-all flex items-center gap-4 ${
                        level === l
                          ? "bg-primary text-primary-foreground shadow-lg"
                          : "bg-card border border-border text-foreground"
                      }`}
                    >
                      <BarChart3 className={`w-6 h-6 ${level === l ? "text-primary-foreground" : "text-primary"}`} />
                      <div>
                        <p className="font-bold">{l}</p>
                        <p className={`text-xs mt-0.5 ${level === l ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                          {i === 0 && "Je débute, quelques mots seulement"}
                          {i === 1 && "Je comprends les conversations simples"}
                          {i === 2 && "Je suis à l'aise dans la plupart des situations"}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: Interests */}
            {step === 4 && (
              <div className="flex-1 flex flex-col">
                <h2 className="text-2xl font-bold text-foreground mb-2">Tes centres d'intérêt</h2>
                <p className="text-muted-foreground text-sm mb-6">Choisis ce qui te passionne pour personnaliser ton contenu</p>
                <div className="flex flex-wrap gap-3">
                  {INTERESTS.map((interest) => (
                    <motion.button
                      key={interest}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleInterest(interest)}
                      className={`px-5 py-3 rounded-full text-sm font-semibold transition-colors flex items-center gap-2 ${
                        interests.has(interest)
                          ? "bg-primary text-primary-foreground"
                          : "bg-card border border-border text-foreground"
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${interests.has(interest) ? "fill-current" : ""}`} />
                      {interest}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom */}
      <div className="mt-6 space-y-3">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleNext}
          disabled={!canNext() || saving}
          className={`w-full py-4 rounded-xl font-bold text-base transition-all ${
            canNext() && !saving
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          }`}
        >
          {saving ? "Sauvegarde..." : step === totalSteps - 1 ? "C'est parti !" : "Suivant"}
        </motion.button>
        {step > 0 && (
          <button onClick={() => setStep(step - 1)} className="w-full text-center text-muted-foreground text-sm py-2">
            Retour
          </button>
        )}
      </div>
    </div>
  );
};

export default OnboardingScreen;
