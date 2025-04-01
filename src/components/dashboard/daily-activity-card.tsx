
import React from 'react';
import { motion } from 'framer-motion';

interface DailyActivityCardProps {
  title: string;
  value: number;
  target: number;
  unit: string;
  icon: React.ReactNode;
}

export const DailyActivityCard: React.FC<DailyActivityCardProps> = ({
  title,
  value,
  target,
  unit,
  icon,
}) => {
  const progress = Math.min((value / target) * 100, 100);

  return (
    <div className="glass-card rounded-lg p-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium text-foreground">{title}</h3>
        <div className="text-solo-blue">{icon}</div>
      </div>
      
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold neon-text">{value}</span>
        <span className="text-muted-foreground text-sm">/ {target} {unit}</span>
      </div>
      
      <div className="mt-3 progress-bar">
        <motion.div
          className="progress-value"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};
