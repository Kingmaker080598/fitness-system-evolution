
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle, Plus, Minus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

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
  const { toast } = useToast();
  const [currentValue, setCurrentValue] = useState(value);
  const [isCompleted, setIsCompleted] = useState(false);
  const [lastResetDate, setLastResetDate] = useState<string>(
    localStorage.getItem(`${title}-lastReset`) || new Date().toDateString()
  );
  const [customTarget, setCustomTarget] = useState(target);
  
  // Load saved values on mount
  useEffect(() => {
    const savedValue = localStorage.getItem(`${title}-value`);
    const savedCompleted = localStorage.getItem(`${title}-completed`);
    const savedLastResetDate = localStorage.getItem(`${title}-lastReset`);
    const savedTarget = localStorage.getItem(`${title}-target`);
    
    if (savedValue) setCurrentValue(Number(savedValue));
    if (savedCompleted) setIsCompleted(savedCompleted === 'true');
    if (savedLastResetDate) setLastResetDate(savedLastResetDate);
    if (savedTarget) setCustomTarget(Number(savedTarget));
    
    // Check if we need to reset (new day)
    const today = new Date().toDateString();
    if (lastResetDate !== today) {
      setCurrentValue(0);
      setIsCompleted(false);
      setLastResetDate(today);
      localStorage.setItem(`${title}-lastReset`, today);
      localStorage.setItem(`${title}-value`, '0');
      localStorage.setItem(`${title}-completed`, 'false');
      
      toast({
        title: "Daily Reset",
        description: `Your ${title.toLowerCase()} progress has been reset for the new day.`,
      });
    }
  }, [title, lastResetDate, toast, target]);
  
  // Save values when they change
  useEffect(() => {
    localStorage.setItem(`${title}-value`, currentValue.toString());
    localStorage.setItem(`${title}-completed`, isCompleted.toString());
  }, [title, currentValue, isCompleted]);
  
  const handleIncrement = () => {
    let increment = 1;
    // For kilometers, increment by 0.5
    if (unit === "km") increment = 0.5;
    const newValue = Math.min(currentValue + increment, customTarget);
    setCurrentValue(newValue);
  };
  
  const handleDecrement = () => {
    let decrement = 1;
    // For kilometers, decrement by 0.5
    if (unit === "km") decrement = 0.5;
    const newValue = Math.max(currentValue - decrement, 0);
    setCurrentValue(newValue);
  };
  
  const handleComplete = () => {
    setIsCompleted(true);
    setCurrentValue(customTarget);
    
    toast({
      title: "Activity Completed!",
      description: `Congratulations on completing your ${title.toLowerCase()} goal!`,
    });
  };

  const progress = Math.min((currentValue / customTarget) * 100, 100);

  return (
    <div className="glass-card rounded-lg p-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium text-foreground">{title}</h3>
        <div className="text-solo-blue">{icon}</div>
      </div>
      
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold neon-text">{currentValue}</span>
        <span className="text-muted-foreground text-sm">/ {customTarget} {unit}</span>
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
            disabled={isCompleted || currentValue >= customTarget}
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
