import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustedBy from "@/components/TrustedBy";
import HowItWorks from "@/components/HowItWorks";
import VitalsGrid from "@/components/VitalsGrid";
import DashboardPreview from "@/components/DashboardPreview";
import Security from "@/components/Security";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import { BackgroundEffects } from "@/components/BackgroundEffects";

export default async function Home() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-[#020617] selection:bg-blue-500/30">
      <BackgroundEffects />
      <Navbar />
      <Hero />
      <TrustedBy />
      <HowItWorks />
      <VitalsGrid />
      <DashboardPreview />
      <Security />
      <CTA />
      <Footer />
    </main>
  );
}
