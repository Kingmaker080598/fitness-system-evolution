
import React, { useEffect } from 'react';
import { DailyActivityCard } from './daily-activity-card';
import { CircleDashed, Droplets, MoveHorizontal } from 'lucide-react';

export const DailySummary = () => {
  // Make sure we update the current date each day
  useEffect(() => {
    const today = new Date().toDateString();
    localStorage.setItem('currentDate', today);
  }, []);

  return (
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
  );
};
