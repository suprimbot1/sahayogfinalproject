"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Play } from "lucide-react";

export function LandingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? "bg-[#070B14]/80 backdrop-blur-md border-b border-white/5 py-3"
        : "bg-transparent py-5"
        }`}
    >
      <div className="max-w-[1200px] mx-auto px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)]">
            <Play className="w-4 h-4 text-white fill-white ml-0.5 group-hover:scale-110 transition-transform" />
          </div>
          <span className="font-bold text-xl tracking-tight">StreamCast</span>
        </Link>

        {/* Desktop Nav */}
        {/* <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <Link href="#product" className="hover:text-white transition-colors">Product</Link>
          <Link href="#multistream" className="hover:text-white transition-colors">Multistream</Link>
          <Link href="#recording" className="hover:text-white transition-colors">Recording</Link>
          <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
          <Link href="#resources" className="hover:text-white transition-colors">Resources</Link>
        </nav> */}

        {/* Auth CTAs */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Log in
          </Link>
          <Link
            href="/signup"
            className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-sm font-semibold text-white transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)]"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-slate-300 hover:text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[#070B14] border-b border-white/10 p-6 flex flex-col gap-4 shadow-2xl">
          <Link href="#product" className="text-lg font-medium text-slate-300 hover:text-white">Product</Link>
          <Link href="#multistream" className="text-lg font-medium text-slate-300 hover:text-white">Multistream</Link>
          <Link href="#recording" className="text-lg font-medium text-slate-300 hover:text-white">Recording</Link>
          <Link href="#pricing" className="text-lg font-medium text-slate-300 hover:text-white">Pricing</Link>
          <Link href="#resources" className="text-lg font-medium text-slate-300 hover:text-white">Resources</Link>
          <hr className="border-white/5 my-2" />
          <Link href="/login" className="text-lg font-medium text-slate-300 hover:text-white">Log in</Link>
          <Link
            href="/signup"
            className="px-5 py-3 text-center rounded-xl bg-blue-600 font-semibold text-white mt-2"
          >
            Get Started Free
          </Link>
        </div>
      )}
    </header>
  );
} // Force Next.js to recompile server payload
