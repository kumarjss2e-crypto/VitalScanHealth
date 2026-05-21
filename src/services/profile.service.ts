import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];
type UpdateProfile = Database['public']['Tables']['profiles']['Update'];

export const profileService = {
  /**
   * Get user profile
   */
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update user profile
   */
  async updateProfile(userId: string, profile: UpdateProfile) {
    const { data, error } = await supabase
      .from('profiles')
      .update(profile)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Get AI insights for user
   */
  async getInsights(userId: string) {
    const { data, error } = await supabase
      .from('ai_insights')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
};
