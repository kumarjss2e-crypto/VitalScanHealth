"use client";

import React from "react";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { ScanContainer } from "@/components/scan/ScanContainer";
import { ClientOnly } from "@/components/ClientOnly";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function ScanPage() {
  return (
    <main className="min-h-screen bg-[#020617] text-white selection:bg-blue-500/30 overflow-hidden">
      <BackgroundEffects />
      
      {/* Header */}
      <div className="relative z-10 px-6 pt-8 pb-4 flex items-center justify-between max-w-7xl mx-auto">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-white/40 hover:text-white transition-colors group"
        >
          <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10">
            <ChevronLeft className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium">Back to Home</span>
        </Link>
        <div className="text-[10px] text-white/20 uppercase font-black tracking-[0.2em]">
          VitalScan v3.0
        </div>
      </div>

      {/* Main Experience */}
      <div className="relative z-10 py-12 px-6">
        <ClientOnly fallback={<div className="min-h-[400px]" />}>
          <ScanContainer />
        </ClientOnly>
      </div>

      {/* Security Footer */}
      <div className="fixed bottom-8 left-0 right-0 text-center z-10 pointer-events-none">
        <p className="text-[10px] text-white/20 uppercase font-bold tracking-[0.3em]">
          All biometric data is processed locally on your device
        </p>
      </div>
    </main>
  );
}
