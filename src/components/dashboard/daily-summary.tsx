
import React, { useEffect } from 'react';
import { DailyActivityCard } from './daily-activity-card';
import { CustomGoalsForm } from './custom-goals-form';
import { CircleDashed, Droplets, MoveHorizontal } from 'lucide-react';

export const DailySummary = () => {
  // Make sure we update the current date each day
  useEffect(() => {
    const today = new Date().toDateString();
    localStorage.setItem('currentDate', today);
  }, []);

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
