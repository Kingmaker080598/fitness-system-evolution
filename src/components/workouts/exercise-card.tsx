
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface ExerciseCardProps {
  title: string;
  imageUrl: string;
  sets: number;
  reps: number;
  description: string;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  title,
  imageUrl,
  sets,
  reps,
  description,
}) => {
  return (
    <Card className="glass-card rounded-lg overflow-hidden">
      <div className="flex flex-row">
        <div className="flex-1 p-4">
          <h3 className="text-lg font-semibold neon-text mb-1">{title}</h3>
          
          <div className="flex gap-3 mb-2">
            <div className="bg-muted px-2 py-1 rounded text-xs">
              {sets} sets
            </div>
            <div className="bg-muted px-2 py-1 rounded text-xs">
              {reps} reps
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        <div className="w-32 h-32 overflow-hidden flex-shrink-0">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(title)}&background=000&color=fff&size=128`;
            }}
          />
        </div>
      </div>
    </Card>
  );
};
