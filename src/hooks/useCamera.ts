"use client";

import { useState, useCallback, useRef, useEffect } from "react";

export type CameraStatus = "idle" | "loading" | "ready" | "error";

export interface CameraError {
  name: string;
  message: string;
}

export function useCamera() {
  const [status, setStatus] = useState<CameraStatus>("idle");
  const [error, setError] = useState<CameraError | null>(null);
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isInitializing = useRef(false);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setStatus("idle");
    setError(null);
    isInitializing.current = false;
  }, []);

  const startCamera = useCallback(async () => {
    // Prevent double initialization in Strict Mode or rapid clicks
    if (isInitializing.current) return;
    isInitializing.current = true;

    setStatus("loading");
    setError(null);

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      // Ensure video element exists before attaching
      if (!videoRef.current) {
        throw new Error("Video element not found");
      }

      videoRef.current.srcObject = stream;

      // Standard mobile video attributes are handled in the component, 
      // but we wait for metadata and play() here for stability.
      await new Promise<void>((resolve, reject) => {
        if (!videoRef.current) return reject(new Error("Video element lost"));
        
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play()
            .then(resolve)
            .catch(reject);
        };
        
        // Timeout safety
        setTimeout(() => reject(new Error("Camera initialization timeout")), 5000);
      });

      setStatus("ready");
    } catch (err: any) {
      console.error("Camera Error:", err);
      setError({
        name: err.name || "CameraError",
        message: err.message || "Could not access camera",
      });
      setStatus("error");
      stopCamera();
    } finally {
      isInitializing.current = false;
    }
  }, [stopCamera]);

  // Automatic cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return {
    status,
    error,
    videoRef,
    startCamera,
    stopCamera,
  };
}
