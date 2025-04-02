
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle, Plus, Minus, Play, Pause } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Motion } from '@capacitor/motion';
import { saveHealthMetric } from '@/services/health-service';
import { useAuth } from '@/context/AuthContext';

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
  const { user } = useAuth();
  const [currentValue, setCurrentValue] = useState(value);
  const [isCompleted, setIsCompleted] = useState(false);
  const [lastResetDate, setLastResetDate] = useState<string>(
    localStorage.getItem(`${title}-lastReset`) || new Date().toDateString()
  );
  const [customTarget, setCustomTarget] = useState(target);
  const [isTracking, setIsTracking] = useState(false);
  const [stepCount, setStepCount] = useState(0);
  const [isRunningWalking, setIsRunningWalking] = useState(title === "Running/Walking");
  const [isMotionSupported, setIsMotionSupported] = useState(true);
  
  // Load saved values on mount
  useEffect(() => {
    const savedValue = localStorage.getItem(`${title}-value`);
    const savedCompleted = localStorage.getItem(`${title}-completed`);
    const savedLastResetDate = localStorage.getItem(`${title}-lastReset`);
    const savedTarget = localStorage.getItem(`${title}-target`);
    const savedSteps = localStorage.getItem('today-steps');
    
    if (savedValue) setCurrentValue(Number(savedValue));
    if (savedCompleted) setIsCompleted(savedCompleted === 'true');
    if (savedLastResetDate) setLastResetDate(savedLastResetDate);
    if (savedTarget) setCustomTarget(Number(savedTarget));
    if (savedSteps && isRunningWalking) setStepCount(Number(savedSteps));
    
    // Check if we need to reset (new day)
    const today = new Date().toDateString();
    if (lastResetDate !== today) {
      setCurrentValue(0);
      setIsCompleted(false);
      setLastResetDate(today);
      localStorage.setItem(`${title}-lastReset`, today);
      localStorage.setItem(`${title}-value`, '0');
      localStorage.setItem(`${title}-completed`, 'false');
      
      if (isRunningWalking) {
        setStepCount(0);
        localStorage.setItem('today-steps', '0');
        localStorage.setItem('steps-last-save-date', today);
      }
      
      toast({
        title: "Daily Reset",
        description: `Your ${title.toLowerCase()} progress has been reset for the new day.`,
      });
    }
    
    // If this is the running/walking card, initialize motion detection
    if (isRunningWalking) {
      initializeMotionDetection();
    }
  }, [title, lastResetDate, toast, target, isRunningWalking]);
  
  // Save values when they change
  useEffect(() => {
    localStorage.setItem(`${title}-value`, currentValue.toString());
    localStorage.setItem(`${title}-completed`, isCompleted.toString());
  }, [title, currentValue, isCompleted]);
  
  // Save steps when they change (for running/walking)
  useEffect(() => {
    if (isRunningWalking) {
      localStorage.setItem('today-steps', stepCount.toString());
      
      // Convert steps to distance (rough estimate: 1300 steps ≈ 1km)
      const estimatedDistance = +(stepCount / 1300).toFixed(1);
      
      // Only update if the estimated distance is different from current value
      if (estimatedDistance !== currentValue) {
        setCurrentValue(estimatedDistance);
      }
    }
  }, [stepCount, isRunningWalking, currentValue]);
  
  // Initialize motion detection for step counting
  const initializeMotionDetection = async () => {
    if (!isRunningWalking) return;
    
    try {
      const isAvailable = await Motion.addListener('accel', () => {
        Motion.removeAllListeners();
        return true;
      }).catch(() => false);
      
      setIsMotionSupported(!!isAvailable);
      
      if (!isAvailable) {
        toast({
          title: "Feature Not Available",
          description: "Step counting requires motion sensors that aren't available on this device.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error checking motion support:', error);
      setIsMotionSupported(false);
    }
  };
  
  const toggleStepTracking = async () => {
    if (!isRunningWalking || !isMotionSupported) return;
    
    if (isTracking) {
      // Stop tracking
      await Motion.removeAllListeners();
      setIsTracking(false);
      
      // Save the step count to health metrics
      if (user && stepCount > 0) {
        saveHealthMetric(user.id, 'steps', stepCount.toString(), 'steps')
          .then(response => {
            if (response.success) {
              toast({
                title: "Steps Saved",
                description: `${stepCount} steps have been recorded.`,
              });
            }
          })
          .catch(error => console.error('Error saving steps:', error));
      }
      
      toast({
        title: "Tracking Paused",
        description: "Step counting has been paused.",
      });
    } else {
      // Start tracking
      try {
        await Motion.addListener('accel', event => {
          const { x, y, z } = event.acceleration;
          const magnitude = Math.sqrt(x * x + y * y + z * z);
          
          // Threshold for step detection
          if (magnitude > 10) {
            setStepCount(prev => prev + 1);
          }
        });
        
        setIsTracking(true);
        toast({
          title: "Tracking Started",
          description: "Step counting has begun. Keep your device with you while walking or running.",
        });
      } catch (error) {
        console.error('Error starting step counter:', error);
        toast({
          title: "Permission Required",
          description: "Step counting requires motion sensor permission.",
          variant: "destructive",
        });
      }
    }
  };
  
  const handleIncrement = () => {
    if (isRunningWalking) return; // Disable manual increment for running/walking
    
    let increment = 1;
    // For kilometers, increment by 0.5
    if (unit === "km") increment = 0.5;
    const newValue = Math.min(currentValue + increment, customTarget);
    setCurrentValue(newValue);
  };
  
  const handleDecrement = () => {
    if (isRunningWalking) return; // Disable manual decrement for running/walking
    
    let decrement = 1;
    // For kilometers, decrement by 0.5
    if (unit === "km") decrement = 0.5;
    const newValue = Math.max(currentValue - decrement, 0);
    setCurrentValue(newValue);
  };
  
  const handleComplete = () => {
    setIsCompleted(true);
    setCurrentValue(customTarget);
    
    // Stop tracking if running/walking
    if (isRunningWalking && isTracking) {
      Motion.removeAllListeners();
      setIsTracking(false);
    }
    
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
        {isRunningWalking && (
          <span className="text-muted-foreground text-xs ml-2">({stepCount} steps)</span>
        )}
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
          {isRunningWalking ? (
            <Button 
              variant="outline" 
              size="sm" 
              className={`p-1 h-8 ${isTracking ? 'bg-red-500/10 text-red-500 border-red-500/30' : ''}`}
              onClick={toggleStepTracking}
              disabled={!isMotionSupported || isCompleted}
            >
              {isTracking ? <Pause size={16} /> : <Play size={16} />}
            </Button>
          ) : (
            <>
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
            </>
          )}
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
