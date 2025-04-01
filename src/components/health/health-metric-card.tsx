
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface HealthMetricCardProps {
  title: string;
  value: string | number;
  unit: string;
  date: string;
  icon: React.ReactNode;
  change?: {
    value: number;
    positive: boolean;
  };
}

export const HealthMetricCard: React.FC<HealthMetricCardProps> = ({
  title,
  value,
  unit,
  date,
  icon,
  change,
}) => {
  return (
    <Card className="glass-card rounded-lg">
      <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
        <CardTitle className="text-md font-medium">{title}</CardTitle>
        <div className="text-solo-teal">{icon}</div>
      </CardHeader>
      
      <CardContent className="p-4 pt-2">
        <div className="flex items-baseline">
          <span className="text-2xl font-bold neon-text mr-1">{value}</span>
          <span className="text-muted-foreground text-xs">{unit}</span>
        </div>
        
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-muted-foreground">{date}</span>
          
          {change && (
            <span className={`text-xs flex items-center ${
              change.positive ? 'text-green-500' : 'text-red-500'
            }`}>
              {change.positive ? '↑' : '↓'} {Math.abs(change.value)} {unit}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
