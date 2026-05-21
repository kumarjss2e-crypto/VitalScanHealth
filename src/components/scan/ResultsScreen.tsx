"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Activity, Brain, ShieldCheck, RotateCcw, ArrowRight } from "lucide-react";
import Link from "next/link";

interface ResultData {
  heartRate: number;
  spo2: number;
  stress: string;
  wellnessScore: number;
}

export function ResultsScreen({ data, onReset }: { data: ResultData; onReset: () => void }) {
  const cards = [
    {
      title: "Heart Rate",
      value: data.heartRate,
      unit: "BPM",
      icon: <Heart className="w-5 h-5 text-red-500" />,
      color: "from-red-500/10 to-transparent",
    },
    {
      title: "Oxygen (SpO2)",
      value: data.spo2,
      unit: "%",
      icon: <Activity className="w-5 h-5 text-blue-400" />,
      color: "from-blue-500/10 to-transparent",
    },
    {
      title: "Stress Level",
      value: data.stress,
      unit: "",
      icon: <Brain className="text-purple-400 w-5 h-5" />,
      color: "from-purple-500/10 to-transparent",
    },
    {
      title: "AI Confidence",
      value: 94,
      unit: "%",
      icon: <ShieldCheck className="text-emerald-400 w-5 h-5" />,
      color: "from-emerald-500/10 to-transparent",
    },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-4">
        <h2 className="text-4xl md:text-5xl font-black tracking-tight">
          Scan <span className="text-gradient">Complete.</span>
        </h2>
        <p className="text-white/40 text-sm uppercase tracking-widest font-bold">
          Your personalized wellness report is ready
        </p>
      </div>

      <Card className="bg-white/5 border-white/10 p-8 rounded-[2.5rem] relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 opacity-50" />
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="text-[10px] text-white/40 uppercase font-black tracking-[0.3em] mb-4">
            Overall Wellness Score
          </div>
          <div className="text-8xl font-black text-white mb-6 tabular-nums">
            {data.wellnessScore}
          </div>
          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mb-4">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${data.wellnessScore}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
            />
          </div>
          <p className="text-emerald-400 text-xs font-bold uppercase tracking-wider">
            Within Optimal Range
          </p>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        {cards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
          >
            <Card className="bg-white/5 border-white/10 p-6 rounded-3xl relative overflow-hidden hover:bg-white/[0.08] transition-colors group">
              <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
              <div className="relative z-10 flex flex-col gap-4">
                <div className="w-10 h-10 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center">
                  {card.icon}
                </div>
                <div>
                  <div className="text-[10px] text-white/40 uppercase font-bold tracking-widest mb-1">{card.title}</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold">{card.value}</span>
                    <span className="text-xs text-white/30 font-medium">{card.unit}</span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Button variant="premium" className="flex-1 rounded-full py-8 text-lg font-bold shadow-xl" asChild>
          <Link href="/copilot">
            Chat with AI Copilot <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </Button>
        <Button 
          variant="outline" 
          onClick={onReset}
          className="rounded-full py-8 px-8 border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold"
        >
          <RotateCcw className="w-5 h-5 mr-2" /> New Scan
        </Button>
      </div>
    </div>
  );
}
