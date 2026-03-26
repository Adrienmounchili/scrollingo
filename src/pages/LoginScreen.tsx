import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const LoginScreen = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pseudo, setPseudo] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      if (email === "demo@example.com" && password === "demo") {
        toast.success("Connexion réussie !");
        navigate("/feed");
      } else {
        toast.error("Email ou mot de passe incorrect. Essayez demo@example.com / demo");
      }
    } else {
      if (!pseudo.trim()) {
        toast.error("Veuillez entrer un pseudo");
        return;
      }
      if (!email.includes("@")) {
        toast.error("Veuillez entrer un email valide");
        return;
      }
      if (password.length < 4) {
        toast.error("Le mot de passe doit contenir au moins 4 caractères");
        return;
      }
      toast.success("Inscription réussie !");
      navigate("/onboarding");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8 flex flex-col items-center"
      >
        <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center mb-4">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <path d="M8 5v14l11-7L8 5z" fill="hsl(var(--primary-foreground))" />
          </svg>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">
          <span className="text-foreground">SCROLL</span>
          <span className="text-primary">INGO</span>
        </h1>
        <p className="text-muted-foreground mt-2 text-center text-sm">
          Apprends les langues en scrollant,
          <br />
          sans t'en rendre compte.
        </p>
      </motion.div>

      {/* Tab switcher */}
      <div className="w-full max-w-sm flex rounded-xl overflow-hidden border border-border mb-6">
        <button
          onClick={() => setIsLogin(true)}
          className={`flex-1 py-3 text-sm font-semibold transition-colors duration-200 ${
            isLogin ? "bg-primary text-primary-foreground" : "bg-transparent text-muted-foreground"
          }`}
        >
          Se connecter
        </button>
        <button
          onClick={() => setIsLogin(false)}
          className={`flex-1 py-3 text-sm font-semibold transition-colors duration-200 ${
            !isLogin ? "bg-primary text-primary-foreground" : "bg-transparent text-muted-foreground"
          }`}
        >
          S'inscrire
        </button>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        {!isLogin && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="relative"
          >
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Pseudo"
              value={pseudo}
              onChange={(e) => setPseudo(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </motion.div>
        )}

        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="email"
            placeholder="Adresse email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-12 pr-12 py-4 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        {isLogin && (
          <div className="text-right">
            <button type="button" className="text-primary text-sm font-medium">
              Mot de passe oublié ?
            </button>
          </div>
        )}

        <motion.button
          whileTap={{ scale: 0.97 }}
          type="submit"
          className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold text-base transition-all hover:opacity-90"
        >
          {isLogin ? "Se connecter" : "S'inscrire"}
        </motion.button>

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-border" />
          <span className="text-muted-foreground text-xs">ou</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <button
          type="button"
          onClick={() => navigate("/onboarding")}
          className="w-full py-4 bg-card border border-border rounded-xl font-semibold text-sm text-foreground flex items-center justify-center gap-3 hover:bg-muted transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continuer avec Google
        </button>
      </form>

      {isLogin && (
        <p className="mt-6 text-muted-foreground text-xs text-center">
          Essayez : <span className="text-primary font-medium">demo@example.com</span> / <span className="text-primary font-medium">demo</span>
        </p>
      )}
    </div>
  );
};

export default LoginScreen;
