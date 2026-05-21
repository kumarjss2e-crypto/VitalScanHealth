import { ProviderFactory } from '../lib/scan/factory';
import { ProviderType, ScanProvider } from '../lib/scan/types';
import { ScanStatus, VitalsData, ScanResult, RealtimeMetric } from '@/types/scan';
import { supabaseService } from './supabase.service';

export class ScanService {
  private provider: ScanProvider;
  private currentUserId: string = 'demo-user';

  constructor(providerType: ProviderType = 'mock') {
    this.provider = ProviderFactory.getProvider(providerType);
  }

  async initialize(videoElement: HTMLVideoElement) {
    await this.provider.initialize();
    await this.provider.requestPermissions();
    await this.provider.startSession(videoElement);
  }

  async startScan() {
    return this.provider.startScan();
  }

  async stopScan() {
    return this.provider.stopScan();
  }

  // Subscribe to provider events
  onStatusChange(cb: (s: ScanStatus) => void) { this.provider.onStatusChange(cb); }
  onMetricUpdate(cb: (m: RealtimeMetric) => void) { this.provider.onMetricUpdate(cb); }
  onResult(cb: (r: VitalsData) => void) { 
    this.provider.onResult(async (vitals) => {
      const result: ScanResult = {
        id: crypto.randomUUID(),
        userId: this.currentUserId,
        timestamp: new Date().toISOString(),
        vitals,
        confidence: 0.95,
        provider: this.provider.name,
      };
      
      await supabaseService.saveScanResult(result);
      cb(vitals);
    });
  }
}
