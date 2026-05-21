"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { LineChart, ArrowUpRight, ArrowDownRight } from "lucide-react";

const DashboardPreview = () => {
  return (
    <section id="insights" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Enterprise <span className="text-gradient">Health Dashboard.</span></h2>
          <p className="text-white/50 max-w-2xl mx-auto">Comprehensive data visualization for personal and professional wellness management.</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-black/40 border border-white/10 rounded-[2rem] p-4 md:p-8 backdrop-blur-3xl shadow-2xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5" />
          
          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Sidebar Simulation */}
            <div className="lg:col-span-3 hidden lg:flex flex-col gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 rounded-xl bg-white/5 border border-white/5 w-full animate-pulse" />
              ))}
            </div>

            {/* Main Content Simulation */}
            <div className="lg:col-span-9 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-white/5 border-white/10 p-4">
                  <div className="flex justify-between items-start mb-4">
                    <p className="text-xs text-white/40 font-bold uppercase">Avg Heart Rate</p>
                    <ArrowUpRight className="w-4 h-4 text-red-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">68 <span className="text-sm font-normal text-white/40">BPM</span></div>
                  <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 w-[70%]" />
                  </div>
                </Card>

                <Card className="bg-white/5 border-white/10 p-4">
                  <div className="flex justify-between items-start mb-4">
                    <p className="text-xs text-white/40 font-bold uppercase">Sleep Score</p>
                    <ArrowUpRight className="w-4 h-4 text-green-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">92 <span className="text-sm font-normal text-white/40">/ 100</span></div>
                  <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-[92%]" />
                  </div>
                </Card>

                <Card className="bg-white/5 border-white/10 p-4">
                  <div className="flex justify-between items-start mb-4">
                    <p className="text-xs text-white/40 font-bold uppercase">Hydration</p>
                    <ArrowDownRight className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">1.8 <span className="text-sm font-normal text-white/40">Liters</span></div>
                  <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[45%]" />
                  </div>
                </Card>
              </div>

              {/* Chart Simulation */}
              <Card className="bg-white/5 border-white/10 p-6 h-[300px] flex flex-col">
                <div className="flex justify-between items-center mb-8">
                  <h4 className="text-white font-semibold">Weekly Wellness Trend</h4>
                  <div className="flex gap-2">
                    <div className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-bold">RECOVERY</div>
                    <div className="px-3 py-1 rounded-full bg-white/5 text-white/40 text-[10px] font-bold">STRESS</div>
                  </div>
                </div>
                
                <div className="flex-1 flex items-end gap-2 px-2">
                  {[40, 60, 45, 80, 55, 90, 70, 85, 60, 75, 50, 65].map((height, i) => (
                    <motion.div 
                      key={i}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${height}%` }}
                      transition={{ delay: i * 0.05, duration: 1 }}
                      className="flex-1 bg-gradient-to-t from-blue-600/40 to-blue-400/80 rounded-t-sm"
                    />
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DashboardPreview;
