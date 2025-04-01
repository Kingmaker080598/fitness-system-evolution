
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

export const signUp = async (email: string, password: string, name: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) throw error;
    
    // If signUp is successful, also create a user profile record
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          { id: data.user.id, name, email }
        ]);
      
      if (profileError) throw profileError;
    }

    return { success: true, data };
  } catch (error: any) {
    console.error('Error signing up:', error.message);
    return { success: false, error: error.message };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return { success: true, data };
  } catch (error: any) {
    console.error('Error signing in:', error.message);
    return { success: false, error: error.message };
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error('Error signing out:', error.message);
    return { success: false, error: error.message };
  }
};

export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    
    if (data.user) {
      // Get additional profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
        
      if (profileError && profileError.code !== 'PGRST116') throw profileError;
      
      return { success: true, user: { ...data.user, profile: profileData || {} } };
    }
    
    return { success: false, user: null };
  } catch (error: any) {
    console.error('Error getting current user:', error.message);
    return { success: false, user: null, error: error.message };
  }
};
