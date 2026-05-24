import React, { useState, useEffect } from "react";
import { Brain, Zap, Activity, Lock } from "lucide-react";
import ChatInterface from "@/components/copilot/ChatInterface";
import InsightCard from "@/components/copilot/InsightCard";
import { WellnessInsight, ChatMessage } from "@/types/ai";
import { useAsyncAction } from "@/hooks/useAsyncAction";
import { useMounted } from "@/hooks/useMounted";
import { createClient } from "@/utils/supabase/client";
import { getSubscriptionStatus } from "@/services/subscription.service";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const CopilotPage = () => {
  const mounted = useMounted();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLocked, setIsLocked] = useState(false);
  const supabase = createClient();
  
  useEffect(() => {
    async function checkAccess() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // We need a client-side version or fetch from an API route
        // For simplicity in this demo, I'll fetch it here
        const { data: subscription } = await supabase
          .from('subscriptions')
          .select('plan_id, status')
          .eq('user_id', user.id)
          .maybeSingle();
        
        const planId = (subscription?.status === 'active' ? subscription.plan_id : 'free') as string;
        if (planId === 'free') {
          setIsLocked(true);
        }
      }
    }
    checkAccess();
  }, [supabase]);

  useEffect(() => {
    if (mounted && messages.length === 0 && !isLocked) {
      setMessages([
        {
          id: "1",
          role: "assistant",
          content: "Hello! I'm your VitalScan AI Copilot. I've analyzed your recent scans and detected some interesting trends in your recovery and stress levels. How can I help you today?",
          timestamp: new Date().toISOString(),
        }
      ]);
    }
  }, [mounted, messages.length, isLocked]);

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
      // Simulate real AI processing with knowledge of user data
      const { data: { user } } = await supabase.auth.getUser();
      const { data: scans } = await (supabase.from('scans') as any)
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5);

      await new Promise((r) => setTimeout(r, 1500));
      
      let response = "";
      const query = text.toLowerCase();

      if (query.includes("stress") || query.includes("anxious")) {
        const scansList = (scans as Database['public']['Tables']['scans']['Row'][]) || [];
        const avgStress = scansList.reduce((acc, s) => acc + (s.stress_level || 0), 0) / (scansList.length || 1);
        response = `I see your average stress level in recent scans is ${Math.round(avgStress)}. To lower this, I recommend a 4-7-8 breathing exercise: inhale for 4s, hold for 7s, exhale for 8s. Shall we try one?`;
      } else if (query.includes("heart") || query.includes("bpm")) {
        const latestHR = (scans as Database['public']['Tables']['scans']['Row'][] | null)?.[0]?.heart_rate;
        response = latestHR 
          ? `Your last recorded heart rate was ${latestHR} BPM. This is within a healthy resting range for your profile. Consistent tracking will help us identify any significant deviations.`
          : "I don't see any recent heart rate data. Let's perform a new scan to get an accurate reading!";
      } else if (query.includes("wellness") || query.includes("score")) {
        const latestScore = (scans as Database['public']['Tables']['scans']['Row'][] | null)?.[0]?.wellness_score;
        response = latestScore
          ? `Your current wellness score is ${latestScore}/100. You're doing great! To reach the 90+ range, focus on consistent sleep and hydration over the next 48 hours.`
          : "We haven't calculated your wellness score yet. Start a scan so I can analyze your biometric stability!";
      } else {
        response = "That's an interesting question. Based on your biometric trends, maintaining a consistent scanning routine is key to more precise insights. Is there a specific metric like heart rate or stress you'd like me to analyze?";
      }

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
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

  if (isLocked) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] space-y-6 text-center">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
          <Brain className="w-10 h-10 text-primary" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">AI Copilot is a Pro Feature</h2>
          <p className="text-muted-foreground max-w-md">
            Unlock the power of personalized AI wellness coaching and deep biometric insights with our Pro plan.
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90" asChild>
          <Link href="/billing">Upgrade to Pro</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3 text-foreground">
          <Brain className="w-8 h-8 text-primary" />
          AI Wellness Copilot
        </h1>
        <p className="text-muted-foreground">Your personal AI assistant for wellness insights and recommendations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Chat Area */}
        <div className="lg:col-span-8 h-[700px] flex flex-col bg-card border border-border rounded-3xl overflow-hidden backdrop-blur-xl">
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
          <h3 className="text-lg font-semibold flex items-center gap-2 px-1 text-foreground">
            <Zap className="w-5 h-5 text-yellow-500" />
            Live Insights
          </h3>
          <div className="space-y-4">
            {insights.map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>

          <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
            <div className="flex items-center gap-3 text-primary">
              <Activity className="w-5 h-5" />
              <h4 className="font-semibold">Context Awareness</h4>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              I'm using data from your last 5 scans and your health profile to provide personalized advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CopilotPage;
