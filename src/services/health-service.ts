
import { supabase, HealthMetric } from '@/lib/supabase';

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
