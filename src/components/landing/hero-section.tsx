import Image from "next/image";
import Link from "next/link";
import { PlayCircle } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative pt-40 pb-20 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6 h-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left Content */}
          <div className="max-w-xl">
            <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6 text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
              Go live, stream smarter, grow faster
            </h1>
            <p className="text-lg text-slate-300 font-medium mb-10 leading-relaxed pr-8">
              Broadcast to multiple platforms with guests, professional branding, and full HD recording—directly from your browser.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-lg transition-all shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:shadow-[0_0_40px_rgba(37,99,235,0.6)] text-center flex items-center justify-center gap-2"
              >
                Start Free
              </Link>
              <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 text-white font-medium text-lg transition-all border border-white/10 hover:border-white/20 flex items-center justify-center gap-2 backdrop-blur-sm group">
                <PlayCircle className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors" />
                Watch Demo
              </button>
            </div>
          </div>

          {/* Right Image / Mockup */}
          <div className="relative relative w-full aspect-[4/3] lg:aspect-square flex items-center justify-center">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-blue-500/20 rounded-full blur-[100px] -z-10" />
            
            <div className="relative w-full h-[120%] lg:h-[140%] top-0 lg:-top-16 -right-4 lg:-right-12">
               <Image 
                 src="/landing/hero_mockup_1776451266043.png" 
                 alt="StreamCast Dashboard Mockup" 
                 fill
                 className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in fade-in slide-in-from-bottom-10 duration-1000"
                 priority
               />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
