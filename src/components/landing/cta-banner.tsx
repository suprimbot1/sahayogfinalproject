import Image from "next/image";
import Link from "next/link";

export function CtaBanner() {
  return (
    <section className="relative w-full overflow-hidden py-32 border-y border-white/5">
      {/* Background Image / Light Beams */}
      <div className="absolute inset-0 w-full h-full -z-10">
        <Image 
          src="/landing/cta_background_1776451431096.png" 
          alt="Spotlight Background" 
          fill 
          className="object-cover"
        />
        {/* Dark overlay to ensure text is readable */}
        <div className="absolute inset-0 bg-[#070B14]/60 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#070B14] via-transparent to-[#070B14]" />
      </div>

      <div className="max-w-[800px] mx-auto px-6 text-center relative z-10 flex flex-col items-center">
        <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-10 drop-shadow-2xl">
          Amplify your story.
        </h2>
        
        <Link
          href="/dashboard"
          className="group relative px-10 py-5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xl transition-all shadow-[0_0_50px_rgba(37,99,235,0.6)] hover:shadow-[0_0_80px_rgba(37,99,235,0.8)] flex items-center gap-2 overflow-hidden"
        >
          <span className="relative z-10">Get Started - It's Free</span>
          {/* Button inner shine effect */}
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shimmer z-0" />
        </Link>
        <p className="mt-6 text-slate-300 font-medium text-sm">
          No credit card required. Cancel anytime.
        </p>
      </div>
    </section>
  );
}
