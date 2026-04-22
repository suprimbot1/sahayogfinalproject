"use client";

import { useTheme } from "@/components/providers/ThemeWrapper";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-16 h-8 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />;
  }

  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative flex items-center justify-between w-[72px] h-[36px] rounded-full p-1 transition-colors duration-500 hover:scale-105"
      style={{
        background: isDark 
          ? "linear-gradient(145deg, #1A1C29, #0D0F16)" 
          : "linear-gradient(145deg, #E2E8F0, #F8FAFC)",
        boxShadow: isDark 
          ? "inset 0px 4px 8px rgba(0,0,0,0.4), inset 0px -4px 8px rgba(255,255,255,0.05), 0px 0px 15px rgba(59,130,246,0.15)" 
          : "inset 0px 4px 8px rgba(0,0,0,0.1), inset 0px -4px 8px rgba(255,255,255,0.7), 0px 2px 10px rgba(0,0,0,0.05)",
      }}
      aria-label="Toggle Theme"
    >
      {/* Sun Icon Background */}
      <Sun 
        className={`absolute left-2 w-[18px] h-[18px] z-0 transition-all duration-500 ${
          isDark ? "text-slate-600 rotate-90 scale-75" : "text-amber-500 rotate-0 scale-100"
        }`} 
      />

      {/* Moon Icon Background */}
      <Moon 
        className={`absolute right-2 w-[18px] h-[18px] z-0 transition-all duration-500 ${
          isDark ? "text-blue-400 rotate-0 scale-100" : "text-slate-400 -rotate-90 scale-75"
        }`}
      />

      {/* The 3D Switch Nub */}
      <div
        className="w-7 h-7 rounded-full z-10 flex items-center justify-center transition-all duration-500 ease-out"
        style={{
          transform: isDark ? "translateX(36px)" : "translateX(0px)",
          background: isDark 
            ? "linear-gradient(135deg, #2D3748, #1A202C)" 
            : "linear-gradient(135deg, #ffffff, #f1f5f9)",
          boxShadow: isDark
            ? "0px 4px 8px rgba(0,0,0,0.5), inset 0px 2px 2px rgba(255,255,255,0.1)"
            : "0px 4px 8px rgba(0,0,0,0.15), inset 0px 2px 2px rgba(255,255,255,0.8)",
        }}
      >
         {/* Subtle metallic reflection line on the nub */}
         <div className="w-[4px] h-[12px] rounded-full bg-black/10 dark:bg-white/10" />
      </div>
    </button>
  );
}
