"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Brain, Sparkles, Activity, Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import ChatInterface from "@/components/copilot/ChatInterface";
import InsightCard from "@/components/copilot/InsightCard";
import { WellnessInsight, ChatMessage } from "@/types/ai";
import { useAsyncAction } from "@/hooks/useAsyncAction";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { useMounted } from "@/hooks/useMounted";

const CopilotPage = () => {
  const mounted = useMounted();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  // Set initial message only after mount to prevent hydration mismatch
  useEffect(() => {
    if (mounted && messages.length === 0) {
      setMessages([
        {
          id: "1",
          role: "assistant",
          content: "Hello! I'm your VitalScan AI Copilot. I've analyzed your recent scans and detected some interesting trends in your recovery and stress levels. How can I help you today?",
          timestamp: new Date().toISOString(),
        }
      ]);
    }
  }, [mounted, messages.length]);

  const [input, setInput] = useState("");
  const inputRef = useRef("");

  useEffect(() => {
    inputRef.current = input;
  }, [input]);

  // Simulated Insights
  const insights: WellnessInsight[] = [
    {
      id: "i1",
      type: "trend",
      title: "Recovery Improving",
      description: "Your heart rate variability (HRV) has increased by 12% over the last 3 days, suggesting better recovery.",
      metric: "HRV",
      value: "64ms",
      change: 12,
      priority: "medium",
    },
    {
      id: "i2",
      type: "recommendation",
      title: "Hydration Focus",
      description: "Minor temperature fluctuations detected. Consider increasing water intake to maintain homeostasis.",
      priority: "low",
    },
    {
      id: "i3",
      type: "summary",
      title: "Weekly Wellness Peak",
      description: "Your wellness score reached an all-time high of 92 today. Keep up the consistent scanning!",
      metric: "Wellness",
      value: 92,
      change: 5,
      priority: "high",
    }
  ];

  const { execute: sendMessage, isLoading } = useAsyncAction(
    async (text: string) => {
      // Simulate API call
      await new Promise((r) => setTimeout(r, 1500));
      
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I've reviewed your stress patterns for this week. Your stress was highest on Tuesday during your afternoon scan, but it has since stabilized. I recommend a 5-minute breathing session tonight to maintain this positive trend.",
        timestamp: new Date().toISOString(),
      };
      
      setMessages((prev) => [...prev, aiMsg]);
    },
    {
      onError: () => setInput(inputRef.current) // Restore input on error
    }
  );

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const text = input;
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    
    await sendMessage(text);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-blue-500/30">
      <BackgroundEffects />

      <header className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-white/70 hover:text-white" asChild>
            <Link href="/"><ArrowLeft /></Link>
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
              <Brain className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">AI Copilot</h1>
              <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Personal Wellness Intelligence</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-medium text-white/60">Data Encrypted</span>
          </div>
          <Button variant="outline" className="rounded-full border-white/10 bg-white/5 hover:bg-white/10 text-white gap-2">
            <Activity className="w-4 h-4" /> View Trends
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Insights & Recommendations */}
          <div className="lg:col-span-5 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2 className="text-3xl font-bold mb-2">Morning <span className="text-gradient">Insights.</span></h2>
              <p className="text-white/50 text-sm mb-8">Generated by analyzing 14 health data points from your last 3 scans.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                {insights.map((insight) => (
                  <InsightCard key={insight.id} insight={insight} />
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-[2rem] bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/10 relative overflow-hidden group"
            >
              <Sparkles className="absolute -right-4 -top-4 w-24 h-24 text-white/5 group-hover:rotate-12 transition-transform duration-700" />
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-400" /> AI Prediction
              </h3>
              <p className="text-white/70 text-sm leading-relaxed mb-6">
                Based on your current recovery rate, we predict a **94% wellness score** tomorrow if you maintain your 8-hour sleep goal tonight.
              </p>
              <Button className="w-full bg-white text-blue-600 hover:bg-white/90 rounded-xl font-bold">
                View Prediction Data
              </Button>
            </motion.div>
          </div>

          {/* Right Column: Chat Assistant */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <ChatInterface 
                messages={messages}
                input={input}
                onInputChange={(e) => setInput(e.target.value)}
                onSend={handleSend}
                isLoading={isLoading}
              />
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CopilotPage;
