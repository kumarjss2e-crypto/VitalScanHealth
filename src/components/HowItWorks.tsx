"use client";

import React from "react";
import { motion } from "framer-motion";
import { Camera, Cpu, ShieldCheck } from "lucide-react";

const steps = [
  {
    icon: <Camera className="w-8 h-8 text-blue-400" />,
    title: "1. Scan",
    description: "Look into your device's camera for 30 seconds. No physical contact required.",
  },
  {
    icon: <Cpu className="w-8 h-8 text-purple-400" />,
    title: "2. Analyze",
    description: "AI algorithms detect micro-color changes in your skin indicating blood flow.",
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-green-400" />,
    title: "3. Results",
    description: "Receive instant, HIPAA-compliant health metrics and wellness insights.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-32 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-white mb-8"
            >
              The Science of <br />
              <span className="text-gradient">Non-Invasive Tracking.</span>
            </motion.h2>
            
            <div className="space-y-12">
              {steps.map((step, index) => (
                <motion.div 
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="flex gap-6"
                >
                  <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    {step.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-white/50 leading-relaxed max-w-sm">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-square rounded-full border border-white/5 p-8 animate-pulse-slow">
              <div className="h-full w-full rounded-full border border-white/10 p-8">
                <div className="h-full w-full rounded-full bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-3xl flex items-center justify-center">
                   <div className="text-center p-12">
                      <div className="text-6xl font-black text-white/10 mb-4">AI</div>
                      <p className="text-white/60 font-medium">Remote Photoplethysmography (rPPG)</p>
                   </div>
                </div>
              </div>
            </div>
            
            {/* Floating Orbs */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-[60px] rounded-full animate-float" />
            <div className="absolute bottom-10 left-0 w-40 h-40 bg-purple-500/20 blur-[80px] rounded-full animate-float" style={{ animationDelay: "2s" }} />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
