"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Particle {
  id: number;
  x: string;
  y: string;
  duration: number;
  delay: number;
  size: number;
}

export function BackgroundEffects() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: `${Math.random() * 100}%`,
      y: `${Math.random() * 100}%`,
      duration: Math.random() * 20 + 20,
      delay: Math.random() * -20,
      size: Math.random() * 2 + 1,
    }));
    setParticles(newParticles);
  }, []);

  if (particles.length === 0) return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none">
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[150px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 blur-[150px] rounded-full" />
    </div>
  );

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none">
      {/* Primary Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[150px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 blur-[150px] rounded-full" />
      
      {/* Animated Particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: p.x, y: "110%", opacity: 0 }}
          animate={{ 
            y: "-10%",
            opacity: [0, 0.4, 0]
          }}
          transition={{ 
            duration: p.duration, 
            repeat: Infinity, 
            ease: "linear",
            delay: p.delay
          }}
          style={{
            width: p.size,
            height: p.size,
            left: p.x,
          }}
          className="absolute bg-white/20 rounded-full"
        />
      ))}
    </div>
  );
}
