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
    setStatus("idle");
    setError(null);
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

      // 2. Hardware-UI Sync
      return new Promise<MediaStream | null>((resolve) => {
        let resolved = false;

        const handleReady = async () => {
          if (resolved || !mountedRef.current) return;
          console.log("[useCamera] Video ready state met, attempting playback...");
          
          try {
            const video = videoRef.current;
            if (!video) throw new Error("Video element disappeared");
            
            await video.play();
            console.log("[useCamera] Playback started successfully");
            
            resolved = true;
            setStatus("ready");
            initializationLock.current = false;
            resolve(newStream);
          } catch (e) {
            console.error("[useCamera] Playback failed:", e);
            setError({ type: "PLAYBACK_FAILED", message: "Failed to start video playback. Please ensure your camera is not being used by another app." });
            setStatus("error");
            initializationLock.current = false;
            resolve(null);
          }
        };

        const video = videoRef.current;
        if (!video) {
          console.error("[useCamera] Critical: Video ref is null after permission granted");
          setError({ type: "UNKNOWN", message: "Video preview element not found. Please refresh." });
          setStatus("error");
          initializationLock.current = false;
          resolve(null);
          return;
        }

        console.log("[useCamera] Attaching stream to video.srcObject");
        video.srcObject = newStream;
        
        // Forced attributes for cross-browser mobile compatibility
        video.setAttribute("playsinline", "true");
        video.setAttribute("autoplay", "true");
        video.muted = true;

        if (video.readyState >= 2) {
          console.log("[useCamera] Video already has enough data (readyState >= 2)");
          handleReady();
        } else {
          console.log("[useCamera] Waiting for metadata/canplay events...");
          video.onloadedmetadata = () => {
            console.log("[useCamera] onloadedmetadata fired");
            handleReady();
          };
          video.oncanplay = () => {
            console.log("[useCamera] oncanplay fired");
            handleReady();
          };
        }

        // Safety timeout
        setTimeout(() => {
          if (!resolved && mountedRef.current) {
            console.error("[useCamera] Initialization timed out after 8s");
            setError({ type: "UNKNOWN", message: "Camera initialization timed out. Please try again." });
            setStatus("error");
            initializationLock.current = false;
            stopCamera();
            resolve(null);
          }
        }, 8000);
      });

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
  }, [stopCamera]);

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

