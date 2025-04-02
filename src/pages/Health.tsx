import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { MobileLayout } from '@/components/mobile-layout';
import { HealthMetricCard } from '@/components/health/health-metric-card';
import { HealthChart } from '@/components/health/health-chart';
import { ShareHealthData } from '@/components/social/share-health-data';
import { ImportHealthData } from '@/components/social/import-health-data';
import { AddHealthMetricCards } from '@/components/health/add-health-metric-cards';
import { OfflineIndicator } from '@/components/health/offline-indicator';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  PlusCircle, 
  Scale, 
  Heart, 
  Activity, 
  TrendingUp, 
  Droplets, 
  Bluetooth,
  Footprints 
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getHealthMetricHistory } from '@/services/health-service';
import { getHealthMetricsWithOfflineSupport, useSyncOnReconnect } from '@/services/health-service-wrapper';
import { HealthMetric } from '@/types/health';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

const Health = () => {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [isAddMetricOpen, setIsAddMetricOpen] = useState(false);
  const [healthMetrics, setHealthMetrics] = useState<{[key: string]: HealthMetric}>({});
  const [weightData, setWeightData] = useState<{date: string; value: number}[]>([]);
  const [bpData, setBpData] = useState<{date: string; value: number}[]>([]);
  const [bloodSugarData, setBloodSugarData] = useState<{date: string; value: number}[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  
  const { isSyncing } = useSyncOnReconnect(user?.id || '');

  useEffect(() => {
    if (user) {
      fetchHealthMetrics();
    }
  }, [user]);

  const fetchHealthMetrics = async () => {
    if (!user) return;
    
    setIsDataLoading(true);
    try {
      const response = await getHealthMetricsWithOfflineSupport(user.id);
      
      if (response.success) {
        const latestMetrics: {[key: string]: HealthMetric} = {};
        
        response.data.forEach(metric => {
          if (!latestMetrics[metric.metric_type] || 
              new Date(metric.date) > new Date(latestMetrics[metric.metric_type].date)) {
            latestMetrics[metric.metric_type] = metric;
          }
        });
        
        setHealthMetrics(latestMetrics);
        
        fetchMetricHistory('weight');
        fetchMetricHistory('blood_pressure');
        fetchMetricHistory('blood_sugar');
      }
    } catch (error) {
      console.error("Error fetching health metrics:", error);
      toast({
        title: "Error",
        description: "Failed to load health metrics",
        variant: "destructive",
      });
    } finally {
      setIsDataLoading(false);
    }
  };

  const fetchMetricHistory = async (metricType: string) => {
    if (!user) return;
    
    try {
      const response = await getHealthMetricHistory(user.id, metricType);
      
      if (response.success) {
        const chartData = response.data.map(metric => ({
          date: new Date(metric.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          value: metricType === 'blood_pressure' 
            ? parseInt(metric.value.split('/')[0]) 
            : parseFloat(metric.value)
        }));
        
        switch (metricType) {
          case 'weight':
            setWeightData(chartData);
            break;
          case 'blood_pressure':
            setBpData(chartData);
            break;
          case 'blood_sugar':
            setBloodSugarData(chartData);
            break;
        }
      }
    } catch (error) {
      console.error(`Error fetching ${metricType} history:`, error);
    }
  };

  const handleAddMetricSuccess = () => {
    fetchHealthMetrics();
  };

  if (!isLoading && !user) {
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
          <div className="flex items-center gap-2">
            <OfflineIndicator isSyncing={isSyncing} />
            <Button 
              className="bg-solo-purple hover:bg-solo-purple/80"
              onClick={() => setIsAddMetricOpen(true)}
            >
              <Plus size={16} className="mr-1" /> Add Entry
            </Button>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <ShareHealthData />
          <ImportHealthData />
        </div>
        
        <Link to="/devices">
          <Button 
            variant="outline" 
            className="w-full mb-4 border-solo-blue/30 text-solo-blue hover:bg-solo-blue/5"
          >
            <Bluetooth size={16} className="mr-2" /> Connect Health Devices
          </Button>
        </Link>
        
        <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-3`}>
          <HealthMetricCard
            title="Weight"
            value={healthMetrics.weight ? parseFloat(healthMetrics.weight.value) : 0}
            unit="kg"
            date={healthMetrics.weight ? new Date(healthMetrics.weight.date).toLocaleDateString() : ''}
            icon={<Scale size={20} />}
            change={healthMetrics.weight && weightData.length > 1 ? {
              value: Math.abs(parseFloat(healthMetrics.weight.value) - (weightData[weightData.length - 2]?.value || 0)),
              positive: parseFloat(healthMetrics.weight.value) < (weightData[weightData.length - 2]?.value || 0)
            } : undefined}
          />
          
          <HealthMetricCard
            title="Steps"
            value={healthMetrics.steps ? parseFloat(healthMetrics.steps.value) : 0}
            unit="steps"
            date={healthMetrics.steps ? new Date(healthMetrics.steps.date).toLocaleDateString() : ''}
            icon={<Footprints size={20} />}
          />
          
          <HealthMetricCard
            title="Height"
            value={healthMetrics.height ? parseFloat(healthMetrics.height.value) : 0}
            unit="cm"
            date={healthMetrics.height ? new Date(healthMetrics.height.date).toLocaleDateString() : ''}
            icon={<TrendingUp size={20} />}
          />
          
          <HealthMetricCard
            title="Blood Pressure"
            value={healthMetrics.blood_pressure ? healthMetrics.blood_pressure.value : "0/0"}
            unit="mmHg"
            date={healthMetrics.blood_pressure ? new Date(healthMetrics.blood_pressure.date).toLocaleDateString() : ''}
            icon={<Activity size={20} />}
            change={healthMetrics.blood_pressure && bpData.length > 1 ? {
              value: Math.abs(parseInt(healthMetrics.blood_pressure.value.split('/')[0]) - (bpData[bpData.length - 2]?.value || 0)),
              positive: parseInt(healthMetrics.blood_pressure.value.split('/')[0]) < (bpData[bpData.length - 2]?.value || 0)
            } : undefined}
          />
          
          <HealthMetricCard
            title="Heart Rate"
            value={healthMetrics.heart_rate ? parseFloat(healthMetrics.heart_rate.value) : 0}
            unit="bpm"
            date={healthMetrics.heart_rate ? new Date(healthMetrics.heart_rate.date).toLocaleDateString() : ''}
            icon={<Heart size={20} />}
          />
          
          <HealthMetricCard
            title="Blood Sugar"
            value={healthMetrics.blood_sugar ? parseFloat(healthMetrics.blood_sugar.value) : 0}
            unit="mg/dL"
            date={healthMetrics.blood_sugar ? new Date(healthMetrics.blood_sugar.date).toLocaleDateString() : ''}
            icon={<Droplets size={20} />}
            change={healthMetrics.blood_sugar && bloodSugarData.length > 1 ? {
              value: Math.abs(parseFloat(healthMetrics.blood_sugar.value) - (bloodSugarData[bloodSugarData.length - 2]?.value || 0)),
              positive: parseFloat(healthMetrics.blood_sugar.value) < (bloodSugarData[bloodSugarData.length - 2]?.value || 0)
            } : undefined}
          />
        </div>
        
        <div className="mt-6 space-y-4">
          {weightData.length > 0 && (
            <HealthChart
              title="Weight Trend"
              data={weightData}
              unit="kg"
              dataKey="value"
              color="#00A3FF"
            />
          )}
          
          {bpData.length > 0 && (
            <HealthChart
              title="Blood Pressure (Systolic)"
              data={bpData}
              unit="mmHg"
              dataKey="value"
              color="#9B30FF"
            />
          )}
          
          {bloodSugarData.length > 0 && (
            <HealthChart
              title="Blood Sugar"
              data={bloodSugarData}
              unit="mg/dL"
              dataKey="value"
              color="#00CED1"
            />
          )}
        </div>
        
        <Button 
          variant="outline" 
          className="w-full mt-4 border-dashed border-solo-blue/30 text-solo-blue hover:bg-solo-blue/5"
          onClick={() => setIsAddMetricOpen(true)}
        >
          <PlusCircle size={16} className="mr-2" /> Add New Health Metric
        </Button>
      </div>

      <AddHealthMetricCards 
        isOpen={isAddMetricOpen}
        onClose={() => setIsAddMetricOpen(false)}
        onSuccess={handleAddMetricSuccess}
      />
    </MobileLayout>
  );
};

export default Health;
