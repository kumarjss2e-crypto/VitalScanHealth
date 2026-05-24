export type ScanStatus = 'idle' | 'initializing' | 'aligning' | 'scanning' | 'processing' | 'completed' | 'error';

export interface VitalsData {
  heartRate: number;
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  spo2: number;
  stressLevel: number; // 0-100
  temperatureEstimate?: number;
  respirationRate?: number;
  wellnessScore: number;
}

export interface ScanResult {
  id: string;
  userId: string;
  timestamp: string;
  vitals: VitalsData;
  confidence: number; // 0-1
  provider: string;
  metadata?: Record<string, any>;
}

export interface ResultData {
  heartRate: number;
  spo2: number;
  stress: string;
  wellnessScore: number;
  hrv?: number;
  bloodPressure?: { systolic: number; diastolic: number };
}

export interface RealtimeMetric {
  type: keyof VitalsData | 'signal';
  value: number;
  timestamp: number;
}

export interface ScanError {
  code: string;
  message: string;
  details?: any;
}
