
import { HealthMetric } from '@/types/health';

// Keys for local storage
const HEALTH_METRICS_KEY = 'offline_health_metrics';
const PENDING_UPLOADS_KEY = 'pending_metric_uploads';

// Store health metrics locally for offline access
export const storeHealthMetricsLocally = (metrics: HealthMetric[]) => {
  try {
    localStorage.setItem(HEALTH_METRICS_KEY, JSON.stringify(metrics));
    return true;
  } catch (error) {
    console.error('Error storing health metrics locally:', error);
    return false;
  }
};

// Get locally stored health metrics
export const getLocalHealthMetrics = (): HealthMetric[] => {
  try {
    const storedMetrics = localStorage.getItem(HEALTH_METRICS_KEY);
    return storedMetrics ? JSON.parse(storedMetrics) : [];
  } catch (error) {
    console.error('Error retrieving local health metrics:', error);
    return [];
  }
};

// Queue a new health metric to be uploaded when online
export const queueHealthMetricForUpload = (metric: Omit<HealthMetric, 'id' | 'created_at'>) => {
  try {
    const pendingUploads = getPendingUploads();
    pendingUploads.push(metric);
    localStorage.setItem(PENDING_UPLOADS_KEY, JSON.stringify(pendingUploads));
    return true;
  } catch (error) {
    console.error('Error queuing health metric for upload:', error);
    return false;
  }
};

// Get pending health metric uploads
export const getPendingUploads = (): Omit<HealthMetric, 'id' | 'created_at'>[] => {
  try {
    const pendingUploads = localStorage.getItem(PENDING_UPLOADS_KEY);
    return pendingUploads ? JSON.parse(pendingUploads) : [];
  } catch (error) {
    console.error('Error retrieving pending uploads:', error);
    return [];
  }
};

// Remove a metric from the pending uploads queue
export const removePendingUpload = (index: number) => {
  try {
    const pendingUploads = getPendingUploads();
    pendingUploads.splice(index, 1);
    localStorage.setItem(PENDING_UPLOADS_KEY, JSON.stringify(pendingUploads));
    return true;
  } catch (error) {
    console.error('Error removing pending upload:', error);
    return false;
  }
};

// Check if device is online
export const isOnline = (): boolean => {
  return navigator.onLine;
};

// Add a listener for when the device comes online
export const addOnlineListener = (callback: () => void) => {
  window.addEventListener('online', callback);
  return () => window.removeEventListener('online', callback); // Return cleanup function
};
