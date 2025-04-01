
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
      <CardHeader className="p-0">
        <div className="h-48 overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
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
      </CardContent>
    </Card>
  );
};
