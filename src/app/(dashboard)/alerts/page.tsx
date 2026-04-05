"use client";

import { useState, useEffect, useRef } from "react";
import { Copy, EyeOff, Upload, Volume2, Play, LayoutTemplate, Square, Loader2, Save, Send, Coins, CheckCircle2 } from "lucide-react";
import { useSession } from "next-auth/react";

export default function AlertsPage() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("alertbox");

  const imageInputRef = useRef<HTMLInputElement>(null);
  const soundInputRef = useRef<HTMLInputElement>(null);
  const [baseUrl, setBaseUrl] = useState("http://localhost:3000");
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setBaseUrl(window.location.origin);
    }
  }, []);

  const [formData, setFormData] = useState({
    name: "Base",
    layout: "IMAGE_TOP" as const,
    media: { 
       imageUri: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJocXRhN3p3eXoyN3p3eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o7TKMGpxx8A79c5EY/giphy.gif", 
       imageScale: 1.0,
       soundUri: "https://www.myinstants.com/media/sounds/mlg-airhorn.mp3" 
    },
    settings: { duration: 10, delay: 4, soundVolume: 80 },
    typography: { 
      messageTemplate: "{tipper} tipped Rs.{amount}!!", 
      fontSize: 48, 
      messageFontSize: 24,
      fontWeight: 900, 
      fontFamily: "Inter",
      color: "#10b981" 
    },
    animations: { inAnimation: "SlideInTop", outAnimation: "SlideOutTop", textAnimation: "pulse" },
    tts: { enabled: false, voice: "Bengali Dai", volume: 50 },
  });

  const fonts = ["Inter", "Poppins", "Roboto", "Montserrat", "Playfair Display", "Bungee", "Anton", "Rubik"];

  // Fetch from DB
  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/profile")
        .then(res => res.json())
        .then(data => {
          if (data?.username) setUsername(data.username);
        });

      fetch("/api/alerts/config")
        .then(res => res.json())
        .then(data => {
          if (data && !data.error) {
            setFormData(prev => ({ ...prev, ...data }));
          }
        })
        .finally(() => setIsLoading(false));
    } else if (status === "unauthenticated") {
        setIsLoading(false);
    }
  }, [status]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/alerts/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) alert("Alert Box settings saved successfully!");
    } catch (e) {
      alert("Failed to save settings.");
    } finally {
      setIsSaving(false);
    }
  };

  const uploadMedia = async (file: File, type: "image" | "sound") => {
    const data = new FormData();
    data.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: data });
      const json = await res.json();
      if (json.success) {
        if (type === "image") setFormData({ ...formData, media: { ...formData.media, imageUri: json.url } });
        if (type === "sound") setFormData({ ...formData, media: { ...formData.media, soundUri: json.url } });
      }
    } catch (e) {
       alert("Media upload failed.");
    }
  };

  const triggerTestAlert = async () => {
    try {
      await fetch("/api/transactions/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username,
          supporterName: "John Wick",
          amount: 500,
          message: "This looks incredible! 🚀 Sahayog is the best!!",
        })
      });
      alert("Test alert triggered! Check your OBS/Preview.");
    } catch (err) {
      alert("Failed to trigger test alert.");
    }
  };

  if (isLoading) return <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="flex flex-col gap-8 max-w-[1600px] mx-auto pb-20">
      {/* Real-time Preview Import */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;900&family=Poppins:wght@400;900&family=Roboto:wght@400;900&family=Montserrat:wght@400;900&family=Bungee&family=Anton&family=Rubik:wght@900&display=swap');
      ` }} />

      {/* Header */}
      <div className="flex justify-between items-center bg-card border border-border p-6 rounded-3xl shadow-sm">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
              <LayoutTemplate className="w-6 h-6 text-primary" />
           </div>
           <div>
              <h1 className="text-xl font-bold text-foreground">Alert Studio</h1>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                 Customize your stream alerts in real-time
              </p>
           </div>
        </div>
        <button 
           onClick={handleSave} 
           disabled={isSaving}
           className="bg-primary hover:bg-primary/90 text-primary-foreground font-black px-8 py-3 rounded-2xl flex items-center gap-2 shadow-lg shadow-primary/20 transition-all disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Configuration
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Settings Column (60%) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Widget URL Section */}
          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col gap-4 text-left">
            <h2 className="text-sm font-black uppercase tracking-widest text-muted-foreground text-left">OBS Widget URL</h2>
            <div className="flex items-center gap-2 bg-background border border-border rounded-xl px-4 py-3 text-sm group">
               <span className="truncate flex-1 text-muted-foreground">{baseUrl}/overlay?username={username}</span>
               <Copy onClick={() => { navigator.clipboard.writeText(`${baseUrl}/overlay?username=${username}`); alert("URL Copied!"); }} className="w-4 h-4 ml-auto hover:text-primary cursor-pointer transition-colors" />
            </div>
            <button 
               onClick={() => window.open(`/overlay?username=${username}`, "Overlay", "width=1280,height=720")}
               className="w-full bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white font-black py-3 rounded-xl transition-all"
            >
              Launch Standalone
            </button>
          </div>

          <div className="bg-card border border-border rounded-3xl p-8 flex flex-col gap-8 shadow-sm text-left">
            <div className="flex items-center gap-3 border-b border-border pb-4 w-full">
               <Square className="w-5 h-5 text-primary" />
               <h2 className="text-lg font-black uppercase tracking-tight">Appearance</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="flex flex-col gap-2 text-left">
                 <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Alert GIF/Image</label>
                 <input type="file" className="hidden" ref={imageInputRef} onChange={(e) => e.target.files?.[0] && uploadMedia(e.target.files[0], "image")} />
                 <div className="flex flex-col gap-3">
                    <div className="w-full aspect-square bg-slate-100 rounded-3xl border-2 border-dashed border-border flex items-center justify-center overflow-hidden cursor-pointer group hover:border-primary transition-all" onClick={() => imageInputRef.current?.click()}>
                       {formData.media.imageUri ? (
                          <img src={formData.media.imageUri} className="w-full h-full object-contain" alt="Preview GIF" />
                       ) : (
                          <div className="flex flex-col items-center gap-2 text-muted-foreground">
                             <Upload className="w-8 h-8 group-hover:text-primary" />
                             <span className="text-[10px] font-black uppercase italic">Upload GIF</span>
                          </div>
                       )}
                    </div>
                    <p className="text-[10px] text-muted-foreground text-center font-bold px-4">Transparent GIF or 512px PNG</p>
                    
                    <div className="flex flex-col gap-2 pt-2 border-t border-border/50">
                       <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-muted-foreground uppercase">GIF Scale</span>
                          <span className="text-[10px] font-black text-primary">{Math.round(formData.media.imageScale * 100)}%</span>
                       </div>
                       <input 
                         type="range" 
                         min="0.5" 
                         max="2.0" 
                         step="0.1"
                         value={formData.media.imageScale}
                         onChange={(e) => setFormData({...formData, media: {...formData.media, imageScale: parseFloat(e.target.value)}})}
                         className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary"
                       />
                    </div>
                 </div>
               </div>

               <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-4">
                     <label className="text-xs font-black uppercase tracking-widest text-muted-foreground text-left">Typography</label>
                     
                     <div className="flex flex-col gap-2 text-left">
                        <span className="text-[10px] font-bold text-muted-foreground">Font Family</span>
                        <select 
                          value={formData.typography.fontFamily}
                          onChange={(e) => setFormData({...formData, typography: {...formData.typography, fontFamily: e.target.value}})}
                          className="w-full bg-background border border-border rounded-xl p-3 text-sm font-black focus:outline-none"
                        >
                          {fonts.map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                     </div>

                     <div className="flex flex-col gap-2 text-left">
                        <div className="flex justify-between items-center">
                           <span className="text-[10px] font-bold text-muted-foreground">Font Size</span>
                           <span className="text-[10px] font-black text-primary">{formData.typography.fontSize}px</span>
                        </div>
                        <input 
                          type="range" 
                          min="12" 
                          max="120" 
                          value={formData.typography.fontSize}
                          onChange={(e) => setFormData({...formData, typography: {...formData.typography, fontSize: parseInt(e.target.value)}})}
                          className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                     </div>

                     <div className="flex flex-col gap-2 text-left">
                        <span className="text-[10px] font-bold text-muted-foreground">Text Color</span>
                        <div className="flex items-center gap-3 bg-background border border-border p-2 rounded-xl">
                          <input 
                             type="color" 
                             value={formData.typography.color}
                             onChange={(e) => setFormData({...formData, typography: {...formData.typography, color: e.target.value}})}
                             className="w-10 h-10 rounded-lg border-2 border-border cursor-pointer bg-transparent overflow-hidden" 
                          />
                          <span className="text-xs font-black uppercase italic">{formData.typography.color}</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <div className="flex flex-col gap-4 pt-4 border-t border-border">
               <label className="text-xs font-black uppercase tracking-widest text-muted-foreground text-left">Message Configuration</label>
               <div className="flex flex-col gap-2 text-left">
                  <span className="text-[10px] font-bold text-muted-foreground">Template</span>
                  <input 
                    type="text" 
                    value={formData.typography.messageTemplate}
                    onChange={(e) => setFormData({ ...formData, typography: { ...formData.typography, messageTemplate: e.target.value } })}
                    className="w-full bg-background border border-border rounded-xl p-3 text-sm font-black focus:outline-none" 
                  />
                  <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-black italic">Tokens: {"{tipper}"}, {"{amount}"}</p>
               </div>

               <div className="flex flex-col gap-2 mt-2">
                  <div className="flex justify-between items-center">
                     <span className="text-[10px] font-bold text-muted-foreground uppercase">Message Font Size</span>
                     <span className="text-[10px] font-black text-primary">{formData.typography.messageFontSize}px</span>
                  </div>
                  <input 
                    type="range" 
                    min="12" 
                    max="48" 
                    value={formData.typography.messageFontSize}
                    onChange={(e) => setFormData({...formData, typography: {...formData.typography, messageFontSize: parseInt(e.target.value)}})}
                    className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
               </div>
            </div>

            <div className="flex flex-col gap-6 pt-4 border-t border-border text-left">
               <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Audio</label>
               <input type="file" className="hidden" ref={soundInputRef} onChange={(e) => e.target.files?.[0] && uploadMedia(e.target.files[0], "sound")} />
               <div className="flex items-center gap-3">
                  <button 
                    onClick={() => soundInputRef.current?.click()}
                    className="flex-1 bg-background border border-border px-4 py-3 rounded-xl flex items-center gap-3 hover:bg-muted/50 transition-colors"
                  >
                     <Volume2 className="w-4 h-4 text-primary" />
                     <span className="text-xs font-black truncate">{formData.media.soundUri ? "Custom Audio Set" : "Upload Sound..."}</span>
                  </button>
                  <button 
                    disabled={!formData.media.soundUri}
                    onClick={() => { const audio = new Audio(formData.media.soundUri); audio.volume = formData.settings.soundVolume/100; audio.play(); }}
                    className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center hover:bg-slate-200 transition-all disabled:opacity-50"
                  >
                     <Play className="w-4 h-4" />
                  </button>
               </div>
            </div>
          </div>
        </div>

        {/* Right Preview Column (40%) */}
        <div className="lg:col-span-5 flex flex-col gap-8 sticky top-24">
           
           <div className="bg-slate-950 rounded-[40px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.5)] border-[10px] border-slate-900 group ml-auto w-full">
              {/* Header of Preview */}
              <div className="p-5 bg-slate-900 flex items-center justify-between">
                 <div className="flex items-center gap-3 text-left">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></div>
                    <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 italic">Live Stream Preview</span>
                 </div>
                 <button 
                   onClick={triggerTestAlert}
                   className="bg-primary px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest text-white hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/30"
                 >
                   Trigger Test Pop-up
                 </button>
              </div>

              {/* The Render Surface */}
              <div className="relative aspect-video bg-[#0c0c0c] flex flex-col items-center justify-center overflow-hidden">
                 
                 {/* 1. MOCK HALL OF FAME */}
                 <div className="absolute bottom-4 left-4 flex flex-col gap-1.5 w-[180px] opacity-40 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-2 mb-1 px-3">
                       <div className="w-1 h-1 rounded-full bg-primary animate-pulse"></div>
                       <span className="text-[6px] font-black uppercase tracking-[0.4em] text-white/40 italic">Recent Tips</span>
                    </div>
                    {[1, 2].map(i => (
                       <div key={i} className="bg-white/5 backdrop-blur-xl border border-white/5 rounded-lg py-1.5 px-3 flex items-center justify-between">
                          <span className="font-black text-white text-[8px] uppercase tracking-tighter">Supporter #{i}</span>
                          <span className="font-black text-[#d4af37] text-[10px]">Rs. 500</span>
                       </div>
                    ))}
                 </div>

                 {/* 2. THE DYNAMIC ALERT RENDERING (Pixel-Perfect with Overlay) */}
                 <div className="flex flex-col items-center gap-6 py-6 scale-90 sm:scale-100 transition-transform">
                    {/* Media Area */}
                    <div className="relative group/media">
                       {/* High-End Glow Effect */}
                       <div className="absolute inset-0 bg-primary/30 blur-[60px] rounded-full animate-pulse transition-all group-hover/media:bg-primary/40"></div>
                       <div className="relative z-10 w-[200px] h-[200px] rounded-[40px] overflow-hidden border-[3px] border-white/30 bg-slate-900/40 backdrop-blur-md flex items-center justify-center shadow-[0_32px_60px_-15px_rgba(0,0,0,0.5)] transition-transform group-hover/media:scale-105">
                          {formData.media.imageUri ? (
                            <img 
                               src={formData.media.imageUri} 
                               className="w-full h-full object-contain drop-shadow-2xl transition-transform" 
                               style={{ transform: `scale(${formData.media.imageScale})` }}
                               alt="Alert GIF" 
                            />
                          ) : (
                            <Coins className="w-16 h-16 text-primary transition-transform" style={{ transform: `scale(${formData.media.imageScale})` }} />
                          )}
                       </div>
                    </div>

                    {/* Text Area */}
                    <div className="flex flex-col items-center text-center gap-4 max-w-[90%]">
                       <div 
                         className="font-black tracking-tighter drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)] leading-[0.9]"
                         style={{ 
                            fontSize: `${(formData.typography.fontSize || 48) * 0.7}px`, 
                            fontFamily: formData.typography.fontFamily,
                            textShadow: `0 4px 0 rgba(0,0,0,0.2), 0 0 20px ${formData.typography.color}40`,
                            color: '#ffffff'
                         }}
                       >
                          {formData.typography.messageTemplate.split(/(Rs\.\d+)/g).map((part, i) => (
                            <span key={i} style={part.startsWith('Rs.') ? { 
                               color: formData.typography.color,
                               textShadow: `0 0 30px ${formData.typography.color}60`
                            } : {}}>
                               {part.replace("{tipper}", "John Wick").replace("{amount}", "500")}
                            </span>
                          ))}
                       </div>

                       {/* Message Bubble - Premium Glassmorphism */}
                       <div className="mt-2 bg-white/[0.08] backdrop-blur-3xl border border-white/10 p-[10px] rounded-[28px] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.4)] transform hover:scale-105 transition-all">
                          <p 
                             className="text-white font-black italic tracking-tight leading-relaxed"
                             style={{ fontSize: (formData.typography.messageFontSize || 14) * 0.7 + 'px' }}
                          >
                             <span className="text-primary/80 mr-2">"</span>
                             This looks incredible! 🚀 Sahayog is the best!!
                             <span className="text-primary/80 ml-2">"</span>
                          </p>
                          <div className="mt-3 flex justify-center">
                             <div className="h-1 w-12 bg-primary/30 rounded-full"></div>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Canvas Overlay Grid (Subtle) */}
                 <div className="absolute inset-0 pointer-events-none opacity-[0.05]" style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 0)", backgroundSize: "40px 40px" }}></div>
              </div>

              {/* Status Footer */}
              <div className="p-5 bg-slate-900 flex items-center justify-center gap-10 border-t border-white/5">
                 <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-500"></div>
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Duration</span>
                    <span className="text-xs font-black text-white">{formData.settings.duration}s</span>
                 </div>
                 <div className="w-px h-5 bg-white/10"></div>
                 <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-500"></div>
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Typography</span>
                    <span className="text-xs font-black text-white">{formData.typography.fontFamily}</span>
                 </div>
                 <div className="w-px h-5 bg-white/10"></div>
                 <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-500"></div>
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Volume</span>
                    <span className="text-xs font-black text-white">{formData.settings.soundVolume}%</span>
                 </div>
              </div>
           </div>

           <div className="bg-indigo-50/50 border border-indigo-100 rounded-3xl p-6 flex items-start gap-4">
              <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center shrink-0">
                 <CheckCircle2 className="w-5 h-5 text-indigo-600" />
              </div>
              <p className="text-xs text-indigo-900 leading-relaxed font-bold italic">
                 <strong>Artist Tip:</strong> Use high-quality loopable GIFs for your alerts. When choosing a font like <span className="underline decoration-indigo-300">Bungee</span> or <span className="underline decoration-indigo-300">Anton</span>, it's best to keep the font weight heavy for better readability on small screens.
              </p>
           </div>
        </div>

      </div>
    </div>
  );
}
