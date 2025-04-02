// Update the health-service-wrapper.ts file to fix the addHealthMetric references
import { getHealthMetrics, saveHealthMetric } from './health-service';
import { HealthMetric } from '@/types/health';
import { getOfflineData, storeOfflineData, clearSyncedItems } from './offline-storage';

// Rest of the file remains the same, but we need to replace addHealthMetric with saveHealthMetric
// in the syncOfflineHealthMetrics function and saveOfflineHealthMetric function

export const saveOfflineHealthMetric = async (
  userId: string,
  metricType: string,
  value: string,
  unit: string
): Promise<{ success: boolean; data?: any; error?: string }> => {
  try {
    // Check if online
    if (navigator.onLine) {
      // If online, try to save directly
      const response = await saveHealthMetric(userId, metricType, value, unit);
      return response;
    } else {
      // If offline, store locally
      const metric = {
        user_id: userId,
        metric_type: metricType as any,
        value: value,
        unit: unit,
        date: new Date().toISOString(),
        is_synced: false,
        local_id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      };
      
      const existingData = await getOfflineData('health-metrics') as any[];
      const updatedData = [...existingData, metric];
      await storeOfflineData('health-metrics', updatedData);
      
      return { success: true, data: metric };
    }
  } catch (error: any) {
    console.error("Error saving health metric offline:", error);
    return { success: false, error: error.message };
  }
};

export const syncOfflineHealthMetrics = async (userId: string): Promise<void> => {
  try {
    if (!navigator.onLine) {
      console.log("Still offline, can't sync metrics");
      return;
    }
    
    const offlineMetrics = await getOfflineData('health-metrics') as any[];
    const unsyncedMetrics = offlineMetrics.filter(metric => 
      metric.user_id === userId && !metric.is_synced
    );
    
    if (unsyncedMetrics.length === 0) {
      console.log("No unsynced metrics to sync");
      return;
    }
    
    console.log(`Syncing ${unsyncedMetrics.length} offline health metrics`);
    
    const syncPromises = unsyncedMetrics.map(async (metric) => {
      try {
        const response = await saveHealthMetric(
          metric.user_id,
          metric.metric_type,
          metric.value,
          metric.unit
        );
        
        if (response.success) {
          // Mark as synced in local storage
          const existingData = await getOfflineData('health-metrics') as any[];
          const updatedData = existingData.map(m => 
            m.local_id === metric.local_id ? { ...m, is_synced: true } : m
          );
          await storeOfflineData('health-metrics', updatedData);
          return { success: true, metric };
        } else {
          return { success: false, metric, error: response.error };
        }
      } catch (error: any) {
        console.error(`Error syncing metric ${metric.metric_type}:`, error);
        return { success: false, metric, error: error.message };
      }
    });
    
    const results = await Promise.all(syncPromises);
    const successCount = results.filter(r => r.success).length;
    console.log(`Successfully synced ${successCount} of ${unsyncedMetrics.length} metrics`);
    
    // Clean up fully synced items
    await clearSyncedItems('health-metrics');
    
  } catch (error) {
    console.error("Error syncing offline health metrics:", error);
  }
};

export const getHealthMetricsWithOfflineSupport = async (userId: string): Promise<{ success: boolean; data: HealthMetric[]; error?: string }> => {
  try {
    // Try to get data from the API
    if (navigator.onLine) {
      const response = await getHealthMetrics(userId);
      if (response.success) {
        return response;
      } else {
        console.warn("Failed to fetch health metrics from API, falling back to offline data.");
      }
    }

    // If API fetch fails or offline, get data from local storage
    const offlineData = await getOfflineData('health-metrics') as any[];
    const userMetrics = offlineData.filter(metric => metric.user_id === userId);
    
    return { success: true, data: userMetrics };
  } catch (error: any) {
    console.error("Error getting health metrics with offline support:", error);
    return { success: false, data: [], error: error.message };
  }
};

import { useEffect, useState } from 'react';

export const useSyncOnReconnect = (userId: string) => {
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const handleOnline = async () => {
      setIsSyncing(true);
      console.log("Back online, attempting to sync offline health metrics...");
      await syncOfflineHealthMetrics(userId);
      setIsSyncing(false);
    };

    window.addEventListener('online', handleOnline);

    // Initial sync attempt on mount if online
    if (navigator.onLine) {
      handleOnline();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, [userId]);

  return { isSyncing };
};
