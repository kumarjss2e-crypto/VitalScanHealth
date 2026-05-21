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
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
        track.enabled = false;
      });
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setStatus("idle");
    setError(null);
  }, [stream]);

  const startCamera = useCallback(async () => {
    if (status === "requesting" || status === "initializing") return;

    setStatus("requesting");
    setError(null);

    // 1. Environment Validation
    if (typeof window === "undefined") return;
    
    const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    if (!window.isSecureContext && !isLocalhost) {
      setError({ type: "INSECURE", message: "Camera requires a secure HTTPS connection." });
      setStatus("error");
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setError({ type: "UNSUPPORTED", message: "Your browser does not support camera access." });
      setStatus("error");
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

      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(newStream);
      setStatus("initializing");

      const video = videoRef.current;
      if (!video) throw new Error("Video element not found");

      // 2. Hardware-UI Sync
      return new Promise<MediaStream | null>((resolve) => {
        let resolved = false;

        const handleReady = async () => {
          if (resolved) return;
          try {
            await video.play();
            resolved = true;
            setStatus("ready");
            resolve(newStream);
          } catch (e) {
            console.error("Playback failed", e);
            setError({ type: "PLAYBACK_FAILED", message: "Failed to start video playback." });
            setStatus("error");
            resolve(null);
          }
        };

        video.srcObject = newStream;
        
        // Mobile Safari requirements
        video.setAttribute("playsinline", "true");
        video.muted = true;

        if (video.readyState >= 2) {
          handleReady();
        } else {
          video.onloadedmetadata = handleReady;
          video.oncanplay = handleReady;
        }

        setTimeout(() => {
          if (!resolved) {
            setError({ type: "UNKNOWN", message: "Camera initialization timed out." });
            setStatus("error");
            stopCamera();
            resolve(null);
          }
        }, 8000);
      });

    } catch (err: any) {
      let type: CameraError["type"] = "UNKNOWN";
      let message = "An unexpected error occurred.";

      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        type = "PERMISSION_DENIED";
        message = "Camera access was denied.";
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        type = "NO_DEVICE";
        message = "No camera was found.";
      }

      setError({ type, message });
      setStatus("error");
      return null;
    }
  }, [status, stopCamera]);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
      }
    };
  }, [stream]);

  return {
    status,
    error,
    videoRef,
    startCamera,
    stopCamera
  };
}
