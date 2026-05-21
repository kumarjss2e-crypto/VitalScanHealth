"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import * as faceDetection from "@tensorflow-models/face-detection";
import "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";

export type DetectionStatus = 
  | "initializing" 
  | "no-face" 
  | "move-closer" 
  | "not-centered" 
  | "lighting-low" 
  | "ready";

export interface DetectionDebug {
  faceRatio: number;
  horizontalOffset: number;
  verticalOffset: number;
  confidence: number;
  box: { xMin: number; yMin: number; width: number; height: number } | null;
}

export function useFaceDetection(videoRef: React.RefObject<HTMLVideoElement | null>) {
  const [status, setStatus] = useState<DetectionStatus>("initializing");
  const [debug, setDebug] = useState<DetectionDebug>({
    faceRatio: 0,
    horizontalOffset: 0,
    verticalOffset: 0,
    confidence: 0,
    box: null
  });
  const [detector, setDetector] = useState<faceDetection.FaceDetector | null>(null);
  const requestRef = useRef<number>(null);
  const isProcessing = useRef(false);

  // Initialize detector
  useEffect(() => {
    async function init() {
      try {
        const model = faceDetection.SupportedModels.MediaPipeFaceDetector;
        const detectorConfig: any = {
          runtime: 'tfjs',
          maxFaces: 1,
          modelType: 'short',
        };
        const newDetector = await faceDetection.createDetector(model, detectorConfig);
        setDetector(newDetector);
      } catch (err) {
        console.error("Failed to initialize face detector:", err);
      }
    }
    init();
  }, []);

  const detect = useCallback(async () => {
    if (!detector || !videoRef.current || isProcessing.current) return;
    
    // Ensure video is playing and has data
    if (videoRef.current.readyState < 2) {
      requestRef.current = requestAnimationFrame(detect);
      return;
    }

    isProcessing.current = true;

    try {
      const faces = await detector.estimateFaces(videoRef.current);
      
      if (faces.length === 0) {
        setStatus("no-face");
        setDebug(prev => ({ ...prev, box: null, confidence: 0 }));
      } else {
        const face = faces[0];
        const box = face.box;
        const confidence = (face as any).score || 0;
        const videoWidth = videoRef.current.videoWidth;
        const videoHeight = videoRef.current.videoHeight;

        // Determine if coordinates are normalized (0-1) or in pixels
        // MediaPipe Tfjs usually returns pixels, but we handle both for safety
        const isNormalized = box.width <= 1 && box.height <= 1;
        const pixelWidth = isNormalized ? box.width * videoWidth : box.width;
        const pixelHeight = isNormalized ? box.height * videoHeight : box.height;
        const pixelX = isNormalized ? box.xMin * videoWidth : box.xMin;
        const pixelY = isNormalized ? box.yMin * videoHeight : box.yMin;

        // 1. Check size based on Width Ratio (more robust than Area)
        // We want the face to be at least 15% of the frame width
        const faceWidthRatio = pixelWidth / videoWidth;
        const faceArea = pixelWidth * pixelHeight;
        const frameArea = videoWidth * videoHeight;
        const faceRatio = faceArea / frameArea;

        const centerX = pixelX + pixelWidth / 2;
        const centerY = pixelY + pixelHeight / 2;
        
        const horizontalOffset = Math.abs(centerX - videoWidth / 2) / videoWidth;
        const verticalOffset = Math.abs(centerY - videoHeight / 2) / videoHeight;

        setDebug({
          faceRatio: faceWidthRatio, // Use width ratio for debug display as it's more intuitive
          horizontalOffset,
          verticalOffset,
          confidence,
          box: {
            xMin: pixelX,
            yMin: pixelY,
            width: pixelWidth,
            height: pixelHeight
          }
        });

        // RELAXED THRESHOLDS for better UX
        // Minimum width ratio: 0.1 (10% of frame width)
        if (faceWidthRatio < 0.1) {
          setStatus("move-closer");
        } 
        // 2. Check alignment (forgiving 30% offset)
        else if (horizontalOffset > 0.3 || verticalOffset > 0.35) {
          setStatus("not-centered");
        } else {
          setStatus("ready");
        }
      }
    } catch (err) {
      console.error("Detection error:", err);
    } finally {
      isProcessing.current = false;
      requestRef.current = requestAnimationFrame(detect);
    }
  }, [detector, videoRef]);

  // Start detection loop when detector and video are ready
  useEffect(() => {
    if (detector && videoRef.current) {
      requestRef.current = requestAnimationFrame(detect);
    }
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [detector, detect, videoRef]);

  return { status, debug };
}
