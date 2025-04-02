export interface HealthMetric {
  id: string;
  user_id: string;
  metric_type: 'weight' | 'steps' | 'heart_rate' | 'sleep_hours' | 'water_ml';
  value: string;
  unit: string;
  date: string;
  created_at: string;
}

export interface SharedHealthData {
  id: string;
  sender_id: string;
  recipient_email?: string;
  share_code: string;
  expires_at: string;
  created_at: string;
  sender_name?: string;
  metrics?: HealthMetric[];
}

export type MetricType = HealthMetric['metric_type'];

export const metricLabels: Record<MetricType, string> = {
  weight: 'Weight (kg)',
  steps: 'Steps',
  heart_rate: 'Heart Rate (bpm)',
  sleep_hours: 'Sleep (hours)',
  water_ml: 'Water (ml)',
};
