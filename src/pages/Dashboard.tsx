
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { MobileLayout } from '@/components/mobile-layout';
import { DailySummary } from '@/components/dashboard/daily-summary';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowRight, CheckCircle, Trophy } from 'lucide-react';

const mockData = [
  { name: 'Mon', pushups: 20, distance: 2, water: 5 },
  { name: 'Tue', pushups: 25, distance: 3, water: 6 },
  { name: 'Wed', pushups: 15, distance: 1.5, water: 4 },
  { name: 'Thu', pushups: 30, distance: 2.5, water: 7 },
  { name: 'Fri', pushups: 35, distance: 3.5, water: 8 },
  { name: 'Sat', pushups: 20, distance: 4, water: 6 },
  { name: 'Sun', pushups: 15, distance: 2, water: 5 },
];

const Dashboard = () => {
  // Check if user is logged in
  if (localStorage.getItem('isLoggedIn') !== 'true') {
    return <Navigate to="/auth" replace />;
  }

  return (
    <MobileLayout currentTab="dashboard">
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground text-sm">Track your daily activities</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-solo-purple/20 flex items-center justify-center">
            <Trophy size={20} className="text-solo-purple" />
          </div>
        </div>
        
        <Card className="glass-card rounded-lg p-4 mb-6">
          <CardContent className="p-0">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-foreground">Weekly Progress</h2>
              <Button variant="ghost" size="sm" className="text-solo-blue">
                View All <ArrowRight size={16} className="ml-1" />
              </Button>
            </div>
            
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={mockData}
                  margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                >
                  <XAxis 
                    dataKey="name" 
                    stroke="#666" 
                    fontSize={10} 
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: '#1E1E1E', 
                      borderColor: '#00A3FF',
                      borderRadius: '4px',
                      fontSize: '12px',
                    }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="pushups" 
                    stroke="#00A3FF" 
                    strokeWidth={2}
                    dot={{ r: 3, strokeWidth: 1, stroke: '#00A3FF', fill: '#00A3FF' }}
                    activeDot={{ r: 6, stroke: '#00A3FF', strokeWidth: 2, fill: '#1E1E1E' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="distance" 
                    stroke="#9B30FF" 
                    strokeWidth={2}
                    dot={{ r: 3, strokeWidth: 1, stroke: '#9B30FF', fill: '#9B30FF' }}
                    activeDot={{ r: 6, stroke: '#9B30FF', strokeWidth: 2, fill: '#1E1E1E' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="water" 
                    stroke="#00CED1" 
                    strokeWidth={2}
                    dot={{ r: 3, strokeWidth: 1, stroke: '#00CED1', fill: '#00CED1' }}
                    activeDot={{ r: 6, stroke: '#00CED1', strokeWidth: 2, fill: '#1E1E1E' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <h2 className="font-semibold text-foreground mb-3">Today's Activities</h2>
        <DailySummary />
        
        <div className="glass-card rounded-lg p-4 flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-solo-blue/20 flex items-center justify-center">
            <CheckCircle size={16} className="text-solo-blue" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium">Daily Goal</h3>
            <p className="text-xs text-muted-foreground">Complete all activities today</p>
          </div>
          <Button size="sm" className="bg-solo-blue hover:bg-solo-blue/80">
            Log Activity
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default Dashboard;
