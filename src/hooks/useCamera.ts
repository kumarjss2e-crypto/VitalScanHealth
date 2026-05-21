"use client";

import { useState, useCallback, useRef, useEffect } from "react";

export type CameraStatus = "idle" | "requesting" | "initializing" | "ready" | "error";

export interface CameraError {
  type: "PERMISSION_DENIED" | "NO_DEVICE" | "UNSUPPORTED" | "INSECURE" | "PLAYBACK_FAILED" | "UNKNOWN";
  message: string;
}

export function useCamera() {
  const [status, setStatus] = useState<CameraStatus>("idle");
  const [error, setError] = useState<CameraError | null>(null);
  
  // Persistence Refs
  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const initializationLock = useRef<boolean>(false);
  const mountedRef = useRef<boolean>(false);
  const retryCount = useRef<number>(0);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const stopCamera = useCallback(() => {
    console.log("[useCamera] Stopping camera and cleaning up...");
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        console.log(`[useCamera] Stopping track: ${track.kind}`);
        track.stop();
        track.enabled = false;
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    initializationLock.current = false;
    retryCount.current = 0;
    setStatus("idle");
    setError(null);
  }, []);

  const attachStreamToVideo = useCallback(async (stream: MediaStream): Promise<boolean> => {
    const maxRetries = 10; // 10 frames = ~160ms
    
    for (let i = 0; i < maxRetries; i++) {
      if (!mountedRef.current) return false;
      
      const video = videoRef.current;
      if (video) {
        console.log(`[useCamera] Video ref found on attempt ${i + 1}. Attaching stream.`);
        video.srcObject = stream;
        video.setAttribute("playsinline", "true");
        video.setAttribute("autoplay", "true");
        video.muted = true;
        
        return new Promise((resolve) => {
          const onReady = async () => {
            try {
              console.log("[useCamera] Video ready, attempting play()");
              await video.play();
              console.log("[useCamera] Playback started successfully");
              resolve(true);
            } catch (e) {
              console.error("[useCamera] play() failed:", e);
              resolve(false);
            }
          };

          if (video.readyState >= 2) {
            onReady();
          } else {
            video.onloadedmetadata = onReady;
            video.oncanplay = onReady;
          }
        });
      }
      
      console.log(`[useCamera] Video ref null on attempt ${i + 1}, waiting for next frame...`);
      await new Promise(resolve => requestAnimationFrame(resolve));
    }
    
    console.error("[useCamera] Failed to find video ref after max retries");
    return false;
  }, []);

  const startCamera = useCallback(async () => {
    if (initializationLock.current) {
      console.log("[useCamera] Initialization already in progress, skipping...");
      return;
    }

    console.log("[useCamera] --- Starting Camera Flow ---");
    initializationLock.current = true;
    setStatus("requesting");
    setError(null);

    // 1. Environment Validation
    if (typeof window === "undefined") return;
    
    const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    if (!window.isSecureContext && !isLocalhost) {
      console.error("[useCamera] Insecure context detected");
      setError({ type: "INSECURE", message: "Camera requires a secure HTTPS connection." });
      setStatus("error");
      initializationLock.current = false;
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      console.error("[useCamera] getUserMedia not supported in this browser");
      setError({ type: "UNSUPPORTED", message: "Your browser does not support camera access." });
      setStatus("error");
      initializationLock.current = false;
      return;
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        },
        audio: false
      };

      console.log("[useCamera] Requesting MediaStream with constraints:", constraints);
      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (!mountedRef.current) {
        console.warn("[useCamera] Component unmounted during permission request, cleaning up...");
        newStream.getTracks().forEach(t => t.stop());
        return;
      }

      console.log("[useCamera] MediaStream received:", newStream.id);
      streamRef.current = newStream;
      setStatus("initializing");

      // 2. Hardware-UI Sync with Retry Logic
      const success = await attachStreamToVideo(newStream);
      
      if (success && mountedRef.current) {
        setStatus("ready");
      } else if (mountedRef.current) {
        console.error("[useCamera] Critical: Failed to attach stream or play video");
        setError({ 
          type: "PLAYBACK_FAILED", 
          message: "Failed to initialize video preview. Please ensure the video element is visible and try again." 
        });
        setStatus("error");
        stopCamera();
      }
      
      initializationLock.current = false;
      return success ? newStream : null;

    } catch (err: any) {
      console.error("[useCamera] Error in startCamera flow:", err);
      let type: CameraError["type"] = "UNKNOWN";
      let message = `Error: ${err.message || "An unexpected error occurred."}`;

      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        type = "PERMISSION_DENIED";
        message = "Camera access was denied. Please check your browser settings.";
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        type = "NO_DEVICE";
        message = "No camera was found on this device.";
      }

      setError({ type, message });
      setStatus("error");
      initializationLock.current = false;
      return null;
    }
  }, [stopCamera, attachStreamToVideo]);

  useEffect(() => {
    return () => {
      console.log("[useCamera] Hook unmounting, performing final cleanup");
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  return {
    status,
    error,
    videoRef,
    startCamera,
    stopCamera
  };
}

