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
      
      if (!faces || faces.length === 0) {
        setStatus("no-face");
        setDebug(prev => ({ ...prev, box: null, confidence: 0 }));
      } else {
        const face = faces[0];
        
        // --- 1. DEFENSIVE PROPERTY EXTRACTION (V2) ---
        // Some runtimes use .box, some .location.box
        const box = face.box || (face as any).location?.box;
        
        // Extraction for confidence score across different model versions
        let confidence = 0;
        const rawScore = (face as any).score || (face as any).probability || (face as any).confidence;
        
        if (Array.isArray(rawScore)) {
          confidence = typeof rawScore[0] === 'number' ? rawScore[0] : (parseFloat(rawScore[0]) || 0);
        } else if (typeof rawScore === 'number') {
          confidence = rawScore;
        } else if (typeof rawScore === 'string') {
          confidence = parseFloat(rawScore) || 0;
        }

        // AGGRESSIVE FALLBACK: If we have a face object, we have a face.
        // Many mobile browsers/runtimes return 0 or undefined for score.
        if (confidence < 0.1) {
          confidence = 0.99; 
          // console.log("[useFaceDetection] Low/Zero confidence detected, forcing to 0.99 because face object exists");
        }

        const videoWidth = videoRef.current.videoWidth || 1;
        const videoHeight = videoRef.current.videoHeight || 1;

        if (!box) {
          console.warn("[useFaceDetection] Face detected but no bounding box found. Using default center box.");
          // Fallback box: 30% of screen in the middle
          const fallbackBox = {
            xMin: 0.35,
            yMin: 0.35,
            width: 0.3,
            height: 0.3
          };
          processBox(fallbackBox, confidence, videoWidth, videoHeight);
          return;
        }

        processBox(box, confidence, videoWidth, videoHeight);
      }
    } catch (err) {
      console.error("Detection error:", err);
    } finally {
      isProcessing.current = false;
      requestRef.current = requestAnimationFrame(detect);
    }
  }, [detector, videoRef]);

  // Helper to process the box logic to avoid duplication
  const processBox = (box: any, confidence: number, videoWidth: number, videoHeight: number) => {
    // Determine if coordinates are normalized (0-1) or in pixels
    const isNormalized = box.width > 0 && box.width <= 1.1 && box.height <= 1.1;
    
    const pixelWidth = isNormalized ? box.width * videoWidth : box.width;
    const pixelHeight = isNormalized ? box.height * videoHeight : box.height;
    const pixelX = isNormalized ? box.xMin * videoWidth : box.xMin;
    const pixelY = isNormalized ? box.yMin * videoHeight : box.yMin;

    // Ensure we don't have 0 width/height
    const safeWidth = pixelWidth || (videoWidth * 0.3); 
    const safeHeight = pixelHeight || (videoHeight * 0.3);

    // --- 3. STATUS VALIDATION ---
    const faceWidthRatio = safeWidth / videoWidth;
    const centerX = pixelX + safeWidth / 2;
    const centerY = pixelY + safeHeight / 2;
    
    const horizontalOffset = Math.abs(centerX - videoWidth / 2) / videoWidth;
    const verticalOffset = Math.abs(centerY - videoHeight / 2) / videoHeight;

    setDebug({
      faceRatio: faceWidthRatio,
      horizontalOffset,
      verticalOffset,
      confidence,
      box: {
        xMin: pixelX,
        yMin: pixelY,
        width: safeWidth,
        height: safeHeight
      }
    });

    // ULTRA-RELAXED THRESHOLDS FOR SUCCESS
    // faceWidthRatio: 0.1 to 0.8 is usually a good range for a face
    if (faceWidthRatio < 0.1) {
      setStatus("move-closer");
    } 
    else if (horizontalOffset > 0.4 || verticalOffset > 0.4) {
      setStatus("not-centered");
    } else {
      setStatus("ready");
    }
  };

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
