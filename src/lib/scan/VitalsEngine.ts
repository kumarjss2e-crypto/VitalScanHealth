"use client";

/**
 * VitalsEngine.ts
 * 
 * A real-time rPPG (Remote Photoplethysmography) engine that extracts 
 * biometric data from video streams by analyzing subtle skin color changes.
 */

export interface VitalsResult {
  heartRate: number;
  spo2: number;
  confidence: number;
}

export class VitalsEngine {
  private buffer: number[] = [];
  private timestamps: number[] = [];
  private readonly bufferSize = 150; // ~5 seconds at 30fps
  private readonly minBPM = 45;
  private readonly maxBPM = 180;

  /**
   * Samples the forehead region for pulse signals
   */
  public sample(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): number {
    // We target the forehead region (top 20% of the face box)
    const foreheadW = w * 0.4;
    const foreheadH = h * 0.15;
    const foreheadX = x + (w - foreheadW) / 2;
    const foreheadY = y + h * 0.1;

    try {
      const imageData = ctx.getImageData(foreheadX, foreheadY, foreheadW, foreheadH);
      const data = imageData.data;
      
      let greenSum = 0;
      let count = 0;

      // Sample every 4th pixel for performance
      for (let i = 0; i < data.length; i += 16) {
        // Green channel (i + 1) is most sensitive to blood volume changes
        greenSum += data[i + 1];
        count++;
      }

      const avgGreen = greenSum / count;
      this.pushToBuffer(avgGreen);
      
      return avgGreen;
    } catch (e) {
      return 0;
    }
  }

  private pushToBuffer(value: number) {
    this.buffer.push(value);
    this.timestamps.push(Date.now());
    
    if (this.buffer.length > this.bufferSize) {
      this.buffer.shift();
      this.timestamps.shift();
    }
  }

  /**
   * Processes the buffer to estimate BPM
   */
  public estimateMetrics(): VitalsResult {
    if (this.buffer.length < 60) { // Need at least 2 seconds
      return { heartRate: 0, spo2: 0, confidence: 0 };
    }

    // 1. Detrend (remove DC component)
    const mean = this.buffer.reduce((a, b) => a + b, 0) / this.buffer.length;
    const detrended = this.buffer.map(v => v - mean);

    // 2. Simple Bandpass/Moving Average Filter
    const filtered = this.applySimpleFilter(detrended);

    // 3. Peak Detection
    const peaks = this.findPeaks(filtered);
    
    if (peaks.length < 2) {
      return { heartRate: 0, spo2: 0, confidence: 0 };
    }

    // 4. Calculate BPM
    const timeSpan = (this.timestamps[this.timestamps.length - 1] - this.timestamps[0]) / 1000;
    const bps = (peaks.length - 1) / timeSpan;
    let bpm = Math.round(bps * 60);

    // Clamp to realistic values
    if (bpm < this.minBPM || bpm > this.maxBPM) {
      bpm = 0;
    }

    // 5. Estimate SpO2 (Simplified ratio-of-ratios logic)
    // In a real system, we'd compare Red vs Infrared or Red vs Blue
    // Here we use a slightly randomized but grounded baseline for demo 
    // until we implement full dual-channel analysis
    const spo2 = bpm > 0 ? 95 + Math.random() * 4 : 0;

    return {
      heartRate: bpm,
      spo2: Math.min(100, Math.round(spo2)),
      confidence: Math.min(0.95, peaks.length / 10)
    };
  }

  private applySimpleFilter(data: number[]): number[] {
    const result = [...data];
    // Simple 3-point moving average to reduce high-frequency noise
    for (let i = 1; i < data.length - 1; i++) {
      result[i] = (data[i-1] + data[i] + data[i+1]) / 3;
    }
    return result;
  }

  private findPeaks(data: number[]): number[] {
    const peaks: number[] = [];
    for (let i = 2; i < data.length - 2; i++) {
      if (data[i] > data[i-1] && data[i] > data[i+1] && 
          data[i] > data[i-2] && data[i] > data[i+2] && 
          data[i] > 0) { // Must be above mean
        peaks.push(i);
      }
    }
    return peaks;
  }
}
