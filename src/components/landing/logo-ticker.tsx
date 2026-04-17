"use client";

import { useEffect, useRef } from "react";

const LOGOS = [
  "YouTube",
  "Facebook",
  "LinkedIn",
  "Twitch",
  "Spotify",
  "Zoom",
  // Repeat for seamless scroll
  "YouTube",
  "Facebook",
  "LinkedIn",
  "Twitch",
  "Spotify",
  "Zoom",
  "YouTube",
  "Facebook",
  "LinkedIn",
  "Twitch",
  "Spotify",
  "Zoom",
];

export function LogoTicker() {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let animationFrameId: number;
    let scrollPos = 0;

    const scroll = () => {
      scrollPos += 0.5; // Adjust speed
      if (scrollPos >= el.scrollWidth / 2) {
        scrollPos = 0;
      }
      el.scrollLeft = scrollPos;
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <section className="py-12 border-y border-white/5 bg-white/[0.02]">
      <div className="max-w-[1200px] mx-auto px-6 mb-6">
        <p className="text-center text-sm font-medium text-slate-400">
          TRUSTED BY CREATORS STREAMING TO
        </p>
      </div>
      <div className="w-full overflow-hidden relative flex">
        {/* Gradients to fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#070B14] to-transparent z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#070B14] to-transparent z-10"></div>
        
        <div 
          ref={scrollRef}
          className="flex items-center gap-16 overflow-hidden whitespace-nowrap pl-16 py-4"
          style={{ width: "200%" }}
        >
          {LOGOS.map((name, i) => (
            <div 
              key={i} 
              className="text-2xl md:text-3xl font-bold text-slate-600/80 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 hover:text-white transition-all duration-300 select-none flex-shrink-0 flex items-center gap-2"
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
