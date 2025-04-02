
import { supabase } from '@/lib/supabase';
import type { HealthMetric, SharedHealthData } from '@/types/health';
import { toast } from '@/components/ui/use-toast';

export const saveHealthMetric = async (
  userId: string,
  metricType: string,
  value: string | number,
  unit: string
) => {
  try {
    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    const { data, error } = await supabase
      .from('health_metrics')
      .insert([
        {
          user_id: userId,
          metric_type: metricType,
          value: value.toString(),
          unit,
          date
        }
      ]);

    if (error) throw error;
    return { success: true, data };
  } catch (error: any) {
    console.error(`Error saving ${metricType}:`, error.message);
    return { success: false, error: error.message };
  }
};

export const getHealthMetrics = async (userId: string, metricType?: string) => {
  try {
    let query = supabase
      .from('health_metrics')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });
    
    if (metricType) {
      query = query.eq('metric_type', metricType);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return { success: true, data: data as HealthMetric[] };
  } catch (error: any) {
    console.error('Error getting health metrics:', error.message);
    return { success: false, error: error.message, data: [] };
  }
};

export const getHealthMetricHistory = async (userId: string, metricType: string, limit = 30) => {
  try {
    const { data, error } = await supabase
      .from('health_metrics')
      .select('*')
      .eq('user_id', userId)
      .eq('metric_type', metricType)
      .order('date', { ascending: true })
      .limit(limit);
    
    if (error) throw error;
    return { success: true, data: data as HealthMetric[] };
  } catch (error: any) {
    console.error(`Error getting ${metricType} history:`, error.message);
    return { success: false, error: error.message, data: [] };
  }
};

export const getSharedHealthData = async (shareCode: string): Promise<SharedHealthData | null> => {
  try {
    // Get the share data
    const { data: shareData, error: shareError } = await supabase
      .from('shared_health_data')
      .select('*')
      .eq('share_code', shareCode)
      .single();

    if (shareError) throw shareError;
    if (!shareData) throw new Error('Share not found');

    // Check if share has expired
    if (new Date(shareData.expires_at) < new Date()) {
      throw new Error('This share has expired');
    }

    // Get the metrics separately
    const { data: metrics, error: metricsError } = await supabase
      .from('health_metrics')
      .select('id, metric_type, value, unit, date, created_at')
      .eq('user_id', shareData.sender_id)
      .gte('date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]); // Last 30 days

    if (metricsError) throw metricsError;

    return { ...shareData, metrics } as SharedHealthData;
  } catch (error: any) {
    console.error('Error getting shared health data:', error);
    throw error;
  }
};

export const importHealthData = async (shareCode: string, userId: string) => {
  try {
    // Get the shared data
    const shareData = await getSharedHealthData(shareCode);
    if (!shareData?.metrics?.length) {
      throw new Error('No health metrics found in this share');
    }

    // Import each metric
    const newMetrics = shareData.metrics.map(metric => ({
      ...metric,
      id: undefined, // Let the database generate a new ID
      user_id: userId,
      imported_from: shareData.sender_id,
      imported_at: new Date().toISOString(),
    }));

    // Insert the metrics
    const { error: insertError } = await supabase
      .from('health_metrics')
      .insert(newMetrics);

    if (insertError) throw insertError;

    toast({
      title: 'Health Data Imported',
      description: `Successfully imported ${newMetrics.length} health metrics from ${shareData.sender_name || 'another user'}.`,
    });

    return { success: true, data: newMetrics };
  } catch (error: any) {
    console.error('Error importing health data:', error);
    throw error;
  }
};
