import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import PrivacySection from "@/components/landing/PrivacySection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-100 selection:text-primary transition-colors">
      <Navbar />
      <main>
        <Hero />
        <PrivacySection />
        <CTASection />
      </main>
    </div>
  );
}
