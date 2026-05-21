"use client";

import React, { useState, useRef, useEffect } from "react";

export default function CameraTestPage() {
  const [status, setStatus] = useState<string>("Idle - Click Enable Camera to start");
  const [error, setError] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Helper to stop all tracks
  const stopTracks = () => {
    console.log("[DEBUG] Stopping all current tracks");
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        console.log(`[DEBUG] Stopping track: ${track.kind} - ${track.label}`);
        track.stop();
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
  };

  const startCamera = async () => {
    console.log("[DEBUG] --- Starting Camera Flow ---");
    setError(null);
    setStatus("Requesting permission...");

    // 1. Check browser context
    const isSecure = window.isSecureContext;
    console.log(`[DEBUG] Secure Context: ${isSecure}`);
    console.log(`[DEBUG] User Agent: ${navigator.userAgent}`);

    if (!isSecure && window.location.hostname !== "localhost") {
      const msg = "Error: Insecure context (requires HTTPS)";
      console.error(`[DEBUG] ${msg}`);
      setError(msg);
      setStatus("Failed");
      return;
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      const msg = "Error: navigator.mediaDevices.getUserMedia not supported";
      console.error(`[DEBUG] ${msg}`);
      setError(msg);
      setStatus("Failed");
      return;
    }

    // 2. Define constraints
    const primaryConstraints: MediaStreamConstraints = {
      video: {
        facingMode: "user",
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: false
    };

    const fallbackConstraints: MediaStreamConstraints = {
      video: true,
      audio: false
    };

    try {
      // 3. Try primary constraints
      console.log("[DEBUG] Requesting getUserMedia with primary constraints:", primaryConstraints);
      let stream: MediaStream;
      
      try {
        stream = await navigator.mediaDevices.getUserMedia(primaryConstraints);
      } catch (primaryError) {
        console.warn("[DEBUG] Primary constraints failed, trying fallback:", primaryError);
        stream = await navigator.mediaDevices.getUserMedia(fallbackConstraints);
      }

      console.log("[DEBUG] Stream received successfully:", stream.id);
      streamRef.current = stream;

      // 4. Attach to video element
      const video = videoRef.current;
      if (!video) {
        throw new Error("Video ref is null");
      }
      console.log("[DEBUG] Attaching stream to video element");
      video.srcObject = stream;

      // 5. Wait for metadata
      setStatus("Initializing video playback...");
      await new Promise<void>((resolve, reject) => {
        video.onloadedmetadata = () => {
          console.log("[DEBUG] Video metadata loaded");
          resolve();
        };
        video.onerror = (e) => {
          console.error("[DEBUG] Video element error:", e);
          reject(new Error("Video element error during loading"));
        };
        // Timeout if metadata never loads
        setTimeout(() => reject(new Error("Metadata load timeout (8s)")), 8000);
      });

      // 6. Play video
      console.log("[DEBUG] Calling video.play()");
      await video.play();
      console.log("[DEBUG] Video playing successfully");
      
      setIsStreaming(true);
      setStatus("Success - Camera streaming");

    } catch (err: any) {
      console.error("[DEBUG] Final Error Catch:", err);
      setError(`${err.name}: ${err.message}`);
      setStatus("Failed");
      stopTracks();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log("[DEBUG] Unmounting - performing cleanup");
      stopTracks();
    };
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif", backgroundColor: "#f0f0f0", minHeight: "100vh" }}>
      <h1>Ultra-Minimal Camera Test</h1>
      
      <div style={{ marginBottom: "20px", padding: "10px", backgroundColor: "#fff", border: "1px solid #ccc" }}>
        <strong>Status:</strong> {status}
      </div>

      {error && (
        <div style={{ marginBottom: "20px", padding: "10px", backgroundColor: "#ffebee", border: "1px solid #f44336", color: "#c62828" }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <div style={{ marginBottom: "20px" }}>
        <button 
          onClick={startCamera} 
          disabled={isStreaming && status === "Success - Camera streaming"}
          style={{ padding: "12px 24px", fontSize: "16px", cursor: "pointer", marginRight: "10px" }}
        >
          Enable Camera
        </button>
        
        <button 
          onClick={() => {
            console.log("[DEBUG] Retry clicked");
            stopTracks();
            startCamera();
          }}
          style={{ padding: "12px 24px", fontSize: "16px", cursor: "pointer" }}
        >
          Retry / Restart
        </button>
      </div>

      <div style={{ 
        width: "100%", 
        maxWidth: "640px", 
        aspectRatio: "16/9", 
        backgroundColor: "#000", 
        position: "relative",
        borderRadius: "8px",
        overflow: "hidden"
      }}>
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        {!isStreaming && (
          <div style={{ 
            position: "absolute", 
            top: "50%", 
            left: "50%", 
            transform: "translate(-50%, -50%)", 
            color: "#fff" 
          }}>
            Video Preview Area
          </div>
        )}
      </div>

      <div style={{ marginTop: "40px" }}>
        <h3>Debugging Instructions:</h3>
        <ul>
          <li>Open Browser Console (F12) to see detailed logs.</li>
          <li>Ensure you are on <strong>HTTPS</strong> or <strong>localhost</strong>.</li>
          <li>Check that no other app is using the camera.</li>
          <li>On iPhone, ensure you are using Safari or Chrome.</li>
        </ul>
      </div>
    </div>
  );
}
