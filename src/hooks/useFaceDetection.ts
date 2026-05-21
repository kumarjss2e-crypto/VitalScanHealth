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

export function useFaceDetection(videoRef: React.RefObject<HTMLVideoElement | null>) {
  const [status, setStatus] = useState<DetectionStatus>("initializing");
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
      } else {
        const face = faces[0];
        const box = face.box;
        const videoWidth = videoRef.current.videoWidth;
        const videoHeight = videoRef.current.videoHeight;

        // 1. Check size (move closer)
        // Face should take up a reasonable portion of the frame
        const faceArea = box.width * box.height;
        const frameArea = videoWidth * videoHeight;
        const faceRatio = faceArea / frameArea;

        if (faceRatio < 0.05) {
          setStatus("move-closer");
        } 
        // 2. Check alignment (not centered)
        else {
          const centerX = box.xMin + box.width / 2;
          const centerY = box.yMin + box.height / 2;
          
          const horizontalOffset = Math.abs(centerX - videoWidth / 2) / videoWidth;
          const verticalOffset = Math.abs(centerY - videoHeight / 2) / videoHeight;

          if (horizontalOffset > 0.15 || verticalOffset > 0.2) {
            setStatus("not-centered");
          } else {
            setStatus("ready");
          }
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

  return { status };
}
