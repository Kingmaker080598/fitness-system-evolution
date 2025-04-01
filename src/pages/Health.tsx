
import React from 'react';
import { Navigate } from 'react-router-dom';
import { MobileLayout } from '@/components/mobile-layout';
import { HealthMetricCard } from '@/components/health/health-metric-card';
import { HealthChart } from '@/components/health/health-chart';
import { ShareHealthData } from '@/components/social/share-health-data';
import { ImportHealthData } from '@/components/social/import-health-data';
import { Button } from '@/components/ui/button';
import { Plus, PlusCircle, Scale, Heart, Activity, TrendingUp, Droplets } from 'lucide-react';

// Mock weight data for chart
const weightData = [
  { date: 'Sep 1', value: 75 },
  { date: 'Sep 5', value: 74.5 },
  { date: 'Sep 10', value: 74 },
  { date: 'Sep 15', value: 73.8 },
  { date: 'Sep 20', value: 73.2 },
  { date: 'Sep 25', value: 72.9 },
  { date: 'Sep 30', value: 72.5 },
];

// Mock blood pressure data for chart
const bpData = [
  { date: 'Sep 1', value: 120 },
  { date: 'Sep 5', value: 118 },
  { date: 'Sep 10', value: 122 },
  { date: 'Sep 15', value: 119 },
  { date: 'Sep 20', value: 121 },
  { date: 'Sep 25', value: 117 },
  { date: 'Sep 30', value: 116 },
];

// Mock blood sugar data for chart
const bloodSugarData = [
  { date: 'Sep 1', value: 95 },
  { date: 'Sep 5', value: 92 },
  { date: 'Sep 10', value: 98 },
  { date: 'Sep 15', value: 94 },
  { date: 'Sep 20', value: 96 },
  { date: 'Sep 25', value: 93 },
  { date: 'Sep 30', value: 90 },
];

const Health = () => {
  // Check if user is logged in
  if (localStorage.getItem('isLoggedIn') !== 'true') {
    return <Navigate to="/auth" replace />;
  }

  return (
    <MobileLayout currentTab="health">
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Health</h1>
            <p className="text-muted-foreground text-sm">Track your health metrics</p>
          </div>
          <Button className="bg-solo-purple hover:bg-solo-purple/80">
            <Plus size={16} className="mr-1" /> Add Entry
          </Button>
        </div>
        
        <div className="flex gap-2 mb-4">
          <ShareHealthData />
          <ImportHealthData />
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <HealthMetricCard
            title="Weight"
            value={72.5}
            unit="kg"
            date="Sep 30, 2023"
            icon={<Scale size={20} />}
            change={{ value: 0.4, positive: false }}
          />
          
          <HealthMetricCard
            title="Height"
            value={178}
            unit="cm"
            date="Sep 30, 2023"
            icon={<TrendingUp size={20} />}
          />
          
          <HealthMetricCard
            title="Blood Pressure"
            value="116/75"
            unit="mmHg"
            date="Sep 30, 2023"
            icon={<Activity size={20} />}
            change={{ value: 2, positive: false }}
          />
          
          <HealthMetricCard
            title="Heart Rate"
            value={68}
            unit="bpm"
            date="Sep 30, 2023"
            icon={<Heart size={20} />}
            change={{ value: 3, positive: false }}
          />
          
          <HealthMetricCard
            title="Blood Sugar"
            value={90}
            unit="mg/dL"
            date="Sep 30, 2023"
            icon={<Droplets size={20} />}
            change={{ value: 3, positive: false }}
          />
        </div>
        
        <div className="mt-6 space-y-4">
          <HealthChart
            title="Weight Trend"
            data={weightData}
            unit="kg"
            dataKey="value"
            color="#00A3FF"
          />
          
          <HealthChart
            title="Blood Pressure (Systolic)"
            data={bpData}
            unit="mmHg"
            dataKey="value"
            color="#9B30FF"
          />
          
          <HealthChart
            title="Blood Sugar"
            data={bloodSugarData}
            unit="mg/dL"
            dataKey="value"
            color="#00CED1"
          />
        </div>
        
        <Button 
          variant="outline" 
          className="w-full mt-4 border-dashed border-solo-blue/30 text-solo-blue hover:bg-solo-blue/5"
        >
          <PlusCircle size={16} className="mr-2" /> Add New Health Metric
        </Button>
      </div>
    </MobileLayout>
  );
};

export default Health;
