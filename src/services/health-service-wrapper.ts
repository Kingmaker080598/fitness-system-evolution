
import { HealthMetric, MetricType } from '@/types/health';
import * as healthService from '@/services/health-service';
import * as offlineStorage from '@/services/offline-storage';
import { useEffect, useState } from 'react';

// Enhanced getHealthMetrics with offline support
export const getHealthMetricsWithOfflineSupport = async (userId: string) => {
  try {
    // Try to get data from API if online
    if (offlineStorage.isOnline()) {
      const result = await healthService.getHealthMetrics(userId);
      
      if (result.success) {
        // Store the data locally for offline use
        offlineStorage.storeHealthMetricsLocally(result.data);
        return result;
      }
    }
    
    // If offline or API failed, use local data
    const localMetrics = offlineStorage.getLocalHealthMetrics();
    return {
      success: true,
      data: localMetrics.filter(metric => metric.user_id === userId)
    };
  } catch (error: any) {
    console.error('Error in getHealthMetricsWithOfflineSupport:', error);
    
    // Try local data as fallback
    const localMetrics = offlineStorage.getLocalHealthMetrics();
    return {
      success: true,
      data: localMetrics.filter(metric => metric.user_id === userId)
    };
  }
};

// Enhanced addHealthMetric with offline support
export const addHealthMetricWithOfflineSupport = async (
  userId: string,
  metricType: MetricType,
  value: string,
  unit: string,
  date: string
) => {
  const metricData = { user_id: userId, metric_type: metricType, value, unit, date };
  
  try {
    // If online, try to save directly
    if (offlineStorage.isOnline()) {
      const result = await healthService.saveHealthMetric(userId, metricType, value, unit);
      
      if (result.success) {
        // Update local cache with the new data
        const localMetrics = offlineStorage.getLocalHealthMetrics();
        offlineStorage.storeHealthMetricsLocally([...localMetrics, result.data]);
        return result;
      }
    }
    
    // If offline or API failed, save locally and queue for later upload
    offlineStorage.queueHealthMetricForUpload(metricData);
    
    // Return a simulated successful response
    return {
      success: true,
      data: {
        ...metricData,
        id: `local-${Date.now()}`,
        created_at: new Date().toISOString(),
      } as HealthMetric
    };
  } catch (error: any) {
    console.error('Error in addHealthMetricWithOfflineSupport:', error);
    
    // Store locally as fallback
    offlineStorage.queueHealthMetricForUpload(metricData);
    
    return {
      success: false,
      error: error.message || 'Failed to add health metric'
    };
  }
};

// Hook to sync data when coming back online
export const useSyncOnReconnect = (userId: string) => {
  const [isSyncing, setIsSyncing] = useState(false);
  
  useEffect(() => {
    const handleSync = async () => {
      if (!userId) return;
      
      setIsSyncing(true);
      
      try {
        // Get all pending uploads
        const pendingUploads = offlineStorage.getPendingUploads();
        
        // Try to upload each one
        for (let i = 0; i < pendingUploads.length; i++) {
          const { user_id, metric_type, value, unit, date } = pendingUploads[i];
          
          // Skip if not for this user
          if (user_id !== userId) continue;
          
          // Try to upload
          const result = await healthService.saveHealthMetric(
            user_id, 
            metric_type as MetricType, 
            value, 
            unit
          );
          
          if (result.success) {
            // Remove from pending on success
            offlineStorage.removePendingUpload(i);
            i--; // Adjust index after removal
          }
        }
        
        // Refresh local cache
        const result = await healthService.getHealthMetrics(userId);
        if (result.success) {
          offlineStorage.storeHealthMetricsLocally(result.data);
        }
      } catch (error) {
        console.error('Error syncing health metrics:', error);
      } finally {
        setIsSyncing(false);
      }
    };
    
    // Add listener for when we come back online
    const cleanupListener = offlineStorage.addOnlineListener(handleSync);
    
    // Run once when mounting to catch up if needed
    if (offlineStorage.isOnline()) {
      handleSync();
    }
    
    return cleanupListener;
  }, [userId]);
  
  return { isSyncing };
};
