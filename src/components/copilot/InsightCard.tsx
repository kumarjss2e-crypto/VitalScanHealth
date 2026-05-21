"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Zap, AlertCircle, CheckCircle2 } from "lucide-react";
import { WellnessInsight } from "@/types/ai";

const InsightCard = ({ insight }: { insight: WellnessInsight }) => {
  const icons = {
    trend: <TrendingUp className="text-blue-400" />,
    recommendation: <Zap className="text-purple-400" />,
    alert: <AlertCircle className="text-red-400" />,
    summary: <CheckCircle2 className="text-emerald-400" />,
  };

  const priorityColors = {
    low: "bg-blue-500/10 border-blue-500/20",
    medium: "bg-purple-500/10 border-purple-500/20",
    high: "bg-red-500/10 border-red-500/20",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="h-full"
    >
      <Card className={`h-full p-5 bg-black/40 border-white/10 backdrop-blur-xl flex flex-col gap-4 relative overflow-hidden group`}>
        <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${insight.priority === 'high' ? 'from-red-500' : 'from-blue-500'} to-transparent opacity-50`} />
        
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
            {icons[insight.type]}
          </div>
          <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${priorityColors[insight.priority]}`}>
            {insight.priority}
          </span>
        </div>

        <div>
          <h4 className="text-white font-bold mb-1">{insight.title}</h4>
          <p className="text-white/50 text-xs leading-relaxed">
            {insight.description}
          </p>
        </div>

        {insight.value && (
          <div className="mt-auto pt-4 border-t border-white/5 flex items-end justify-between">
            <div className="text-2xl font-black text-white">{insight.value}</div>
            {insight.change && (
              <div className={`flex items-center text-xs font-bold ${insight.change > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {insight.change > 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                {Math.abs(insight.change)}%
              </div>
            )}
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default InsightCard;
