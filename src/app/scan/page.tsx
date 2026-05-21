import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { ClientOnly } from "@/components/ClientOnly";
import { Loader2 } from "lucide-react";

// Dynamically import ScanExperience to reduce initial bundle size and speed up navigation
const ScanExperience = dynamic(() => import("@/components/scan/ScanExperience"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      <p className="text-white/40 font-medium animate-pulse uppercase tracking-widest text-xs">
        Loading Vision Engine...
      </p>
    </div>
  ),
});

export default function ScanPage() {
  return (
    <main className="min-h-screen bg-[#020617] text-white selection:bg-blue-500/30">
      <BackgroundEffects />
      
      <div className="relative pt-20 pb-20 overflow-hidden">
        <ClientOnly>
          <Suspense fallback={null}>
            <ScanExperience />
          </Suspense>
        </ClientOnly>
      </div>

      <div className="py-12 text-center">
        <p className="text-[10px] text-white/20 uppercase font-bold tracking-[0.3em]">
          Medical grade AI computer vision • v2.4.0
        </p>
      </div>
    </main>
  );
}
