"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, EyeOff, FileText } from "lucide-react";
import { ClientOnly } from "@/components/ClientOnly";

const Security = () => {
  return (
    <section id="privacy" className="py-32 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-8">
              <ShieldCheck className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-6">
              Your Privacy is our <br />
              <span className="text-gradient">Highest Priority.</span>
            </h2>
            <p className="text-white/50 text-lg mb-10 leading-relaxed">
              We never store your video data. All AI processing happens in real-time 
              and is encrypted with enterprise-grade protocols. HIPAA compliant 
              and GDPR ready.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="flex gap-4">
                <Lock className="w-6 h-6 text-blue-400 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-bold mb-1">End-to-End Encryption</h4>
                  <p className="text-white/40 text-sm">AES-256 bit encryption for all data.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <EyeOff className="w-6 h-6 text-purple-400 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-bold mb-1">No Video Storage</h4>
                  <p className="text-white/40 text-sm">Frames are discarded immediately.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <FileText className="w-6 h-6 text-cyan-400 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-bold mb-1">HIPAA Compliant</h4>
                  <p className="text-white/40 text-sm">Meeting strict medical standards.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <ShieldCheck className="w-6 h-6 text-green-400 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-bold mb-1">GDPR Certified</h4>
                  <p className="text-white/40 text-sm">Full control over your data.</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
             <div className="aspect-video rounded-[2rem] bg-gradient-to-br from-gray-900 to-black border border-white/10 p-8 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                <motion.div 
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="w-32 h-32 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center relative z-10"
                >
                  <Lock className="w-12 h-12 text-blue-500" />
                </motion.div>
                
                {/* Simulated Data Packets */}
                <ClientOnly>
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ 
                        x: [0, (i % 2 === 0 ? 1 : -1) * (50 + i * 20)], 
                        y: [0, (i % 3 === 0 ? 1 : -1) * (50 + i * 20)],
                        opacity: [0, 1, 0]
                      }}
                      transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                      className="absolute w-1 h-1 bg-blue-400 rounded-full"
                    />
                  ))}
                </ClientOnly>
             </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Security;
