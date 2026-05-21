"use client";

import React from "react";
import { motion } from "framer-motion";

interface ScanOverlayProps {
  status: "aligning" | "scanning" | "processing";
  progress: number;
}

const ScanOverlay = ({ status, progress }: ScanOverlayProps) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {/* Face Alignment Frame */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{
            borderColor: status === "scanning" ? "rgba(34, 197, 94, 0.5)" : "rgba(59, 130, 246, 0.5)",
            scale: status === "scanning" ? [1, 1.02, 1] : 1,
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-[280px] h-[380px] md:w-[320px] md:h-[420px] border-2 border-dashed rounded-[100px] relative"
        >
          {/* Corner Accents */}
          <div className="absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-2xl" />
          <div className="absolute -top-2 -right-2 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-2xl" />
          <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-2xl" />
          <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-2xl" />

          {/* Scanning Line */}
          {status === "scanning" && (
            <motion.div
              initial={{ top: "0%" }}
              animate={{ top: "100%" }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_rgba(52,211,153,0.8)]"
            />
          )}
        </motion.div>
      </div>

      {/* Progress Ring */}
      {status === "scanning" && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
          <div className="relative w-20 h-20">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="36"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                className="text-white/10"
              />
              <motion.circle
                cx="40"
                cy="40"
                r="36"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeDasharray="226.2"
                animate={{ strokeDashoffset: 226.2 - (226.2 * progress) / 100 }}
                className="text-emerald-500"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-white">{Math.round(progress)}%</span>
            </div>
          </div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400 animate-pulse">
            Analyzing Vitals...
          </span>
        </div>
      )}

      {/* Alignment Instructions */}
      {status === "aligning" && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center">
          <p className="text-white text-lg font-medium mb-2">Position your face in the frame</p>
          <p className="text-white/50 text-sm">Ensure good lighting for best results</p>
        </div>
      )}

      {/* Processing State */}
      {status === "processing" && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center z-30">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full mb-6"
          />
          <h3 className="text-2xl font-bold text-white mb-2">Processing Data</h3>
          <p className="text-white/50 text-sm">AI is calculating your wellness metrics...</p>
        </div>
      )}
    </div>
  );
};

export default ScanOverlay;
