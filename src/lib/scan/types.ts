import { ScanStatus, VitalsData, ScanResult, RealtimeMetric } from '@/types/scan';

export interface ScanProvider {
  readonly name: string;
  
  // Initialization
  initialize(): Promise<void>;
  
  // Camera & Session
  requestPermissions(): Promise<boolean>;
  startSession(videoElement: HTMLVideoElement): Promise<void>;
  stopSession(): Promise<void>;
  
  // Scanning
  startScan(): Promise<void>;
  stopScan(): Promise<void>;
  
  // Event Handlers
  onStatusChange(callback: (status: ScanStatus) => void): void;
  onMetricUpdate(callback: (metric: RealtimeMetric) => void): void;
  onResult(callback: (result: VitalsData) => void): void;
  onError(callback: (error: any) => void): void;
}

export type ProviderType = 'mock' | 'binah' | 'faceheart';
