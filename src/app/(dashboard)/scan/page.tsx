"use client";

import React from "react";
import { ScanContainer } from "@/components/scan/ScanContainer";
import { ClientOnly } from "@/components/ClientOnly";

export default function ScanPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Wellness Scan</h1>
        <p className="text-zinc-400">Position your face within the frame to begin biometric analysis.</p>
      </div>

      <div className="relative rounded-3xl overflow-hidden bg-zinc-900/50 border border-zinc-800 backdrop-blur-xl min-h-[600px] flex items-center justify-center">
        <ClientOnly fallback={<div className="animate-pulse bg-zinc-800 w-full h-full rounded-3xl" />}>
          <ScanContainer />
        </ClientOnly>
      </div>

      <div className="text-center">
        <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-[0.3em]">
          All biometric data is processed locally on your device
        </p>
      </div>
    </div>
  );
}
