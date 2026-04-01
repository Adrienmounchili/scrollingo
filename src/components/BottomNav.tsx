import { useNavigate, useLocation } from "react-router-dom";
import { Home, Grid3X3, User, Settings } from "lucide-react";

const NAV_ITEMS = [
  { path: "/feed", icon: Home, label: "Accueil" },
  { path: "/categories", icon: Grid3X3, label: "Catégories" },
  { path: "/profile", icon: User, label: "Profil" },
  { path: "/settings", icon: Settings, label: "Paramètres" },
];

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 bg-background/95 backdrop-blur-sm border-t border-border">
      <div className="max-w-[430px] mx-auto flex items-center justify-around py-3 pb-5">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 ${isActive ? "text-primary" : "text-muted-foreground"}`}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
