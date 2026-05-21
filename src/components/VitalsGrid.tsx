"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Heart, 
  Activity, 
  Droplets, 
  Thermometer, 
  Brain, 
  BarChart3 
} from "lucide-react";
import { Card } from "@/components/ui/card";

const vitals = [
  {
    title: "Heart Rate",
    description: "Real-time BPM tracking with medical-grade precision.",
    icon: <Heart className="w-6 h-6 text-red-500" />,
    color: "from-red-500/20 to-transparent",
    border: "group-hover:border-red-500/50",
  },
  {
    title: "Blood Pressure",
    description: "Systolic and diastolic estimations via rPPG technology.",
    icon: <Activity className="w-6 h-6 text-blue-500" />,
    color: "from-blue-500/20 to-transparent",
    border: "group-hover:border-blue-500/50",
  },
  {
    title: "Oxygen (SpO2)",
    description: "Measure blood oxygen saturation in under 30 seconds.",
    icon: <Droplets className="w-6 h-6 text-cyan-500" />,
    color: "from-cyan-500/20 to-transparent",
    border: "group-hover:border-cyan-500/50",
  },
  {
    title: "Temperature",
    description: "Detect subtle thermal variations through advanced imaging.",
    icon: <Thermometer className="w-6 h-6 text-orange-500" />,
    color: "from-orange-500/20 to-transparent",
    border: "group-hover:border-orange-500/50",
  },
  {
    title: "Stress Level",
    description: "Analyze heart rate variability (HRV) for mental wellness.",
    icon: <Brain className="w-6 h-6 text-purple-500" />,
    color: "from-purple-500/20 to-transparent",
    border: "group-hover:border-purple-500/50",
  },
  {
    title: "Wellness Analytics",
    description: "Deep insights into your long-term health trends.",
    icon: <BarChart3 className="w-6 h-6 text-green-500" />,
    color: "from-green-500/20 to-transparent",
    border: "group-hover:border-green-500/50",
  },
];

const VitalsGrid = () => {
  return (
    <section id="vitals" className="py-24 px-6 bg-black/50 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Track Every <span className="text-gradient">Vital.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-white/50 max-w-2xl mx-auto text-lg"
          >
            Our AI-powered computer vision technology analyzes micro-vibrations 
            and blood flow patterns to provide instant health data.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vitals.map((vital, index) => (
            <motion.div
              key={vital.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`group relative h-full bg-white/5 border-white/10 overflow-hidden hover:bg-white/[0.08] transition-all duration-500 ${vital.border}`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${vital.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className="relative p-8">
                  <div className="w-12 h-12 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                    {vital.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{vital.title}</h3>
                  <p className="text-white/50 leading-relaxed text-sm">
                    {vital.description}
                  </p>
                </div>
                
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/5 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VitalsGrid;
