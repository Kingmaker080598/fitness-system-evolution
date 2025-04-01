
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle, Plus, Minus } from 'lucide-react';

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
  const [currentValue, setCurrentValue] = useState(value);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const progress = Math.min((currentValue / target) * 100, 100);
  
  const handleIncrement = () => {
    let increment = 1;
    // For kilometers, increment by 0.5
    if (unit === "km") increment = 0.5;
    setCurrentValue(prev => Math.min(prev + increment, target));
  };
  
  const handleDecrement = () => {
    let decrement = 1;
    // For kilometers, decrement by 0.5
    if (unit === "km") decrement = 0.5;
    setCurrentValue(prev => Math.max(prev - decrement, 0));
  };
  
  const handleComplete = () => {
    setIsCompleted(true);
    setCurrentValue(target);
  };

  return (
    <div className="glass-card rounded-lg p-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium text-foreground">{title}</h3>
        <div className="text-solo-blue">{icon}</div>
      </div>
      
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold neon-text">{currentValue}</span>
        <span className="text-muted-foreground text-sm">/ {target} {unit}</span>
      </div>
      
      <div className="mt-3 progress-bar">
        <motion.div
          className={`progress-value ${isCompleted ? 'bg-green-500' : ''}`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
      
      <div className="mt-3 flex items-center justify-between">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="p-1 h-8 w-8"
            onClick={handleDecrement}
            disabled={isCompleted || currentValue <= 0}
          >
            <Minus size={16} />
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="p-1 h-8 w-8"
            onClick={handleIncrement}
            disabled={isCompleted || currentValue >= target}
          >
            <Plus size={16} />
          </Button>
        </div>
        
        <Button 
          size="sm" 
          className={`${isCompleted ? 'bg-green-500 hover:bg-green-600' : 'bg-solo-blue hover:bg-solo-blue/80'}`}
          onClick={handleComplete}
          disabled={isCompleted}
        >
          {isCompleted ? (
            <>
              <CheckCircle size={16} className="mr-1" /> Completed
            </>
          ) : (
            'Complete'
          )}
        </Button>
      </div>
    </div>
  );
};
