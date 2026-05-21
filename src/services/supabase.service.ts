import { ScanResult } from '@/types/scan';

export const supabaseService = {
  async saveScanResult(result: ScanResult): Promise<{ error: any }> {
    console.log('Saving to Supabase:', result);
    // Mock successful save
    return { error: null };
  },

  async getScanHistory(userId: string): Promise<ScanResult[]> {
    return [];
  }
};
