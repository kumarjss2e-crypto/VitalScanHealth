"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Activity, Brain, ShieldCheck, RotateCcw, LayoutDashboard, Lock, Zap } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { PlanLimits } from "@/lib/subscription-limits";
import { cn } from "@/lib/utils";
import { ResultData } from "@/types/scan";

interface ResultsScreenProps {
  data: ResultData;
  onReset: () => void;
  limits: PlanLimits;
}

export function ResultsScreen({ data, onReset, limits }: ResultsScreenProps) {
  const router = useRouter();
  const supabase = createClient();

  const handleDashboardRedirect = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  };

  const cards = [
    {
      title: "Heart Rate",
      value: data.heartRate,
      unit: "BPM",
      icon: <Heart className="w-5 h-5 text-red-500" />,
      color: "from-red-500/10 to-transparent",
      locked: false
    },
    {
      title: "Oxygen (SpO2)",
      value: data.spo2,
      unit: "%",
      icon: <Activity className="w-5 h-5 text-blue-400" />,
      color: "from-blue-500/10 to-transparent",
      locked: false
    },
    {
      title: "Stress Level",
      value: data.stress,
      unit: "",
      icon: <Zap className="text-yellow-500 w-5 h-5" />,
      color: "from-yellow-500/10 to-transparent",
      locked: !limits.features.advancedVitals
    },
    {
      title: "HRV Index",
      value: data.hrv,
      unit: "ms",
      icon: <Brain className="text-purple-400 w-5 h-5" />,
      color: "from-purple-500/10 to-transparent",
      locked: !limits.features.advancedVitals
    },
    {
      title: "Blood Pressure",
      value: data.bloodPressure ? `${data.bloodPressure.systolic}/${data.bloodPressure.diastolic}` : '--',
      unit: "mmHg",
      icon: <ShieldCheck className="text-emerald-400 w-5 h-5" />,
      color: "from-emerald-500/10 to-transparent",
      locked: !limits.features.advancedVitals
    },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 py-8">
      <div className="text-center space-y-4">
        <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
          Scan <span className="text-primary">Complete.</span>
        </h2>
        <p className="text-muted-foreground text-sm uppercase tracking-widest font-bold">
          Your personalized wellness report is ready
        </p>
      </div>

      <Card className="bg-card border-border p-8 rounded-[2.5rem] relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple-600/10 opacity-50" />
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.3em] mb-4">
            Overall Wellness Score
          </div>
          <div className="text-8xl font-black text-foreground mb-6 tabular-nums">
            {data.wellnessScore}
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-4">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${data.wellnessScore}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="h-full bg-primary"
            />
          </div>
          <p className="text-emerald-500 text-xs font-bold uppercase tracking-wider">
            Within Optimal Range
          </p>
        </div>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {cards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
            className={cn(card.title === "Blood Pressure" && "col-span-2 md:col-span-1")}
          >
            <Card className="bg-card border-border p-6 rounded-3xl relative overflow-hidden hover:bg-muted/50 transition-colors group h-full">
              <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
              <div className="relative z-10 flex flex-col gap-4">
                <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center">
                  {card.icon}
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">{card.title}</div>
                  {card.locked ? (
                    <div className="flex items-center gap-2 group/lock">
                      <div className="blur-[4px] select-none text-xl font-bold">888</div>
                      <Link href="/billing" className="flex items-center gap-1 text-[10px] text-primary font-black uppercase tracking-tighter hover:underline">
                        <Lock className="w-3 h-3" /> Upgrade
                      </Link>
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-foreground">{card.value}</span>
                      <span className="text-xs text-muted-foreground font-medium">{card.unit}</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-6">
        <Button 
          variant="default" 
          className="w-full md:w-auto rounded-2xl px-8 py-6 text-sm font-bold shadow-lg h-auto bg-primary text-primary-foreground hover:bg-primary/90" 
          onClick={handleDashboardRedirect}
        >
          <LayoutDashboard className="mr-2 w-4 h-4" /> Go to Dashboard
        </Button>
        <Button 
          variant="outline" 
          onClick={onReset}
          className="w-full md:w-auto rounded-2xl px-8 py-6 border-border bg-background hover:bg-muted text-foreground font-bold text-sm h-auto"
        >
          <RotateCcw className="w-4 h-4 mr-2" /> New Scan
        </Button>
      </div>
    </div>
  );
}
