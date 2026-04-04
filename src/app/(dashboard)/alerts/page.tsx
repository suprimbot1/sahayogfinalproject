"use client";

import { useState, useEffect, useRef } from "react";
import { Copy, EyeOff, Upload, Volume2, VolumeX, Trash2, Play, LayoutTemplate, Square, SquareSplitVertical, StretchHorizontal, Loader2, Save, Send } from "lucide-react";
import { useSession } from "next-auth/react";

export default function AlertsPage() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("alertbox");

  const imageInputRef = useRef<HTMLInputElement>(null);
  const soundInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "Base",
    layout: "IMAGE_TOP",
    media: { 
       imageUri: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJocXRhN3p3eXoyN3p3eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o7TKMGpxx8A79c5EY/giphy.gif", 
       soundUri: "https://www.myinstants.com/media/sounds/mlg-airhorn.mp3" 
    },
    settings: { duration: 10, delay: 4, soundVolume: 80 },
    typography: { messageTemplate: "{tipper} tipped Rs.{amount}!!", fontSize: 48, fontWeight: 700, color: "#ffffff" },
    animations: { inAnimation: "SlideInTop", outAnimation: "SlideOutTop", textAnimation: "pulse" },
    tts: { enabled: false, voice: "Bengali Dai", volume: 50 },
  });

  // Fetch from DB
  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/alerts/config")
        .then(res => res.json())
        .then(data => {
          if (!data.error) {
            setFormData(data);
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
      await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: session?.user?.email?.split("@")[0], // Just to find user
          supporterName: "Test Tipper",
          amount: 500,
          message: "Check out my custom alert GIF! 🚀",
        })
      });
      alert("Test alert sent to OBS!");
    } catch (err) {
      alert("Failed to send test alert.");
    }
  };

  if (isLoading) return <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="flex flex-col gap-8 max-w-[1400px]">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-xl font-bold text-foreground">Alert Box</h1>
          <p className="text-sm text-muted-foreground">
            Configure your alert box to enhance your streaming experience and interact with your supporters.
          </p>
        </div>
        <button 
           onClick={handleSave} 
           disabled={isSaving}
           className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-6 py-2 rounded-full flex items-center gap-2 transition-all disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Settings
        </button>
      </div>

      {/* Widget URL Section */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-foreground">Widget URL</label>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1 flex items-center gap-2 bg-background border border-border rounded-lg px-4 py-3 text-sm text-muted-foreground w-full">
            <span className="truncate flex-1">http://localhost:3000/overlay</span>
            <Copy onClick={() => { navigator.clipboard.writeText("http://localhost:3000/overlay"); alert("Copied!"); }} className="w-4 h-4 ml-auto hover:text-foreground cursor-pointer shrink-0" />
            <EyeOff className="w-4 h-4 hover:text-foreground cursor-pointer shrink-0 ml-1" />
          </div>
          <button 
             onClick={triggerTestAlert}
             className="bg-white border border-border hover:bg-muted text-foreground font-bold px-6 py-2.5 rounded-full flex items-center gap-2 transition-colors"
          >
             <Send className="w-4 h-4" />
             Test Alert
          </button>
          <button 
             onClick={() => window.open("/overlay", "Overlay", "width=1280,height=720")}
             className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-6 py-2.5 rounded-full transition-colors"
          >
            Launch Alert Box
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Use the URL as Browser Source in OBS Studio. Recommended Configuration: 1920x1080.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-8 border-b border-border/50">
        <button 
          onClick={() => setActiveTab("alertbox")} 
          className={`pb-3 text-sm font-semibold relative transition-colors ${activeTab === "alertbox" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
        >
          Alert Box
          {activeTab === "alertbox" && <div className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-primary"></div>}
        </button>
        <button 
          onClick={() => setActiveTab("variations")} 
          className={`pb-3 text-sm font-semibold relative transition-colors ${activeTab === "variations" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
        >
          Variations
          {activeTab === "variations" && <div className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-primary"></div>}
        </button>
      </div>

      {/* Main Grid: Left Settings, Right Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Settings Column */}
        <div className="lg:col-span-7 flex flex-col gap-6 pb-20">
          
          <div className="bg-card border border-border rounded-2xl p-8 flex flex-col gap-8 shadow-sm">
            <h2 className="text-lg font-bold">General Settings</h2>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-foreground">Alert Name</label>
              <input 
                type="text" 
                value={formData.name} 
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-background border border-border rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary" 
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-foreground">Image/GIF</label>
              <input type="file" className="hidden" ref={imageInputRef} onChange={(e) => e.target.files?.[0] && uploadMedia(e.target.files[0], "image")} />
              <div className="flex items-center gap-4 border border-border rounded-lg p-2 bg-background group cursor-pointer" onClick={() => imageInputRef.current?.click()}>
                <div className="w-12 h-12 bg-yellow-50 rounded-md flex items-center justify-center shrink-0 border border-yellow-200 overflow-hidden">
                  {formData.media.imageUri ? <img src={formData.media.imageUri} className="w-full h-full object-cover" /> : <span className="text-xl">⭐</span>}
                </div>
                <div className="flex-1 truncate text-xs text-muted-foreground bg-muted/40 px-3 py-2.5 rounded">
                  {formData.media.imageUri || "Upload custom Alert GIF..."}
                </div>
                <Upload className="w-5 h-5 text-muted-foreground mr-2 group-hover:text-primary transition-colors" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-foreground">Message Template</label>
              <input 
                 type="text" 
                 value={formData.typography.messageTemplate}
                 onChange={(e) => setFormData({ ...formData, typography: { ...formData.typography, messageTemplate: e.target.value } })}
                 className="w-full bg-background border border-border rounded-lg p-3 text-sm font-black focus:outline-none focus:ring-1 focus:ring-primary" 
              />
              <p className="text-xs text-muted-foreground font-medium italic mt-1">
                Tokens: {"{tipper}"} for name, {"{amount}"} for donation value.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-3">
                <label className="text-sm font-semibold text-foreground">Duration ({formData.settings.duration}s)</label>
                <input 
                  type="range" min="3" max="30" 
                  value={formData.settings.duration}
                  onChange={(e) => setFormData({...formData, settings: {...formData.settings, duration: Number(e.target.value)}})}
                  className="w-full h-1 bg-muted rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:rounded-full cursor-pointer" 
                />
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-sm font-semibold text-foreground">Alert Delay ({formData.settings.delay}s)</label>
                <input 
                   type="range" min="0" max="15" 
                   value={formData.settings.delay}
                   onChange={(e) => setFormData({...formData, settings: {...formData.settings, delay: Number(e.target.value)}})}
                   className="w-full h-1 bg-muted rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:rounded-full cursor-pointer" 
                />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-8 flex flex-col gap-8 shadow-sm">
            <h2 className="text-lg font-bold">Audio & Sound</h2>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-foreground">Sound File (MP3)</label>
              <input type="file" className="hidden" ref={soundInputRef} onChange={(e) => e.target.files?.[0] && uploadMedia(e.target.files[0], "sound")} />
              <div className="flex items-center gap-4 border border-border rounded-lg p-2 bg-background group cursor-pointer" onClick={() => soundInputRef.current?.click()}>
                <div className="w-12 h-12 bg-blue-50 rounded-md flex items-center justify-center shrink-0 border border-blue-200">
                  <Volume2 className="text-blue-500 w-5 h-5" />
                </div>
                <div className="flex-1 truncate text-xs text-muted-foreground bg-muted/40 px-3 py-2.5 rounded">
                  {formData.media.soundUri || "Upload custom MP3 sound..."}
                </div>
                <Upload className="w-5 h-5 text-muted-foreground mr-2 group-hover:text-primary transition-colors" />
              </div>
            </div>
            
            <div className="flex flex-col gap-3">
              <label className="text-sm font-semibold text-foreground">Sound Volume ({formData.settings.soundVolume}%)</label>
              <input 
                type="range" min="0" max="100" 
                value={formData.settings.soundVolume}
                onChange={(e) => setFormData({...formData, settings: {...formData.settings, soundVolume: Number(e.target.value)}})}
                className="w-full h-1 bg-muted rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:rounded-full cursor-pointer" 
              />
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-8 flex flex-col gap-8 shadow-sm">
             <h2 className="text-lg font-bold">Typography</h2>
             <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-foreground">Font Size ({formData.typography.fontSize}px)</label>
                  <input 
                     type="number" 
                     value={formData.typography.fontSize}
                     onChange={(e) => setFormData({...formData, typography: {...formData.typography, fontSize: Number(e.target.value)}})}
                     className="w-full bg-background border border-border rounded-lg p-3 text-sm focus:outline-none" 
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-foreground">Message Color</label>
                  <div className="flex items-center gap-3">
                    <input 
                       type="color" 
                       value={formData.typography.color}
                       onChange={(e) => setFormData({...formData, typography: {...formData.typography, color: e.target.value}})}
                       className="w-12 h-12 rounded-lg border-2 border-border cursor-pointer bg-transparent overflow-hidden" 
                    />
                    <span className="text-sm font-mono font-bold uppercase">{formData.typography.color}</span>
                  </div>
                </div>
             </div>
          </div>

        </div>

        {/* Right Preview Column */}
        <div className="lg:col-span-5 flex flex-col gap-6 sticky top-24 h-fit">
          <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-xl flex flex-col">
            <div className="p-5 bg-background border-b border-border flex items-center justify-between">
              <h3 className="font-bold text-sm">Real-time Preview</h3>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Active</span>
              </div>
            </div>
            
            <div className="bg-[#1a1a1a] h-[450px] flex items-center justify-center relative p-8">
                {/* Mock Alert Preview */}
                <div className="flex flex-col items-center text-center gap-4 animate-pulse">
                   <img 
                      src={formData.media.imageUri || "https://media.giphy.com/media/3o7TKMGpxx8A79c5EY/giphy.gif"} 
                      className="w-48 h-48 object-contain rounded-2xl shadow-2xl" 
                   />
                   <div className="flex flex-col">
                      <span className="text-xs font-black tracking-widest text-primary mb-1 uppercase">Sample Alert</span>
                      <h3 
                         className="font-bold leading-tight"
                         style={{ fontSize: formData.typography.fontSize / 1.5, color: formData.typography.color }}
                      >
                         John Doe tipped Rs. 500!
                      </h3>
                   </div>
                </div>
            </div>

            <div className="p-6 bg-white flex flex-col gap-4">
              <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                This is a live preview of how your alert will appear on stream. Click "Test Alert" above to trigger a full scale test in your OBS window.
              </p>
              <div className="pt-4 border-t border-border flex justify-between items-center">
                 <div className="flex flex-col">
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Layout</span>
                    <span className="text-sm font-bold">{formData.layout}</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <button 
                      onClick={() => { const audio = new Audio(formData.media.soundUri); audio.volume = formData.settings.soundVolume/100; audio.play(); }}
                      className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                    >
                       <Play className="w-4 h-4" />
                    </button>
                 </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
