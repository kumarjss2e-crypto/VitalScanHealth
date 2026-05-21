"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Play, ArrowRight, Zap } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden px-6">
      {/* Background Decorative Elements */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full -z-10" />
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-6"
          >
            <Zap className="w-3 h-3 fill-current" />
            AI Computer Vision v2.0
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
            Medical-grade vitals, <br />
            <span className="text-gradient">zero contact.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/60 mb-10 max-w-lg leading-relaxed">
            Monitor your heart rate, blood pressure, and wellness analytics 
            instantly using your smartphone camera. Experience the future of 
            preventative health.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="premium" size="lg" className="rounded-full gap-2 group" asChild>
              <Link href="/scan">
                Start Your Scan <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="rounded-full gap-2 bg-white/5 border-white/10 hover:bg-white/10 text-white">
              <Play className="w-4 h-4 fill-current" /> View Demo
            </Button>
          </div>
          
          <div className="mt-12 flex items-center gap-6">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#020617] bg-gray-800" />
              ))}
            </div>
            <p className="text-sm text-white/40 italic">
              Trusted by <span className="text-white font-medium">10,000+</span> wellness pioneers
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="relative group"
        >
          {/* Camera Scan Simulation Container */}
          <div className="relative aspect-[4/5] md:aspect-square w-full max-w-[500px] mx-auto rounded-[2.5rem] border border-white/10 bg-black/40 backdrop-blur-3xl p-4 shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
            
            {/* Camera Frame */}
            <div className="relative h-full w-full rounded-[2rem] overflow-hidden border border-white/5 bg-gray-900 flex items-center justify-center">
                {/* Simulated Face Outline */}
                <div className="absolute inset-0 flex items-center justify-center opacity-40">
                    <div className="w-64 h-80 border-2 border-dashed border-blue-400/50 rounded-full" />
                </div>

                {/* Scan Line Animation */}
                <div className="animate-scan-line z-10" />

                {/* Floating Metric Bubbles */}
                <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute top-10 right-10 bg-black/60 backdrop-blur-md border border-white/10 p-3 rounded-2xl flex flex-col items-center min-w-[80px]"
                >
                    <span className="text-[10px] text-white/50 uppercase font-bold tracking-tighter">BPM</span>
                    <span className="text-2xl font-bold text-red-500">72</span>
                    <div className="w-full h-1 bg-red-500/20 rounded-full mt-2 overflow-hidden">
                        <motion.div 
                            animate={{ width: ["20%", "80%", "40%"] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="h-full bg-red-500" 
                        />
                    </div>
                </motion.div>

                <motion.div 
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute bottom-10 left-10 bg-black/60 backdrop-blur-md border border-white/10 p-3 rounded-2xl flex flex-col items-center min-w-[80px]"
                >
                    <span className="text-[10px] text-white/50 uppercase font-bold tracking-tighter">SpO2</span>
                    <span className="text-2xl font-bold text-blue-400">98%</span>
                </motion.div>

                <div className="text-white/20 flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full border-2 border-white/10 flex items-center justify-center">
                        <ShieldCheck className="w-8 h-8 opacity-20" />
                    </div>
                    <p className="text-sm font-medium">Scanning Face...</p>
                </div>
            </div>

            {/* Glowing Corner Accents */}
            <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-blue-500/30 rounded-tl-[2.5rem]" />
            <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-purple-500/30 rounded-br-[2.5rem]" />
          </div>

          {/* Floating Glass Cards */}
          <motion.div
            animate={{ x: [0, 15, 0], y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute -right-12 top-1/4 hidden xl:block glass-dark p-4 rounded-2xl border-white/10 shadow-2xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              </div>
              <div>
                <p className="text-[10px] text-white/40 font-bold uppercase">Status</p>
                <p className="text-sm text-white font-medium">Calibrated</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
