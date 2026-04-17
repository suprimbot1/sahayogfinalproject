"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 mr-3">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementation for email sign up goes here
    alert("Email signup is visual only in this layout until configured in auth.ts. Please use Google Login.");
  };

  return (
    <div className="flex flex-col items-center">
      <div className="text-center mb-8">
        <h1 className="text-[28px] font-extrabold tracking-tight mb-2 text-white">StreamCast</h1>
        <p className="text-[17px] text-[#A1A1A6]">Create your account</p>
      </div>

      <div className="w-full bg-[#0D0D0F]/90 backdrop-blur-xl border border-white/5 rounded-2xl p-8 shadow-2xl">
        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="w-full h-12 bg-[#1A1A1A] hover:bg-[#222] border border-white/10 rounded-lg flex items-center justify-center font-medium text-sm transition-colors text-white mb-6"
        >
          <GoogleIcon />
          Continue with Google
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="h-[1px] flex-1 bg-white/10"></div>
          <span className="text-[#888] text-xs font-medium uppercase tracking-wider">or</span>
          <div className="h-[1px] flex-1 bg-white/10"></div>
        </div>

        <form onSubmit={handleEmailSignup} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[13px] font-semibold text-white ml-1">Email address</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@streamcast.com"
                className="w-full h-12 bg-[#000000] border border-[#222] rounded-lg px-4 text-[15px] text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all font-medium"
                required
                suppressHydrationWarning
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#111] rounded pointer-events-none hidden" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-semibold text-white ml-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full h-12 bg-[#000000] border border-[#222] rounded-lg px-4 text-[15px] text-white placeholder-white/40 tracking-[0.2em] focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full h-12 mt-2 bg-gradient-to-r from-[#696CFF] to-[#8050FF] hover:opacity-90 text-white rounded-lg font-bold text-[15px] transition-opacity flex items-center justify-center shadow-[0_0_20px_rgba(105,108,255,0.3)]"
          >
            Sign up
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-[14px] text-[#A1A1A6]">
            Existing account?{" "}
            <Link href="/login" className="text-white hover:underline decoration-[#696CFF] underline-offset-4 font-medium transition-colors">
              Log in now
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-8 text-center space-y-1 max-w-[320px]">
        <p className="text-[#666] text-[12px] leading-relaxed">
          By signing up, you agree to the <a href="#" className="hover:text-[#888] underline underline-offset-2">Terms of Service</a>.
        </p>
        <p className="text-[#666] text-[12px] leading-relaxed">
          You also agree to receive emails from StreamCast.
        </p>
      </div>
    </div>
  );
}
