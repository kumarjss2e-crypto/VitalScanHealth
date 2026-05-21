"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-br from-blue-600 to-purple-700 rounded-[3rem] p-12 md:p-20 overflow-hidden text-center shadow-2xl"
        >
          {/* Decorative Orbs */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-black/20 blur-[80px] rounded-full translate-x-1/2 translate-y-1/2" />
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
              Ready to see your <br /> health in a new light?
            </h2>
            <p className="text-white/80 text-lg md:text-xl mb-12 max-w-2xl mx-auto">
              Join thousands of users who are already tracking their vitals with 
              the power of AI. No hardware required.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-white/90 rounded-full px-10 py-7 text-lg font-bold shadow-xl">
                Get Started Free
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10 rounded-full px-10 py-7 text-lg font-bold">
                Contact Sales
              </Button>
            </div>
            
            <p className="mt-10 text-white/50 text-sm font-medium">
              Available on iOS, Android, and Web
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
