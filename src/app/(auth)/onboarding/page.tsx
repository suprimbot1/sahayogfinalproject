"use client";

import { useState, useEffect } from "react";
import { checkUsernameAvailability, createInitialProfile } from "./actions";
import { Loader2, Check, X, Shield } from "lucide-react";

export default function OnboardingPage() {
  const [username, setUsername] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Debounced username check
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (username.length >= 3) {
        setIsChecking(true);
        const res = await checkUsernameAvailability(username);
        setIsAvailable(res.available);
        setIsChecking(false);
      } else {
        setIsAvailable(null);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [username]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAvailable) return;

    setIsSubmitting(true);
    setError("");

    try {
      const res = await createInitialProfile({ username });
      if (res.success) {
        window.location.href = "/dashboard";
      } else {
        setError(res.error || "Failed to create profile");
        setIsSubmitting(false);
      }
    } catch (err) {
      setError("An unexpected error occurred");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 mb-4">
          <Shield className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-[28px] font-extrabold tracking-tight mb-2 text-white">Welcome Creator</h1>
        <p className="text-[17px] text-[#A1A1A6]">Let's claim your unique Tip Page URL</p>
      </div>

      <div className="w-full max-w-md bg-[#0D0D0F]/90 backdrop-blur-xl border border-white/5 rounded-2xl p-8 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[13px] font-semibold text-white ml-1">Choose your handle</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#888] font-medium pointer-events-none">
                cr8.rs/
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ""))}
                placeholder="yourname"
                className="w-full h-12 bg-[#000000] border border-[#222] rounded-lg pl-[68px] pr-12 text-[15px] text-white placeholder-white/20 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-medium"
                required
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                {isChecking ? (
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                ) : isAvailable === true ? (
                  <Check className="w-4 h-4 text-emerald-500" />
                ) : isAvailable === false ? (
                  <X className="w-4 h-4 text-red-500" />
                ) : null}
              </div>
            </div>
            
            {username.length > 0 && username.length < 3 && (
              <p className="text-[12px] text-red-400 ml-1">Username must be at least 3 characters</p>
            )}
            
            {isAvailable === false && (
              <p className="text-[12px] text-red-400 ml-1">That username is already taken</p>
            )}

            {isAvailable === true && (
              <p className="text-[12px] text-emerald-400 ml-1">Perfect! That handle is available.</p>
            )}
          </div>

          <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl space-y-2">
            <p className="text-[13px] text-[#A1A1A6] leading-relaxed">
              This will be your permanent tip link where your fans can support you. You can change this later from settings.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-500 text-xs font-medium text-center">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={!isAvailable || isSubmitting}
            className="w-full h-12 mt-2 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground rounded-lg font-bold text-[15px] transition-all flex items-center justify-center shadow-[0_0_20px_rgba(var(--primary),0.3)]"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Start Using Sahayog"}
          </button>
        </form>
      </div>
      
      <p className="mt-8 text-[13px] text-[#666]">
         Need help? <a href="#" className="text-[#888] hover:underline">Contact support</a>
      </p>
    </div>
  );
}
