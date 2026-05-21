import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';

type Scan = Database['public']['Tables']['scans']['Row'];
type InsertScan = Database['public']['Tables']['scans']['Insert'];

export const scanService = {
  /**
   * Fetch recent scans for a user
   */
  async getRecentScans(userId: string, limit = 10) {
    const { data, error } = await supabase
      .from('scans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  /**
   * Save a new scan result
   */
  async saveScan(scan: InsertScan) {
    const { data, error } = await supabase
      .from('scans')
      .insert(scan)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Get wellness trends (e.g., heart rate over time)
   */
  async getWellnessTrends(userId: string, days = 7) {
    const date = new Date();
    date.setDate(date.getDate() - days);

    const { data, error } = await supabase
      .from('scans')
      .select('created_at, heart_rate, spo2, stress_level, wellness_score')
      .eq('user_id', userId)
      .gte('created_at', date.toISOString())
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  }
};
