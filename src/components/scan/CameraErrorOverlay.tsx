"use client";

import React from "react";
import { motion } from "framer-motion";
import { AlertCircle, RotateCcw, ShieldAlert, CameraOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CameraError } from "@/hooks/useCamera";

interface CameraErrorOverlayProps {
  error: CameraError;
  onRetry: () => void;
}

const CameraErrorOverlay = ({ error, onRetry }: CameraErrorOverlayProps) => {
  const getIcon = () => {
    switch (error.type) {
      case "PERMISSION_DENIED": return <ShieldAlert className="w-12 h-12 text-red-500" />;
      case "NO_DEVICE": return <CameraOff className="w-12 h-12 text-orange-500" />;
      default: return <AlertCircle className="w-12 h-12 text-red-500" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-8 text-center"
    >
      <div className="max-w-sm space-y-6">
        <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
          {getIcon()}
        </div>
        
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Camera Issue Detected</h3>
          <p className="text-white/60 text-sm leading-relaxed">
            {error.message}
          </p>
        </div>

        <Button 
          variant="outline" 
          onClick={onRetry}
          className="w-full rounded-xl gap-2 border-white/10 hover:bg-white/10 text-white"
        >
          <RotateCcw className="w-4 h-4" /> Try Again
        </Button>

        {error.type === "PERMISSION_DENIED" && (
          <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest">
            Check your site settings in the browser address bar
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default CameraErrorOverlay;
