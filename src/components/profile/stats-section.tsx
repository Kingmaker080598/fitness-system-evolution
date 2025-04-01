
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
  label: string;
  value: string | number | React.ReactNode;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon }) => (
  <Card className="glass-card">
    <CardContent className="p-4 flex flex-col items-center justify-center">
      <div className="text-solo-blue mb-2">{icon}</div>
      <p className="font-bold text-xl neon-text">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </CardContent>
  </Card>
);

interface StatsSectionProps {
  stats: StatCardProps[];
}

export const StatsSection: React.FC<StatsSectionProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};
