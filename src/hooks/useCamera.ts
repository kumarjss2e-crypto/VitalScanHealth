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
      const video = videoRef.current;
      if (!video) {
        throw new Error("Video element not found");
      }

      // 1. Set critical attributes BEFORE assigning srcObject
      video.muted = true;
      video.setAttribute("playsinline", "true");
      video.srcObject = stream;

      // 2. Robust hardware sync flow
      await new Promise<void>((resolve, reject) => {
        let isResolved = false;

        const handleReady = async () => {
          if (isResolved) return;
          try {
            console.log("[useCamera] Video ready, attempting play()...");
            await video.play();
            console.log("[useCamera] Playback started successfully");
            isResolved = true;
            resolve();
          } catch (e) {
            console.error("[useCamera] Playback failed:", e);
            reject(new Error("Playback failed: " + (e as Error).message));
          }
        };

        // Check if metadata is already loaded (readyState >= 1) 
        // or if it's already playable (readyState >= 2)
        if (video.readyState >= 1) {
          console.log("[useCamera] Metadata already loaded (readyState:", video.readyState, ")");
          handleReady();
        } else {
          console.log("[useCamera] Waiting for metadata/canplay events...");
          video.onloadedmetadata = handleReady;
          video.oncanplay = handleReady;
        }
        
        // Timeout safety (increased to 8s for slower devices/mobile)
        setTimeout(() => {
          if (!isResolved) {
            video.onloadedmetadata = null;
            video.oncanplay = null;
            reject(new Error("Camera initialization timeout (Hardware Sync Failed)"));
          }
        }, 8000);
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
