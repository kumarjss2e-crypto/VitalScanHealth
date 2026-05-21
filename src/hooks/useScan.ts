"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { ScanService } from '@/services/scan.service';
import { ScanStatus, VitalsData, RealtimeMetric } from '@/types/scan';
import { ProviderType } from '@/lib/scan/types';

export function useScan(providerType: ProviderType = 'mock') {
  const [status, setStatus] = useState<ScanStatus>('idle');
  const [metrics, setMetrics] = useState<RealtimeMetric[]>([]);
  const [result, setResult] = useState<VitalsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const scanServiceRef = useRef<ScanService | null>(null);

  useEffect(() => {
    const service = new ScanService(providerType);
    scanServiceRef.current = service;
    
    service.onStatusChange(setStatus);
    
    // Throttle metric updates to prevent excessive re-renders
    let lastUpdate = 0;
    service.onMetricUpdate((m) => {
      const now = Date.now();
      if (now - lastUpdate > 100) { // Max 10 updates per second
        setMetrics(prev => [...prev.slice(-19), m]);
        lastUpdate = now;
      }
    });

    service.onResult(setResult);
    
    return () => {
      service.stopScan();
      scanServiceRef.current = null;
    };
  }, [providerType]);

  const startScan = useCallback(async (videoElement: HTMLVideoElement) => {
    try {
      setError(null);
      await scanServiceRef.current?.initialize(videoElement);
      await scanServiceRef.current?.startScan();
    } catch (e: any) {
      setError(e.message || 'Failed to start scan');
      setStatus('error');
    }
  }, []);

  const stopScan = useCallback(async () => {
    await scanServiceRef.current?.stopScan();
  }, []);

  return {
    status,
    metrics,
    result,
    error,
    startScan,
    stopScan,
    isScanning: status === 'scanning',
    isProcessing: status === 'processing'
  };
}
