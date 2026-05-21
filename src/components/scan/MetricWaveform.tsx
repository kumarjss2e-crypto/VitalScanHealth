"use client";

import React, { useEffect, useRef } from "react";

const MetricWaveform = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let offset = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "rgba(59, 130, 246, 0.8)";

      for (let x = 0; x < canvas.width; x++) {
        const y = 
          canvas.height / 2 + 
          Math.sin((x + offset) * 0.05) * 10 + 
          Math.sin((x + offset) * 0.02) * 5;
        
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.stroke();
      offset += 2;
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="w-full h-12 bg-black/40 rounded-lg border border-white/5 overflow-hidden">
      <canvas 
        ref={canvasRef} 
        width={300} 
        height={48} 
        className="w-full h-full"
      />
    </div>
  );
};

export default MetricWaveform;
