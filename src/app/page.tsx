"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { 
  ArrowRight, 
  Sparkles, 
  DollarSign, 
  Flame, 
  Shield, 
  Heart, 
  Zap, 
  CheckCircle2, 
  Play, 
  ArrowUpRight, 
  Globe, 
  Coins, 
  MessageSquare, 
  Share2, 
  LineChart, 
  Menu, 
  X, 
  ChevronDown, 
  User, 
  Wallet,
  ArrowRightLeft,
  Bell,
  Activity,
  Smile,
  Laptop,
  Check,
  Send,
  Lock,
  ExternalLink,
  HelpCircle
} from "lucide-react";

// Local Custom Icons for Nepal Payment Providers
const KhaltiIcon = () => (
  <span className="font-bold text-xs px-2 py-0.5 rounded bg-purple-700 text-white tracking-wide">KHALTI</span>
);

const FonepayIcon = () => (
  <span className="font-extrabold text-xs px-2 py-0.5 rounded bg-red-600 text-white tracking-wide">fonepay</span>
);

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Monitor scroll for header background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const creators = [
    { name: "chodu", role: "FPS Streamer", subscribers: "120K" },
    { name: "ZEALEN", role: "Vlogger & Tech", subscribers: "250K" },
    { name: "zevenlive", role: "IRL Streamer", subscribers: "85K" },
    { name: "4kgamingnepal", role: "Gaming Creator", subscribers: "410K" },
    { name: "p07", role: "Esports Caster", subscribers: "65K" },
    { name: "CatchTheFlow", role: "Hip-Hop Artist", subscribers: "180K" },
    { name: "ruzoG", role: "Duo Gamers", subscribers: "95K" },
    { name: "Sleepyhoraa", role: "ASMR & Variety", subscribers: "110K" },
    { name: "anabpati", role: "Podcast Host", subscribers: "150K" }
  ];

  const faqs = [
    {
      q: "What is Sahayog and how does it help creators?",
      a: "Sahayog is an all-in-one creator monetization and audience engagement platform. We provide customizable tipping pages, live stream alerts, progress widgets, and payment systems built specifically for streamers, influencers, and artists in Nepal and South Asia."
    },
    {
      q: "Which local payment systems do you support?",
      a: "We support direct tipping through popular Nepalese digital payment methods including Khalti, Fonepay, local bank transfers, and major mobile wallets. Payouts are made directly in NPR into your linked bank account daily."
    },
    {
      q: "Are there any upfront fees or monthly costs?",
      a: "No! Sahayog is completely free to set up. We only take a standard transparent commission on successful tipping transactions to keep the platform secure, compliant, and continuously updated."
    },
    {
      q: "Can I use Sahayog stream alerts on OBS or Streamlabs?",
      a: "Yes! All Sahayog widgets are engineered as standard Browser Sources. You can easily copy your unique widget links and paste them into OBS Studio, Streamlabs, vMix, or lightstream, and they will animate in real-time."
    },
    {
      q: "Is the tipping compliant and secure?",
      a: "Absolutely. Sahayog utilizes compliant fintech payment pipelines with real-time verification and secure encryption to guarantee all tips, memberships, and payouts are fully verified, transparent, and secure."
    }
  ];

  return (
    <div className="min-h-screen bg-[#041B12] text-white selection:bg-[#00C16A]/30 selection:text-[#00C16A] overflow-x-hidden font-sans antialiased">
      {/* Background Mesh Gradients & Glow Blobs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#00C16A]/10 rounded-full blur-[120px] pointer-events-none animate-pulse-glow" />
      <div className="absolute top-[800px] right-1/4 w-[600px] h-[600px] bg-[#00C16A]/5 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-[500px] left-1/3 w-[500px] h-[500px] bg-[#00C16A]/8 rounded-full blur-[120px] pointer-events-none" />

      {/* Grid Overlay */}
      <div className="absolute top-0 left-0 right-0 bottom-0 bg-grid-pattern opacity-60 pointer-events-none -z-10" />

      {/* ================= STICKY GLASSMORPHISM NAVBAR ================= */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-[#041B12]/80 backdrop-blur-xl border-b border-white/5 py-4 shadow-[0_4px_30px_rgba(4,27,18,0.3)]" 
          : "bg-transparent py-6"
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00C16A] to-[#10B981] flex items-center justify-center shadow-[0_0_20px_rgba(0,193,106,0.4)] transition-transform duration-300 group-hover:scale-105">
              <Play className="w-5 h-5 text-[#041B12] fill-[#041B12] ml-0.5" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-white via-white to-[#00C16A] bg-clip-text text-transparent">
              Sahayog
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center gap-8 text-[15px] font-medium text-white/70">
            <a href="#features" className="hover:text-[#00C16A] transition-colors relative group py-2">
              Features
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#00C16A] transition-all group-hover:w-full" />
            </a>
            <a href="#solutions" className="hover:text-[#00C16A] transition-colors relative group py-2">
              Solutions
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#00C16A] transition-all group-hover:w-full" />
            </a>
            <a href="#creators" className="hover:text-[#00C16A] transition-colors relative group py-2">
              Creators
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#00C16A] transition-all group-hover:w-full" />
            </a>
            <a href="#pricing" className="hover:text-[#00C16A] transition-colors relative group py-2">
              Pricing
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#00C16A] transition-all group-hover:w-full" />
            </a>
            <a href="#faq" className="hover:text-[#00C16A] transition-colors relative group py-2">
              FAQ
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#00C16A] transition-all group-hover:w-full" />
            </a>
          </div>

          {/* CTA & Actions */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/login" className="text-[15px] font-semibold text-white/80 hover:text-white transition-colors">
              Log in
            </Link>
            <Link 
              href="/signup" 
              className="relative px-6 py-3 rounded-xl bg-gradient-to-r from-[#00C16A] to-[#10B981] text-[#041B12] font-bold text-sm tracking-wide shadow-[0_0_30px_rgba(0,193,106,0.3)] hover:shadow-[0_0_40px_rgba(0,193,106,0.5)] transition-all duration-300 hover:-translate-y-0.5"
            >
              Join Sahayog
            </Link>
          </div>

          {/* Mobile Menu Icon */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-white/80 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-[#041B12]/95 backdrop-blur-2xl border-b border-white/10 p-6 flex flex-col gap-5 shadow-2xl animate-fade-in">
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-white/80 hover:text-[#00C16A]">Features</a>
            <a href="#solutions" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-white/80 hover:text-[#00C16A]">Solutions</a>
            <a href="#creators" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-white/80 hover:text-[#00C16A]">Creators</a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-white/80 hover:text-[#00C16A]">Pricing</a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-white/80 hover:text-[#00C16A]">FAQ</a>
            <hr className="border-white/5 my-2" />
            <div className="flex flex-col gap-4">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="text-center py-3 text-white/80 hover:text-white font-medium">Log in</Link>
              <Link 
                href="/signup" 
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3.5 rounded-xl bg-gradient-to-r from-[#00C16A] to-[#10B981] text-[#041B12] font-bold shadow-[0_0_20px_rgba(0,193,106,0.3)]"
              >
                Join Sahayog
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* ================= HERO SECTION ================= */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-6 space-y-8 z-10 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00C16A]/10 border border-[#00C16A]/20 text-[#00C16A] font-semibold text-xs tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              Creator Economy in Nepal & South Asia
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-none text-white">
              Monetization Platform For{" "}
              <span className="bg-gradient-to-r from-[#00C16A] via-[#10B981] to-[#60E2A1] bg-clip-text text-transparent">
                Creators & Streamers
              </span>
            </h1>

            <p className="text-lg md:text-xl text-[#EEF4F0]/80 leading-relaxed font-light max-w-2xl mx-auto lg:mx-0">
              Sahayog helps you receive tips, engage and thank your audience with widgets, and grow a supporter-driven income from day one.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link 
                href="/signup" 
                className="group flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#00C16A] to-[#10B981] text-[#041B12] font-extrabold shadow-[0_0_30px_rgba(0,193,106,0.25)] hover:shadow-[0_0_40px_rgba(0,193,106,0.45)] hover:-translate-y-0.5 transition-all duration-300"
              >
                Join Sahayog
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              
              <a 
                href="#features" 
                className="flex items-center justify-center px-8 py-4 rounded-xl border border-white/10 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.05] text-white font-semibold transition-all duration-300"
              >
                Explore Features
              </a>
            </div>

            {/* Core Badges */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-white/5 max-w-md mx-auto lg:mx-0">
              <div>
                <p className="text-2xl font-extrabold text-[#00C16A]">0%</p>
                <p className="text-xs text-white/50 uppercase tracking-wider font-semibold">Direct Fee Options</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-[#00C16A]">100%</p>
                <p className="text-xs text-white/50 uppercase tracking-wider font-semibold">Local NPR Payouts</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-[#00C16A]">1-Click</p>
                <p className="text-xs text-white/50 uppercase tracking-wider font-semibold">OBS Integration</p>
              </div>
            </div>
          </div>

          {/* Hero Right Visuals (Premium Streamer & Floating Dashboard UI Mockup) */}
          <div className="lg:col-span-6 relative z-10 w-full flex justify-center">
            
            {/* Visual Frame */}
            <div className="relative w-full max-w-[500px] aspect-square rounded-3xl bg-gradient-to-tr from-[#00C16A]/10 to-[#10B981]/5 border border-white/10 p-4 shadow-2xl flex items-center justify-center overflow-visible">
              
              {/* Creator Centerpiece Graphic */}
              <div className="relative w-full h-full rounded-2xl bg-gradient-to-b from-[#05261a] to-[#041b12] border border-white/5 p-6 flex flex-col justify-between overflow-hidden shadow-inner">
                
                {/* Simulated Camera Feed Overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#041b12]/80 to-[#041b12] z-0" />
                
                {/* Premium Glow Rings behind streamer */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-[#00C16A]/20 blur-[60px] pointer-events-none" />

                {/* Dashboard / Live HUD Header */}
                <div className="relative z-10 flex justify-between items-center w-full">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-xs font-bold uppercase text-red-500 tracking-wider">LIVE</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-semibold text-white/70">
                    <Activity className="w-3 h-3 text-[#00C16A]" />
                    <span>OBS Connected</span>
                  </div>
                </div>

                {/* Main HUD Visual representation */}
                <div className="relative z-10 my-auto text-center space-y-4">
                  <div className="relative inline-block">
                    <div className="w-24 h-24 rounded-full border-2 border-[#00C16A] p-1 mx-auto bg-gradient-to-tr from-[#041B12] to-[#00C16A]/40 overflow-hidden shadow-[0_0_25px_rgba(0,193,106,0.3)]">
                      <div className="w-full h-full rounded-full bg-[#052c1d] flex items-center justify-center text-3xl">
                        🎮
                      </div>
                    </div>
                    <span className="absolute bottom-0 right-1 px-2 py-0.5 text-[9px] font-bold bg-[#00C16A] text-[#041B12] rounded-full uppercase tracking-wider">PRO</span>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-lg text-white">4kgamingnepal</h4>
                    <p className="text-xs text-white/50">Playing Apex Legends Live</p>
                  </div>
                </div>

                {/* Nepal Payout visual at the bottom */}
                <div className="relative z-10 flex justify-between items-center pt-3 border-t border-white/5 text-xs text-white/70">
                  <span>Stream Revenue</span>
                  <span className="font-extrabold text-[#00C16A] text-sm">Rs. 84,250.00 NPR</span>
                </div>
              </div>

              {/* FLOATING GLASS CARDS */}
              
              {/* Card 1: Live Tip Alert */}
              <div className="absolute -top-6 -left-6 md:-left-10 w-[220px] bg-white/[0.03] backdrop-blur-xl border border-white/10 p-3.5 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] animate-float flex gap-3 z-20">
                <div className="w-10 h-10 rounded-xl bg-[#00C16A]/10 border border-[#00C16A]/20 flex items-center justify-center text-[#00C16A]">
                  <Heart className="w-5 h-5 fill-[#00C16A]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] uppercase text-[#00C16A] font-extrabold tracking-wider">Live Tip Alert</p>
                  <p className="text-xs font-bold text-white truncate">Aashish sent Rs. 500</p>
                  <p className="text-[10px] text-white/60 truncate italic mt-0.5">"Keep up the apex play!"</p>
                </div>
              </div>

              {/* Card 2: Revenue Analytics Graph */}
              <div className="absolute top-10 -right-8 md:-right-12 w-[180px] bg-[#041B12]/80 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] animate-float-slow z-20">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] text-white/50 font-bold uppercase tracking-wider">Analytics</span>
                  <LineChart className="w-3.5 h-3.5 text-[#00C16A]" />
                </div>
                <p className="text-lg font-black text-white">Rs. 18,200</p>
                <p className="text-[9px] text-[#00C16A] font-bold flex items-center gap-0.5">
                  <span>+24.5%</span> this week
                </p>
                {/* Micro mini graph bars */}
                <div className="flex items-end gap-1 h-8 mt-3">
                  <div className="w-full bg-[#00C16A]/10 rounded h-1/3" />
                  <div className="w-full bg-[#00C16A]/20 rounded h-1/2" />
                  <div className="w-full bg-[#00C16A]/40 rounded h-3/4" />
                  <div className="w-full bg-[#00C16A] rounded h-full" />
                </div>
              </div>

              {/* Card 3: Follower Activity */}
              <div className="absolute bottom-12 -left-8 md:-left-12 w-[190px] bg-[#041B12]/80 backdrop-blur-xl border border-white/10 p-3 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] animate-float-slow z-20 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-white/40 font-bold">LATEST FOLLOWER</p>
                  <p className="text-xs font-extrabold text-white">zevenlive</p>
                </div>
              </div>

              {/* Card 4: Local Payout NPR */}
              <div className="absolute -bottom-8 -right-4 w-[230px] bg-white/[0.03] backdrop-blur-xl border border-[#00C16A]/25 p-4 rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.6)] animate-float z-20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-[#00C16A] font-extrabold uppercase tracking-widest">NPR Local Payout</span>
                  <CheckCircle2 className="w-4 h-4 text-[#00C16A]" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-white/5 border border-white/10 flex items-center justify-center">
                    <Wallet className="w-4.5 h-4.5 text-white/70" />
                  </div>
                  <div>
                    <p className="text-[9px] text-white/40">SENT TO LINKED BANK</p>
                    <p className="text-xs font-bold text-white">NIC Asia Bank •••• 9820</p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ================= TRUSTED BY CREATORS TICKER ================= */}
      <section id="creators" className="py-12 bg-[#04160E] border-y border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-8 text-center md:text-left">
          <p className="text-xs uppercase text-[#00C16A] font-extrabold tracking-widest mb-1">Empowering the Best</p>
          <h3 className="text-xl font-bold text-white/90">Trusted by Leading Creators & Streamers across Nepal</h3>
        </div>

        {/* Ticker Row */}
        <div className="relative w-full flex items-center overflow-x-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#04160E] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#04160E] to-transparent z-10 pointer-events-none" />
          
          {/* Animated Marquee Container (duplicated list to scroll seamlessly) */}
          <div className="flex gap-6 whitespace-nowrap animate-infinite-scroll">
            {[...creators, ...creators].map((creator, i) => (
              <div 
                key={i} 
                className="inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-[#041B12]/80 backdrop-blur-md border border-white/5 shadow-lg group hover:border-[#00C16A]/20 transition-all duration-300"
              >
                <div className="w-8 h-8 rounded-xl bg-[#00C16A]/10 flex items-center justify-center font-bold text-[#00C16A] text-sm group-hover:scale-105 transition-transform">
                  {creator.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-extrabold text-white tracking-wide">{creator.name}</p>
                  <p className="text-[10px] text-white/40">{creator.role} • {creator.subscribers} fans</p>
                </div>
                <div className="ml-3 w-1.5 h-1.5 rounded-full bg-[#00C16A] shadow-[0_0_8px_#00C16A]" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FEATURES / WIDGETS SECTION ================= */}
      <section id="features" className="py-24 md:py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <span className="text-[#00C16A] font-extrabold text-xs tracking-widest uppercase bg-[#00C16A]/10 px-3.5 py-1.5 rounded-full border border-[#00C16A]/20">
              Interactive Tools & Widgets
            </span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-none">
              Everything you need to engage & earn
            </h2>
            <p className="text-base md:text-lg text-white/60 font-light">
              Give your supporters professional, localized ways to tips you with instant interactive alerts for OBS.
            </p>
          </div>

          {/* 6-Card Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Card 1: Hotfix */}
            <div className="group relative bg-[#041B12]/90 backdrop-blur-xl border border-white/5 hover:border-[#00C16A]/20 rounded-3xl p-8 shadow-2xl transition-all duration-500 overflow-hidden flex flex-col justify-between h-[300px]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#00C16A]/10 to-transparent rounded-bl-full pointer-events-none group-hover:opacity-100 transition-opacity" />
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mb-6 group-hover:scale-105 transition-transform duration-300">
                  <Flame className="w-6 h-6 fill-amber-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Hotfix</h3>
                <p className="text-sm text-white/50 leading-relaxed">
                  Instant overlay edits and quick widget diagnostics. Fine-tune live alerts mid-stream without restarting your broadcast.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-xs text-[#00C16A] font-bold">
                <span>Diag tools ready</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#00C16A] animate-ping" />
              </div>
            </div>

            {/* Card 2: My Design Progress */}
            <div className="group relative bg-[#041B12]/90 backdrop-blur-xl border border-white/5 hover:border-[#00C16A]/20 rounded-3xl p-8 shadow-2xl transition-all duration-500 overflow-hidden flex flex-col justify-between h-[300px]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#00C16A]/10 to-transparent rounded-bl-full pointer-events-none group-hover:opacity-100 transition-opacity" />
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#00C16A]/10 border border-[#00C16A]/20 flex items-center justify-center text-[#00C16A] mb-6 group-hover:scale-105 transition-transform duration-300">
                  <LineChart className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">My Design Progress</h3>
                <p className="text-sm text-white/50 leading-relaxed">
                  Track and display stream support goals. Show beautiful visual bars representing donation targets and sub milestones live.
                </p>
              </div>
              
              {/* Progress visual in card */}
              <div className="mt-4 w-full bg-white/5 h-2 rounded-full overflow-hidden">
                <div className="bg-[#00C16A] h-full rounded-full w-[70%] group-hover:w-[85%] transition-all duration-700" />
              </div>
            </div>

            {/* Card 3: Public Profile Setup */}
            <div className="group relative bg-[#041B12]/90 backdrop-blur-xl border border-white/5 hover:border-[#00C16A]/20 rounded-3xl p-8 shadow-2xl transition-all duration-500 overflow-hidden flex flex-col justify-between h-[300px]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#00C16A]/10 to-transparent rounded-bl-full pointer-events-none group-hover:opacity-100 transition-opacity" />
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-105 transition-transform duration-300">
                  <Globe className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Public Profile Setup</h3>
                <p className="text-sm text-white/50 leading-relaxed">
                  Claim your custom `sahayog.app/yourname` digital tips page. Optimized, mobile-first design built to maximize support.
                </p>
              </div>
              <div className="mt-4 text-xs font-bold text-white/40 group-hover:text-white transition-colors duration-300 flex items-center gap-1">
                <span>sahayog.app/yourname</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Card 4: Create Paid Profile */}
            <div className="group relative bg-[#041B12]/90 backdrop-blur-xl border border-white/5 hover:border-[#00C16A]/20 rounded-3xl p-8 shadow-2xl transition-all duration-500 overflow-hidden flex flex-col justify-between h-[300px]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#00C16A]/10 to-transparent rounded-bl-full pointer-events-none group-hover:opacity-100 transition-opacity" />
              <div>
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-105 transition-transform duration-300">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Create Paid Profile</h3>
                <p className="text-sm text-white/50 leading-relaxed">
                  Enable paid membership tiers and exclusive feeds. Lock premium vlogs, behind-the-scenes chats, and digital assets.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs text-purple-400 font-extrabold uppercase">
                <span>Exclusive Content Ready</span>
              </div>
            </div>

            {/* Card 5: Connect your Paid Account */}
            <div className="group relative bg-[#041B12]/90 backdrop-blur-xl border border-white/5 hover:border-[#00C16A]/20 rounded-3xl p-8 shadow-2xl transition-all duration-500 overflow-hidden flex flex-col justify-between h-[300px]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#00C16A]/10 to-transparent rounded-bl-full pointer-events-none group-hover:opacity-100 transition-opacity" />
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-105 transition-transform duration-300">
                  <Wallet className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Connect your Paid Account</h3>
                <p className="text-sm text-white/50 leading-relaxed">
                  Link your local Nepalese banks and digital wallets. Enjoy fully secure, automated bank transfers directly to your account.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <KhaltiIcon />
                <FonepayIcon />
              </div>
            </div>

            {/* Card 6: Share your Content */}
            <div className="group relative bg-[#041B12]/90 backdrop-blur-xl border border-white/5 hover:border-[#00C16A]/20 rounded-3xl p-8 shadow-2xl transition-all duration-500 overflow-hidden flex flex-col justify-between h-[300px]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#00C16A]/10 to-transparent rounded-bl-full pointer-events-none group-hover:opacity-100 transition-opacity" />
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#00C16A]/10 border border-[#00C16A]/20 flex items-center justify-center text-[#00C16A] mb-6 group-hover:scale-105 transition-transform duration-300">
                  <Share2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Share your Content</h3>
                <p className="text-sm text-white/50 leading-relaxed">
                  Distribute your tipping link and widgets across Twitch chat, YouTube descriptions, TikTok bios, and social channels.
                </p>
              </div>
              <div className="mt-4 flex gap-1.5">
                <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/60">Twitch</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/60">YouTube</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/60">TikTok</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= VALUE PROPOSITION SECTION ================= */}
      <section className="py-24 bg-[#04160E] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#00C16A]/5 rounded-full blur-[160px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-20 space-y-4">
            <span className="text-xs uppercase text-[#00C16A] font-extrabold tracking-widest bg-[#00C16A]/10 border border-[#00C16A]/20 px-3.5 py-1.5 rounded-full">
              Made For You
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-none">
              Designed for all types of creators and streamers!
            </h2>
            <p className="text-base md:text-lg text-white/60 font-light">
              Sahayog is a flexible monetization and engagement platform built for content creators and live streamers regardless of niche, audience size, or platform.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Card 1 */}
            <div className="group relative bg-[#041B12]/80 backdrop-blur-xl border border-white/5 hover:border-[#00C16A]/20 rounded-3xl p-8 flex flex-col justify-between shadow-2xl transition-all duration-500 hover:-translate-y-1">
              <div>
                <div className="relative w-full aspect-video rounded-2xl bg-gradient-to-tr from-[#052c1e] to-[#04160e] border border-white/5 p-4 mb-6 flex items-center justify-center overflow-hidden">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full bg-[#00C16A]/10 blur-xl pointer-events-none" />
                  
                  {/* Supporter tip UI preview */}
                  <div className="relative w-full max-w-[200px] bg-white/[0.03] backdrop-blur-md border border-white/10 p-3 rounded-xl shadow-lg space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-[#00C16A] flex items-center justify-center text-[10px] text-[#041B12] font-black">
                        🇳🇵
                      </div>
                      <span className="text-[10px] font-bold text-white">Sujan tipped Rs. 1,000</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded" />
                    <div className="h-1.5 w-2/3 bg-white/5 rounded" />
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-3">For your content creation</h3>
                <p className="text-sm text-white/60 leading-relaxed mb-6">
                  Perfect for podcasters, vloggers, artists, and educators. Claim tips, custom pledges, or setup structured memberships with instant localized withdrawals.
                </p>
              </div>

              <Link 
                href="/signup" 
                className="w-full text-center py-3.5 rounded-xl border border-white/10 group-hover:border-[#00C16A]/40 bg-white/[0.01] group-hover:bg-[#00C16A] text-white group-hover:text-[#041B12] font-bold text-sm tracking-wide transition-all duration-300"
              >
                Get Started Now
              </Link>
            </div>

            {/* Card 2 */}
            <div className="group relative bg-[#041B12]/80 backdrop-blur-xl border border-white/5 hover:border-[#00C16A]/20 rounded-3xl p-8 flex flex-col justify-between shadow-2xl transition-all duration-500 hover:-translate-y-1">
              <div>
                <div className="relative w-full aspect-video rounded-2xl bg-gradient-to-tr from-[#052c1e] to-[#04160e] border border-white/5 p-4 mb-6 flex items-center justify-center overflow-hidden">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full bg-[#00C16A]/10 blur-xl pointer-events-none" />
                  
                  {/* Live Overlay widgets preview */}
                  <div className="relative w-full max-w-[180px] bg-red-500/10 border border-red-500/20 p-3 rounded-xl shadow-lg flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white">
                      <Bell className="w-4 h-4 animate-bounce" />
                    </div>
                    <div>
                      <p className="text-[9px] text-red-400 font-extrabold uppercase">STREAM ALERT</p>
                      <p className="text-[11px] font-black text-white">New Tip Recieved!</p>
                    </div>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-white mb-3">Connect with your live stream fans</h3>
                <p className="text-sm text-white/60 leading-relaxed mb-6">
                  Built for live streamers on YouTube, Twitch, Facebook, and TikTok. Launch automated stream alerts, chat integrations, custom giveaways, and text-to-speech tipping.
                </p>
              </div>

              <Link 
                href="/signup" 
                className="w-full text-center py-3.5 rounded-xl border border-white/10 group-hover:border-[#00C16A]/40 bg-white/[0.01] group-hover:bg-[#00C16A] text-white group-hover:text-[#041B12] font-bold text-sm tracking-wide transition-all duration-300"
              >
                Launch Tipping Live
              </Link>
            </div>

            {/* Card 3 */}
            <div className="group relative bg-[#041B12]/80 backdrop-blur-xl border border-[#00C16A]/25 hover:border-[#00C16A] rounded-3xl p-8 flex flex-col justify-between shadow-2xl transition-all duration-500 hover:-translate-y-1">
              <div>
                <div className="relative w-full aspect-video rounded-2xl bg-gradient-to-tr from-[#052c1e] to-[#04160e] border border-white/5 p-4 mb-6 flex items-center justify-center overflow-hidden">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full bg-[#00C16A]/10 blur-xl pointer-events-none" />
                  
                  {/* Secure Payment visual */}
                  <div className="relative flex items-center gap-2 bg-[#041B12]/90 border border-[#00C16A]/20 px-4 py-2.5 rounded-full shadow-lg">
                    <Shield className="w-4.5 h-4.5 text-[#00C16A]" />
                    <span className="text-[10px] font-extrabold tracking-wide text-white">NPR Compliant Payouts</span>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-white mb-3">Powering creator earnings with trusted payments</h3>
                <p className="text-sm text-white/60 leading-relaxed mb-6">
                  Compliant, secure, and built specifically for the local Nepalese ecosystem. Integrate local digital wallets and instant bank transfer withdrawals with zero friction.
                </p>
              </div>

              <Link 
                href="/signup" 
                className="w-full text-center py-3.5 rounded-xl bg-gradient-to-r from-[#00C16A] to-[#10B981] text-[#041B12] font-black text-sm tracking-wide transition-all duration-300 shadow-[0_0_20px_rgba(0,193,106,0.2)] group-hover:shadow-[0_0_30px_rgba(0,193,106,0.4)]"
              >
                Set Up Payments
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS TIMELINE ================= */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-24 space-y-4">
            <span className="text-xs uppercase text-[#00C16A] font-extrabold tracking-widest bg-[#00C16A]/10 border border-[#00C16A]/20 px-3.5 py-1.5 rounded-full">
              Seamless Integration
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-none">
              More Gateways. Local Payouts. Compliant Tipping.
            </h2>
            <p className="text-base md:text-lg text-white/60 font-light">
              Follow our simple three-step setup to unlock unlimited support and clean daily local currency payouts.
            </p>
          </div>

          {/* Timeline Layout */}
          <div className="relative">
            {/* Connected animated lines between steps */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-[#00C16A]/20 via-[#00C16A]/40 to-[#00C16A]/20 -translate-y-1/2 hidden lg:block -z-10" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
              
              {/* Step 1 */}
              <div className="bg-[#041B12] border border-white/5 rounded-3xl p-8 relative space-y-6 shadow-2xl hover:border-[#00C16A]/20 transition-all duration-300 text-center lg:text-left">
                <div className="w-12 h-12 rounded-2xl bg-[#00C16A] text-[#041B12] font-black text-xl flex items-center justify-center mx-auto lg:mx-0 shadow-[0_0_20px_rgba(0,193,106,0.3)]">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">More Gateways</h3>
                  <p className="text-sm text-white/50 leading-relaxed mb-4">
                    Connect multiple local gateways instantly. Integrate credit cards, Fonepay QR, Khalti wallet, and bank transfer options.
                  </p>
                </div>
                {/* Fintech local logos mockup */}
                <div className="flex justify-center lg:justify-start gap-2 pt-2 border-t border-white/5">
                  <span className="px-2.5 py-1 rounded bg-white/5 text-[9px] font-bold text-white/70">CREDIT CARD</span>
                  <KhaltiIcon />
                  <FonepayIcon />
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-[#041B12] border border-white/5 rounded-3xl p-8 relative space-y-6 shadow-2xl hover:border-[#00C16A]/20 transition-all duration-300 text-center lg:text-left">
                <div className="w-12 h-12 rounded-2xl bg-[#00C16A] text-[#041B12] font-black text-xl flex items-center justify-center mx-auto lg:mx-0 shadow-[0_0_20px_rgba(0,193,106,0.3)]">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Local Payouts</h3>
                  <p className="text-sm text-white/50 leading-relaxed mb-4">
                    Link your local commercial bank accounts. Receive automatic, daily payouts in NPR directly to your bank account with complete transparency.
                  </p>
                </div>
                {/* Bank note badge mockup */}
                <div className="flex justify-center lg:justify-start gap-1.5 pt-2 border-t border-white/5 text-xs text-[#00C16A] font-bold">
                  <ArrowRightLeft className="w-4 h-4" />
                  <span>Direct NPR Bank Settlement</span>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-[#041B12] border border-white/5 rounded-3xl p-8 relative space-y-6 shadow-2xl hover:border-[#00C16A]/20 transition-all duration-300 text-center lg:text-left">
                <div className="w-12 h-12 rounded-2xl bg-[#00C16A] text-[#041B12] font-black text-xl flex items-center justify-center mx-auto lg:mx-0 shadow-[0_0_20px_rgba(0,193,106,0.3)]">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Tipping</h3>
                  <p className="text-sm text-white/50 leading-relaxed mb-4">
                    Deploy safe tipping pipelines fully compliant with financial and taxation structures across South Asia. Instant verification visuals.
                  </p>
                </div>
                {/* Security verification badge mockup */}
                <div className="flex justify-center lg:justify-start gap-1.5 pt-2 border-t border-white/5 text-xs text-white/60">
                  <Shield className="w-4 h-4 text-[#00C16A]" />
                  <span>Verified Tipping Infrastructure</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ================= PRODUCT SOLUTIONS SECTION ================= */}
      <section id="solutions" className="py-24 bg-[#04160E] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-20 space-y-4">
            <span className="text-xs uppercase text-[#00C16A] font-extrabold tracking-widest bg-[#00C16A]/10 border border-[#00C16A]/20 px-3.5 py-1.5 rounded-full">
              Full Suite Solutions
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-none">
              Modern Solutions For Every Stage
            </h2>
            <p className="text-base md:text-lg text-white/60 font-light">
              We provide creator-themed dashboards, live stream visualizers, and unified link systems to scale your brand.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Tile 1 */}
            <div className="group relative bg-[#041B12] border border-white/5 hover:border-[#00C16A]/25 rounded-[24px] p-8 shadow-2xl flex flex-col md:flex-row gap-6 items-center transition-all duration-300 hover:-translate-y-0.5">
              <div className="flex-1 space-y-4 text-center md:text-left">
                <h3 className="text-2xl font-extrabold text-white">Earn from fan supports</h3>
                <p className="text-sm text-white/50 leading-relaxed">
                  Support tipping matches your style. Empower supporters to thank you for content with frictionless 1-click tips, one-time sponsorships, or recurring monthly subscriptions.
                </p>
                <div className="pt-2">
                  <Link href="/signup" className="inline-flex items-center gap-1 text-xs text-[#00C16A] font-bold group-hover:underline">
                    <span>Explore tipping pages</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
              
              {/* Creator dashboard visual mockup */}
              <div className="w-[180px] shrink-0 bg-white/[0.02] border border-white/10 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-white/40">SUPPORTER FEED</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00C16A]" />
                </div>
                <div className="space-y-2">
                  <div className="p-2 bg-white/5 rounded border border-white/5">
                    <p className="text-[10px] font-bold text-white leading-none">Anup</p>
                    <p className="text-[9px] text-[#00C16A] font-extrabold mt-0.5">Rs. 2,000</p>
                  </div>
                  <div className="p-2 bg-white/5 rounded border border-white/5">
                    <p className="text-[10px] font-bold text-white leading-none">Sneha</p>
                    <p className="text-[9px] text-[#00C16A] font-extrabold mt-0.5">Rs. 500</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tile 2 */}
            <div className="group relative bg-[#041B12] border border-white/5 hover:border-[#00C16A]/25 rounded-[24px] p-8 shadow-2xl flex flex-col md:flex-row gap-6 items-center transition-all duration-300 hover:-translate-y-0.5">
              <div className="flex-1 space-y-4 text-center md:text-left">
                <h3 className="text-2xl font-extrabold text-white">One Link, Everything</h3>
                <p className="text-sm text-white/50 leading-relaxed">
                  Consolidate all digital touchpoints under one beautiful landing page. Host tip buttons, shop integrations, premium memberships, and vlogs at one custom address.
                </p>
                <div className="pt-2">
                  <Link href="/signup" className="inline-flex items-center gap-1 text-xs text-[#00C16A] font-bold group-hover:underline">
                    <span>Create custom link</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
              
              {/* Creator dashboard visual mockup */}
              <div className="w-[180px] shrink-0 bg-white/[0.02] border border-white/10 rounded-2xl p-4 space-y-2">
                <div className="w-10 h-10 rounded-full bg-[#00C16A]/25 border border-[#00C16A]/40 mx-auto flex items-center justify-center text-sm">
                  🔥
                </div>
                <p className="text-center text-[10px] font-bold text-white">sahayog.app/zealan</p>
                <div className="space-y-1.5 pt-1">
                  <div className="w-full py-1.5 rounded bg-[#00C16A] text-[9px] text-center text-[#041B12] font-bold">Support Tipping Page</div>
                  <div className="w-full py-1.5 rounded bg-white/5 text-[9px] text-center text-white/70 border border-white/5">Exclusive Vlog Feed</div>
                  <div className="w-full py-1.5 rounded bg-white/5 text-[9px] text-center text-white/70 border border-white/5">My Tech Setup</div>
                </div>
              </div>
            </div>

            {/* Tile 3 */}
            <div className="group relative bg-[#041B12] border border-white/5 hover:border-[#00C16A]/25 rounded-[24px] p-8 shadow-2xl flex flex-col md:flex-row gap-6 items-center transition-all duration-300 hover:-translate-y-0.5">
              <div className="flex-1 space-y-4 text-center md:text-left">
                <h3 className="text-2xl font-extrabold text-white">Engage with tips LIVE</h3>
                <p className="text-sm text-white/50 leading-relaxed">
                  Turn viewer support into visual content. Launch dynamic alerts, TTS tipping voices, goal trackers, and supporter tickers that render in OBS overlay.
                </p>
                <div className="pt-2">
                  <Link href="/signup" className="inline-flex items-center gap-1 text-xs text-[#00C16A] font-bold group-hover:underline">
                    <span>Configure OBS overlays</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
              
              {/* Creator dashboard visual mockup */}
              <div className="w-[180px] shrink-0 bg-white/[0.02] border border-white/10 rounded-2xl p-4 space-y-3">
                <div className="flex justify-between items-center text-[9px] text-white/40">
                  <span>WIDGET HUD</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                </div>
                <div className="p-2 bg-gradient-to-r from-red-500/10 to-transparent rounded border border-red-500/20 text-center">
                  <p className="text-[8px] text-red-400 font-extrabold uppercase">Alert Activated</p>
                  <p className="text-[10px] font-black text-white mt-0.5">🔥 CatchTheFlow tipped</p>
                </div>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#00C16A] h-full w-[80%]" />
                </div>
              </div>
            </div>

            {/* Tile 4 */}
            <div className="group relative bg-[#041B12] border border-white/5 hover:border-[#00C16A]/25 rounded-[24px] p-8 shadow-2xl flex flex-col md:flex-row gap-6 items-center transition-all duration-300 hover:-translate-y-0.5">
              <div className="flex-1 space-y-4 text-center md:text-left">
                <h3 className="text-2xl font-extrabold text-white">Everywhere, Effortlessly</h3>
                <p className="text-sm text-white/50 leading-relaxed">
                  Integrate Sahayog tipping and widgets on OBS, Streamlabs, YouTube Live, Twitch, TikTok, or your personal website with zero effort.
                </p>
                <div className="pt-2">
                  <Link href="/signup" className="inline-flex items-center gap-1 text-xs text-[#00C16A] font-bold group-hover:underline">
                    <span>Get OBS source links</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
              
              {/* Creator dashboard visual mockup */}
              <div className="w-[180px] shrink-0 bg-white/[0.02] border border-white/10 rounded-2xl p-4 flex flex-col justify-center items-center gap-2">
                <Laptop className="w-8 h-8 text-[#00C16A]" />
                <p className="text-[10px] text-center font-semibold text-white/70">OBS Browser Source Compatible</p>
                <div className="w-full py-1.5 rounded bg-white/5 text-[8px] text-center text-white/50 border border-white/5 select-all font-mono truncate">
                  https://sahayog.app/widget/...
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= PRICING SECTION ================= */}
      <section id="pricing" className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-20 space-y-4">
            <span className="text-xs uppercase text-[#00C16A] font-extrabold tracking-widest bg-[#00C16A]/10 border border-[#00C16A]/20 px-3.5 py-1.5 rounded-full">
              Simple Transparency
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-none">
              Choose the plan that fits you
            </h2>
            <p className="text-base md:text-lg text-white/60 font-light">
              No hidden fees. No upfront charges. Free plan is fully loaded with tips, goals, overlays, and Nepali payouts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            
            {/* Tier 1: Free */}
            <div className="bg-[#041B12] border border-white/5 rounded-3xl p-8 flex flex-col justify-between shadow-2xl hover:border-white/10 transition-all duration-300">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white">Starter Tipping</h3>
                  <p className="text-xs text-white/40 mt-1">Perfect to claim link and start receiving supports</p>
                </div>
                <div className="flex items-baseline gap-1 text-white">
                  <span className="text-5xl font-black">0%</span>
                  <span className="text-sm font-semibold text-white/50">platform fee option</span>
                </div>
                
                <hr className="border-white/5" />
                
                <ul className="space-y-3 text-sm text-white/80">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#00C16A]" />
                    Custom sahayog.app tipping page
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#00C16A]" />
                    Accept tips via Khalti, eSewa, Fonepay
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#00C16A]" />
                    Basic OBS Live Stream Alert overlays
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#00C16A]" />
                    Daily direct bank payouts (NPR)
                  </li>
                </ul>
              </div>

              <Link 
                href="/signup" 
                className="w-full text-center py-4 rounded-xl border border-white/10 bg-white/[0.01] hover:bg-white/[0.05] text-white font-bold text-sm tracking-wide mt-8 transition-all duration-300"
              >
                Claim Your Free Link
              </Link>
            </div>

            {/* Tier 2: Professional */}
            <div className="bg-[#041B12] border border-[#00C16A]/25 rounded-3xl p-8 flex flex-col justify-between shadow-2xl shadow-[#00C16A]/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 px-4 py-1.5 bg-[#00C16A] text-[#041B12] font-black text-[10px] uppercase tracking-wider rounded-bl-xl">
                Most Popular
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white">Pro Creator</h3>
                  <p className="text-xs text-white/40 mt-1">Unlock memberships, premium assets, & complete tools</p>
                </div>
                <div className="flex items-baseline gap-1 text-white">
                  <span className="text-5xl font-black">5%</span>
                  <span className="text-sm font-semibold text-white/50">on membership earnings</span>
                </div>
                
                <hr className="border-white/5" />
                
                <ul className="space-y-3 text-sm text-white/80">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#00C16A]" />
                    Everything in Starter, plus:
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#00C16A]" />
                    Pledge-based monthly membership tiers
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#00C16A]" />
                    Interactive TTS (Text-to-Speech) Tipping
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#00C16A]" />
                    Lock exclusive posts, video vlogs, & files
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#00C16A]" />
                    Advanced progress and goal overlay widgets
                  </li>
                </ul>
              </div>

              <Link 
                href="/signup" 
                className="w-full text-center py-4 rounded-xl bg-gradient-to-r from-[#00C16A] to-[#10B981] text-[#041B12] font-black text-sm tracking-wide mt-8 transition-all duration-300 shadow-[0_0_20px_rgba(0,193,106,0.2)] hover:shadow-[0_0_30px_rgba(0,193,106,0.4)]"
              >
                Upgrade to Pro Creator
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ================= FAQ SECTION ================= */}
      <section id="faq" className="py-24 bg-[#04160E] relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <HelpCircle className="w-10 h-10 text-[#00C16A] mx-auto" />
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-none">
              Frequently Asked Questions
            </h2>
            <p className="text-base text-white/50">
              Got questions about Sahayog payouts, setups, or alert settings? We've got answers.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div 
                key={i} 
                className="bg-[#041B12] border border-white/5 rounded-2xl overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className="font-bold text-white text-base md:text-lg">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-white/40 transition-transform duration-300 ${expandedFaq === i ? "rotate-180 text-[#00C16A]" : ""}`} />
                </button>
                
                {expandedFaq === i && (
                  <div className="px-6 pb-6 pt-1 text-sm md:text-base text-white/60 leading-relaxed border-t border-white/5 animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA SECTION ================= */}
      <section className="py-28 relative overflow-hidden text-center">
        {/* Glow Background mesh */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00C16A]/10 rounded-full blur-[140px] pointer-events-none" />
        
        {/* Animated Glowing rings background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full border border-[#00C16A]/15 animate-pulse pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full border border-[#00C16A]/5 pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 relative z-10 space-y-8">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00C16A]/10 border border-[#00C16A]/20 text-[#00C16A] font-extrabold text-xs tracking-wider uppercase">
            <Zap className="w-3.5 h-3.5 fill-[#00C16A]" />
            Start Growing Today
          </span>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-none max-w-3xl mx-auto">
            Build a supporter-driven income with Sahayog
          </h2>

          <p className="text-base sm:text-lg md:text-xl text-[#EEF4F0]/80 leading-relaxed font-light max-w-2xl mx-auto">
            All the tools you need to engage, earn, reward and grow; built for creators and streamers of all audience sizes and niches.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link 
              href="/signup" 
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#00C16A] to-[#10B981] text-[#041B12] font-black text-base shadow-[0_0_30px_rgba(0,193,106,0.35)] hover:shadow-[0_0_40px_rgba(0,193,106,0.55)] hover:-translate-y-0.5 transition-all duration-300"
            >
              Join Sahayog now
              <ArrowRight className="w-4 h-4" />
            </Link>
            
            <Link 
              href="/signup" 
              className="flex items-center justify-center px-8 py-4 rounded-xl border border-white/10 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.05] text-white font-bold text-base transition-all duration-300"
            >
              Start Creating
            </Link>
          </div>
        </div>
      </section>

      {/* ================= PREMIUM FOOTER ================= */}
      <footer className="relative bg-[#020D08] border-t border-white/5 overflow-hidden">
        {/* Faded background watermark */}
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 text-center select-none pointer-events-none opacity-[0.02] z-0">
          <span className="text-[12rem] sm:text-[18rem] md:text-[24rem] font-black tracking-tighter uppercase leading-none">
            Sahayog
          </span>
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-20 pb-12 relative z-10 grid grid-cols-1 md:grid-cols-12 gap-12">
          
          {/* Footer Left */}
          <div className="md:col-span-4 space-y-6">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#00C16A] to-[#10B981] flex items-center justify-center shadow-[0_0_15px_rgba(0,193,106,0.3)]">
                <Play className="w-4 h-4 text-[#041B12] fill-[#041B12] ml-0.5" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">Sahayog</span>
            </Link>
            <p className="text-sm text-white/50 leading-relaxed">
              Sahayog is the premium direct creator tipping and fan engagement platform tailored for live streamers and digital creators across Nepal and South Asia. Build relationships, trigger live notifications, and settle local funds daily.
            </p>
            {/* Social Icons */}
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 hover:border-[#00C16A]/30 hover:bg-[#00C16A]/10 text-white/70 hover:text-[#00C16A] flex items-center justify-center transition-all duration-300">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 hover:border-[#00C16A]/30 hover:bg-[#00C16A]/10 text-white/70 hover:text-[#00C16A] flex items-center justify-center transition-all duration-300">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 hover:border-[#00C16A]/30 hover:bg-[#00C16A]/10 text-white/70 hover:text-[#00C16A] flex items-center justify-center transition-all duration-300">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 hover:border-[#00C16A]/30 hover:bg-[#00C16A]/10 text-white/70 hover:text-[#00C16A] flex items-center justify-center transition-all duration-300">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
                </svg>
              </a>
            </div>
          </div>

          {/* Footer Center - Solutions links */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="font-extrabold text-sm text-white uppercase tracking-wider">Solutions</h4>
            <ul className="space-y-2.5 text-sm text-white/50">
              <li><Link href="#features" className="hover:text-white transition-colors">Tipping Pages</Link></li>
              <li><Link href="#features" className="hover:text-white transition-colors">Live Overlay HUD</Link></li>
              <li><Link href="#features" className="hover:text-white transition-colors">Goal Trackers</Link></li>
              <li><Link href="#features" className="hover:text-white transition-colors">Text-to-Speech</Link></li>
            </ul>
          </div>

          {/* Footer Center - Company links */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="font-extrabold text-sm text-white uppercase tracking-wider">Company</h4>
            <ul className="space-y-2.5 text-sm text-white/50">
              <li><Link href="#creators" className="hover:text-white transition-colors">Creators Community</Link></li>
              <li><Link href="#pricing" className="hover:text-white transition-colors">Pricing Structure</Link></li>
              <li><Link href="#faq" className="hover:text-white transition-colors">Support & FAQs</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Footer Right - Contact Info */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="font-extrabold text-sm text-white uppercase tracking-wider">Contact & Office</h4>
            <ul className="space-y-3 text-sm text-white/50">
              <li className="flex items-center gap-2">
                <Send className="w-4 h-4 text-[#00C16A]" />
                <a href="mailto:info@sahayog.com" className="hover:text-white transition-colors">info@sahayog.com</a>
              </li>
              <li className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#00C16A]" />
                <span>982-8720687 (Office Hours)</span>
              </li>
              <li className="text-xs text-white/40 pt-1 leading-relaxed">
                Meta Stream Incorporated Pvt. Ltd.<br />
                Kathmandu, Nepal
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="max-w-7xl mx-auto px-6 py-6 border-t border-white/5 relative z-10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/40">
          <span>© 2026 Sahayog | Meta Stream Incorporated Pvt. Ltd. All rights reserved.</span>
          <span className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <span>•</span>
            <a href="#" className="hover:text-white transition-colors">Privacy Agreement</a>
          </span>
        </div>
      </footer>
    </div>
  );
}
