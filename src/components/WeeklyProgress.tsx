import { motion } from "framer-motion";

const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const HOURS = [1.5, 2, 0.5, 1, 2.5, 3, 1];

const WeeklyProgress = () => {
  const maxHours = Math.max(...HOURS);
  const totalHours = HOURS.reduce((a, b) => a + b, 0);

  return (
    <div className="bg-card border border-border rounded-2xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-foreground">📊 Progrès Hebdomadaire</h3>
        <span className="text-xs text-srolla-blue-medium font-semibold">{totalHours.toFixed(1)}h total</span>
      </div>
      <div className="flex items-end justify-between gap-1.5 h-28">
        {DAYS.map((day, i) => {
          const pct = (HOURS[i] / maxHours) * 100;
          return (
            <div key={day} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[10px] font-semibold text-srolla-blue-medium">{HOURS[i]}h</span>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${pct}%` }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="w-full rounded-t-lg bg-gradient-to-t from-primary to-srolla-blue-medium"
                style={{ minHeight: 4 }}
              />
              <span className="text-[10px] font-medium text-muted-foreground">{day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklyProgress;
