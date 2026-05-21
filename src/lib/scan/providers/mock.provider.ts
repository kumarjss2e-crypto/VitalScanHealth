import { ScanProvider } from '../types';
import { ScanStatus, VitalsData, RealtimeMetric } from '@/types/scan';

export class MockProvider implements ScanProvider {
  readonly name = 'mock';
  private status: ScanStatus = 'idle';
  private intervalId?: NodeJS.Timeout;
  
  private callbacks = {
    status: [] as ((s: ScanStatus) => void)[],
    metric: [] as ((m: RealtimeMetric) => void)[],
    result: [] as ((r: VitalsData) => void)[],
    error: [] as ((e: any) => void)[],
  };

  async initialize(): Promise<void> {
    this.updateStatus('initializing');
    await new Promise(r => setTimeout(r, 1000));
    this.updateStatus('idle');
  }

  async requestPermissions(): Promise<boolean> {
    return true;
  }

  async startSession(videoElement: HTMLVideoElement): Promise<void> {
    this.updateStatus('aligning');
    await new Promise(r => setTimeout(r, 2000));
    this.updateStatus('idle');
  }

  async stopSession(): Promise<void> {
    this.stopScan();
    this.updateStatus('idle');
  }

  async startScan(): Promise<void> {
    this.updateStatus('scanning');
    let progress = 0;
    
    this.intervalId = setInterval(() => {
      progress += 5;
      
      // Emit fake realtime metrics
      this.callbacks.metric.forEach(cb => cb({
        type: 'heartRate',
        value: 65 + Math.random() * 10,
        timestamp: Date.now()
      }));

      if (progress >= 100) {
        this.completeScan();
      }
    }, 500);
  }

  async stopScan(): Promise<void> {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  private completeScan() {
    this.stopScan();
    this.updateStatus('processing');
    
    setTimeout(() => {
      const results: VitalsData = {
        heartRate: 72,
        bloodPressure: { systolic: 120, diastolic: 80 },
        spo2: 98,
        stressLevel: 20,
        wellnessScore: 85,
        temperatureEstimate: 36.6
      };
      
      this.callbacks.result.forEach(cb => cb(results));
      this.updateStatus('completed');
    }, 2000);
  }

  private updateStatus(status: ScanStatus) {
    this.status = status;
    this.callbacks.status.forEach(cb => cb(status));
  }

  onStatusChange(cb: (s: ScanStatus) => void) { this.callbacks.status.push(cb); }
  onMetricUpdate(cb: (m: RealtimeMetric) => void) { this.callbacks.metric.push(cb); }
  onResult(cb: (r: VitalsData) => void) { this.callbacks.result.push(cb); }
  onError(cb: (e: any) => void) { this.callbacks.error.push(cb); }
}
