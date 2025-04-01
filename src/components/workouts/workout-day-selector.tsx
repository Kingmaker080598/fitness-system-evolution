
import React from 'react';

interface WorkoutDaySelectorProps {
  currentDay: string;
  onSelectDay: (day: string) => void;
}

export const WorkoutDaySelector: React.FC<WorkoutDaySelectorProps> = ({
  currentDay,
  onSelectDay,
}) => {
  const days = [
    { id: 'monday', label: 'MON', focus: 'Chest & Triceps' },
    { id: 'tuesday', label: 'TUE', focus: 'Back & Biceps' },
    { id: 'wednesday', label: 'WED', focus: 'Legs & Abs' },
    { id: 'thursday', label: 'THU', focus: 'Shoulders & Cardio' },
    { id: 'friday', label: 'FRI', focus: 'Full Body' },
    { id: 'saturday', label: 'SAT', focus: 'Active Recovery' },
    { id: 'sunday', label: 'SUN', focus: 'User Choice' },
  ];

  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="flex gap-2 min-w-max">
        {days.map((day) => (
          <button
            key={day.id}
            onClick={() => onSelectDay(day.id)}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all ${
              currentDay === day.id
                ? 'neon-border bg-solo-blue/10'
                : 'border border-transparent'
            }`}
          >
            <span className={`text-sm font-bold ${
              currentDay === day.id ? 'text-solo-blue' : 'text-muted-foreground'
            }`}>
              {day.label}
            </span>
            <span className="text-xs text-muted-foreground mt-1">{day.focus}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
