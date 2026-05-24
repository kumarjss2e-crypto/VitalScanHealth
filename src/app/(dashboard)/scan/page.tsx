import React from "react";
import { ScanContainer } from "@/components/scan/ScanContainer";
import { ClientOnly } from "@/components/ClientOnly";
import { createClient } from "@/utils/supabase/server";
import { checkUsageLimit, getSubscriptionStatus } from "@/services/subscription.service";
import { AlertCircle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function ScanPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { allowed, count, limit } = await checkUsageLimit(user.id);
  const { limits } = await getSubscriptionStatus(user.id);

  if (!allowed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] space-y-6 text-center">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
          <Lock className="w-10 h-10 text-primary" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Daily Limit Reached</h2>
          <p className="text-muted-foreground max-w-md">
            You've used all {limit} of your daily scans on the Free plan. 
            Upgrade to Pro for unlimited scans and advanced biometrics.
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90" asChild>
          <Link href="/billing">Upgrade to Pro</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Wellness Scan</h1>
        <p className="text-muted-foreground">Position your face within the frame to begin biometric analysis.</p>
      </div>

      <div className="relative rounded-3xl overflow-hidden bg-card border border-border backdrop-blur-xl min-h-[600px] flex items-center justify-center">
        <ClientOnly fallback={<div className="animate-pulse bg-muted w-full h-full rounded-3xl" />}>
          <ScanContainer limits={limits} />
        </ClientOnly>
      </div>

      <div className="text-center">
        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-[0.3em]">
          All biometric data is processed locally on your device • {count}/{limit === Infinity ? '∞' : limit} scans today
        </p>
      </div>
    </div>
  );
}
