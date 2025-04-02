
import { supabase } from '@/lib/supabase';

interface SharedHealthData {
  id?: string;
  sender_id: string;
  sender_name?: string;
  share_code: string;
  expires_at: string;
  created_at?: string;
}

export const createShareableLink = async (userId: string) => {
  try {
    // Get user's email for the sender name
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error('Please log in to share health data');

    // Generate a random code
    const shareCode = 'SHARE' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48 hours

    // Save the share code
    const { data, error } = await supabase
      .from('shared_health_data')
      .insert({
        sender_id: userId,
        share_code: shareCode,
        expires_at: expiresAt.toISOString(),
        sender_name: user.email
      })
      .select()
      .single();

    if (error) throw error;
    return { success: true, data: data as SharedHealthData };
  } catch (error: any) {
    console.error('Error creating shareable link:', error.message);
    return { success: false, error: error.message };
  }
};

export const getSharedHealthData = async (shareCode: string) => {
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

    return { success: true, data: { ...shareData, metrics } };
  } catch (error: any) {
    console.error('Error getting shared health data:', error);
    return { success: false, error: error.message };
  }
};
