import { LandingNavbar } from "@/components/landing/landing-navbar";
import { HeroSection } from "@/components/landing/hero-section";
import { LogoTicker } from "@/components/landing/logo-ticker";
import { FeatureSections } from "@/components/landing/feature-sections";
import { BlogSection } from "@/components/landing/blog-section";
import { TestimonialSection } from "@/components/landing/testimonial-section";
import { CtaBanner } from "@/components/landing/cta-banner";
import { LandingFooter } from "@/components/landing/landing-footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#070B14] text-white selection:bg-blue-500/30 font-sans dark">
      {/* Soft ambient background gradients */}
      <div className="absolute top-0 left-0 right-0 h-[800px] w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-[#070B14] to-[#070B14] -z-10" />

      <LandingNavbar />
      
      <main>
        <HeroSection />
        <LogoTicker />
        <FeatureSections />
        <BlogSection />
        <TestimonialSection />
        <CtaBanner />
      </main>

      <LandingFooter />
    </div>
  );
} // Force Server Component Cache invalidation
