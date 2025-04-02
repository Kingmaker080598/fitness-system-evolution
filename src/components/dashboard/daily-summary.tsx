
import React, { useEffect } from 'react';
import { DailyActivityCard } from './daily-activity-card';
import { CustomGoalsForm } from './custom-goals-form';
import { CircleDashed, Droplets, MoveHorizontal } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Motion } from '@capacitor/motion';

export const DailySummary = () => {
  const { toast } = useToast();
  
  // Request motion permission when component mounts
  useEffect(() => {
    const requestMotionPermission = async () => {
      try {
        // Try to add a listener to request permission
        await Motion.addListener('accel', () => {});
        // Remove it immediately
        await Motion.removeAllListeners();
        
        console.log('Motion permission granted');
      } catch (error) {
        console.error('Motion permission denied or not available:', error);
        toast({
          title: "Fitness Tracking",
          description: "For step counting, please allow motion sensor access when prompted.",
        });
      }
    };
    
    // Make sure we update the current date each day
    const today = new Date().toDateString();
    localStorage.setItem('currentDate', today);
    
    // Request motion permission
    requestMotionPermission();
  }, [toast]);

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-semibold text-foreground">Today's Activities</h2>
        <CustomGoalsForm />
      </div>
      
      <div className="space-y-3">
        <DailyActivityCard
          title="Push-ups"
          value={0}
          target={50}
          unit="reps"
          icon={<CircleDashed size={20} />}
        />
        
        <DailyActivityCard
          title="Running/Walking"
          value={0}
          target={5}
          unit="km"
          icon={<MoveHorizontal size={20} />}
        />
        
        <DailyActivityCard
          title="Water Intake"
          value={0}
          target={8}
          unit="glasses"
          icon={<Droplets size={20} />}
        />
      </div>
    </div>
  );
};
