import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScanExperience from "@/components/scan/ScanExperience";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { ClientOnly } from "@/components/ClientOnly";

export default function ScanPage() {
  return (
    <main className="min-h-screen bg-[#020617] text-white selection:bg-blue-500/30">
      {/* Background Decor - Safe for hydration via BackgroundEffects */}
      <BackgroundEffects />
      
      {/* Navigation */}
      <div className="relative z-50">
        {/* We use a simplified navbar or just a logo/back link for better focus during scan */}
      </div>

      {/* Main Experience Layer */}
      <div className="relative pt-20 pb-20 overflow-hidden">
        <ClientOnly>
          <ScanExperience />
        </ClientOnly>
      </div>

      {/* Optional: Minimal Footer */}
      <div className="py-12 text-center">
        <p className="text-[10px] text-white/20 uppercase font-bold tracking-[0.3em]">
          Medical grade AI computer vision • v2.4.0
        </p>
      </div>
    </main>
  );
}
