
import React from 'react';
import { DailyActivityCard } from './daily-activity-card';
import { CircleDashed, Droplets, MoveHorizontal } from 'lucide-react';

export const DailySummary = () => {
  return (
    <div className="space-y-3">
      <DailyActivityCard
        title="Push-ups"
        value={25}
        target={50}
        unit="reps"
        icon={<CircleDashed size={20} />}
      />
      
      <DailyActivityCard
        title="Running/Walking"
        value={2.5}
        target={5}
        unit="km"
        icon={<MoveHorizontal size={20} />}
      />
      
      <DailyActivityCard
        title="Water Intake"
        value={4}
        target={8}
        unit="glasses"
        icon={<Droplets size={20} />}
      />
    </div>
  );
};
