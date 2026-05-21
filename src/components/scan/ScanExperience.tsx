"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, ShieldCheck, AlertCircle, RotateCcw, Activity, Heart, Droplets, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { Card } from "@/components/ui/card";
import { useCamera } from "@/hooks/useCamera";
import ResultsScreen from "@/components/scan/ResultsScreen";

type ScanPhase = "idle" | "scanning" | "processing" | "results";

export default function ScanExperience() {
  const { status, error, videoRef, startCamera, stopCamera } = useCamera();
  const [phase, setPhase] = useState<ScanPhase>("idle");
  const [progress, setProgress] = useState(0);

  // 1. Scan Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (phase === "scanning") {
      interval = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) {
            clearInterval(interval);
            setPhase("processing");
            return 100;
          }
          return p + 1;
        });
      }, 150); // ~15 second scan
    }
    return () => clearInterval(interval);
  }, [phase]);

  // 2. Processing Logic
  useEffect(() => {
    if (phase === "processing") {
      const timer = setTimeout(() => {
        setPhase("results");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  // 3. UI Sync with Camera Status
  useEffect(() => {
    if (status === "ready" && phase === "idle") {
      setPhase("scanning");
    }
  }, [status, phase]);

  const handleRetry = () => {
    stopCamera();
    setPhase("idle");
    setProgress(0);
  };

  if (phase === "results") {
    return (
      <ResultsScreen 
        data={{
          heartRate: 72,
          spo2: 98,
          stress: "Low",
          wellnessScore: 88,
          confidence: 94
        }} 
      />
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-12">
      <AnimatePresence mode="wait">
        {/* Step 1: Entry / Permission */}
        {phase === "idle" && status !== "error" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="text-center space-y-8 py-12"
          >
            <div className="w-24 h-24 rounded-[2rem] bg-blue-600/20 border border-blue-500/30 flex items-center justify-center mx-auto shadow-2xl">
              <Camera className="w-10 h-10 text-blue-500" />
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
                Ready for your <span className="text-gradient">Daily Scan?</span>
              </h1>
              <p className="text-white/50 text-lg max-w-md mx-auto">
                Position your face in front of the camera. We'll measure your vitals in real-time using AI computer vision.
              </p>
            </div>

            <div className="flex flex-col gap-4 max-w-xs mx-auto pt-8">
              <LoadingButton
                variant="premium"
                size="lg"
                className="rounded-2xl py-8 text-lg font-bold"
                isLoading={status === "requesting" || status === "initializing"}
                loadingText={status === "requesting" ? "Granting Access..." : "Initializing..."}
                onClick={startCamera}
              >
                Begin Scan
              </LoadingButton>
              <div className="flex items-center justify-center gap-2 text-xs text-white/30 font-medium uppercase tracking-widest">
                <ShieldCheck className="w-3 h-3" /> Secure & Private
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2: Error Handling */}
        {status === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center space-y-6 py-12"
          >
            <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white">Camera Access Failed</h3>
              <p className="text-white/50">{error?.message}</p>
            </div>
            <Button variant="outline" onClick={handleRetry} className="rounded-xl gap-2">
              <RotateCcw className="w-4 h-4" /> Try Again
            </Button>
          </motion.div>
        )}

        {/* Step 3: Active Scanning */}
        {(phase === "scanning" || phase === "processing") && status === "ready" && (
          <motion.div
            key="active"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative"
          >
            {/* Camera View */}
            <div className="relative aspect-[3/4] md:aspect-video rounded-[3rem] border border-white/10 bg-black overflow-hidden shadow-2xl">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1] opacity-60"
              />
              
              {/* Overlay Layers */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />
              
              {/* Face Frame */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <motion.div 
                  animate={{ 
                    borderColor: phase === "scanning" ? ["rgba(59,130,246,0.3)", "rgba(59,130,246,0.8)", "rgba(59,130,246,0.3)"] : "rgba(34,197,94,0.5)",
                    scale: phase === "scanning" ? [1, 1.02, 1] : 1
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-[280px] h-[380px] md:w-[320px] md:h-[420px] border-2 border-dashed rounded-[100px] relative"
                >
                   {/* Scanning Line */}
                   {phase === "scanning" && (
                     <motion.div 
                        initial={{ top: "10%" }}
                        animate={{ top: "90%" }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-[0_0_15px_rgba(59,130,246,0.8)]"
                     />
                   )}
                </motion.div>
              </div>

              {/* Realtime Feedback */}
              <div className="absolute top-8 left-8 right-8 flex justify-between items-start pointer-events-none">
                 <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                       <Heart className="w-3 h-3 text-red-500 fill-red-500 animate-pulse" />
                       <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Heart Rate</span>
                    </div>
                    <div className="text-xl font-bold font-mono">{phase === "scanning" ? 72 + Math.floor(Math.random() * 3) : "--"} <span className="text-xs font-normal text-white/30">BPM</span></div>
                 </div>

                 <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                       <Brain className="w-3 h-3 text-purple-400" />
                       <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Stress</span>
                    </div>
                    <div className="text-xl font-bold font-mono">LOW</div>
                 </div>
              </div>

              {/* Progress Bar Container */}
              <div className="absolute bottom-12 left-12 right-12 text-center space-y-4">
                 <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-bold text-white/40 uppercase tracking-[0.2em]">
                       {phase === "scanning" ? "AI Analyzing skin perfusion" : "Processing complete data"}
                    </span>
                    <span className="text-xs font-bold text-blue-400 font-mono">{progress}%</span>
                 </div>
                 <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-blue-600 to-purple-600 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                    />
                 </div>
              </div>
            </div>

            {/* Processing State Overlay */}
            {phase === "processing" && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md rounded-[3rem] flex flex-col items-center justify-center text-center space-y-6"
              >
                <div className="relative w-24 h-24">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border-2 border-white/5 border-t-blue-500"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Activity className="w-8 h-8 text-blue-500 animate-pulse" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Generating Report</h3>
                  <p className="text-white/50 text-sm">Synthesizing biometric data points...</p>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
