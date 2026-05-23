"use client";

import React, { useState, useEffect } from "react";
import { Brain, Zap, Activity } from "lucide-react";
import ChatInterface from "@/components/copilot/ChatInterface";
import InsightCard from "@/components/copilot/InsightCard";
import { WellnessInsight, ChatMessage } from "@/types/ai";
import { useAsyncAction } from "@/hooks/useAsyncAction";
import { useMounted } from "@/hooks/useMounted";

const CopilotPage = () => {
  const mounted = useMounted();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
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
      await new Promise((r) => setTimeout(r, 1500));
      
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I've reviewed your stress patterns for this week. Your stress was highest on Tuesday during your afternoon scan, but it has since stabilized. I recommend a 5-minute breathing session tonight to maintain this positive trend.",
        timestamp: new Date().toISOString(),
      };
      
      setMessages((prev) => [...prev, aiMsg]);
    }
  );

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    const textToSend = input;
    setInput("");
    await sendMessage(textToSend);
  };

  if (!mounted) return null;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Brain className="w-8 h-8 text-blue-500" />
          AI Wellness Copilot
        </h1>
        <p className="text-zinc-400">Your personal AI assistant for wellness insights and recommendations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Chat Area */}
        <div className="lg:col-span-8 h-[700px] flex flex-col bg-zinc-900/50 border border-zinc-800 rounded-3xl overflow-hidden backdrop-blur-xl">
          <ChatInterface 
            messages={messages}
            input={input}
            onInputChange={(e) => setInput(e.target.value)}
            onSend={handleSend}
            isLoading={isLoading}
          />
        </div>

        {/* Sidebar Area */}
        <div className="lg:col-span-4 space-y-6">
          <h3 className="text-lg font-semibold flex items-center gap-2 px-1">
            <Zap className="w-5 h-5 text-yellow-500" />
            Live Insights
          </h3>
          <div className="space-y-4">
            {insights.map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>

          <div className="p-6 rounded-3xl bg-blue-600/5 border border-blue-500/10 space-y-4">
            <div className="flex items-center gap-3 text-blue-400">
              <Activity className="w-5 h-5" />
              <h4 className="font-semibold">Context Awareness</h4>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed">
              I'm using data from your last 5 scans and your health profile to provide personalized advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CopilotPage;
