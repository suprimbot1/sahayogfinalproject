"use client";

import { useState, useEffect, useRef } from "react";
import { Copy, Upload, Trash2, Loader2, Save, ExternalLink, PlusCircle, Globe, MonitorPlay as Youtube, Landmark } from "lucide-react";
import { useSession } from "next-auth/react";

export default function TipsConfigurationPage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState("setup");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [recentTips, setRecentTips] = useState<any[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);
  const [baseUrl, setBaseUrl] = useState("sah-ayog.app");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setBaseUrl(window.location.host); // This will be "sahayoghost.vercel.app" or "localhost:3000"
    }
  }, []);

  const [formData, setFormData] = useState({
    username: "",
    about: "",
    slogan: "",
    coverImage: "",
    profileImage: "",
    settings: {
      latestSupportersCount: 10,
      minTipAmount: 50,
      maxMessageLength: 99,
      profanityFilterEnabled: false,
      customBadWords: [] as string[],
    },
    socialLinks: [] as { platform: string; url: string }[],
    payoutDetails: {
      method: "KHALTI",
      accountNumber: "",
      accountName: ""
    }
  });

  const [badWordInput, setBadWordInput] = useState("");
  const [socialInput, setSocialInput] = useState({ platform: "Youtube", url: "" });

  useEffect(() => {
    if (status === "authenticated") {
      // 1. Fetch Profile
      fetch("/api/profile")
        .then((res) => res.json())
        .then((data) => {
          if (!data.error) {
            setFormData({
              username: data.username || "",
              about: data.about || "",
              slogan: data.slogan || "",
              coverImage: data.coverImage || "",
              profileImage: data.profileImage || "",
              settings: data.settings || formData.settings,
              socialLinks: data.socialLinks || [],
              payoutDetails: data.payoutDetails || formData.payoutDetails
            });
          }
        })
        .finally(() => setIsLoading(false));

      // 2. Fetch Recent Tips
      fetch("/api/transactions?limit=10")
        .then(res => res.json())
        .then(data => {
            if (data.success) setRecentTips(data.transactions);
        });
    } else if (status === "unauthenticated") {
      setIsLoading(false);
    }
  }, [status]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      alert("Changes saved successfully!");
    } catch (e: any) {
      alert(e.message || "Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  const uploadFile = async (file: File, type: "cover" | "profile") => {
    const data = new FormData();
    data.append("file", file);
    
    try {
      const res = await fetch("/api/upload", { method: "POST", body: data });
      const json = await res.json();
      if (json.success) {
        if (type === "cover") setFormData({ ...formData, coverImage: json.url });
        if (type === "profile") setFormData({ ...formData, profileImage: json.url });
      }
    } catch (e) {
      alert("Upload failed.");
    }
  };

  const addSocialLink = () => {
    if (!socialInput.url.trim()) return;
    setFormData({
      ...formData,
      socialLinks: [...formData.socialLinks, { ...socialInput }]
    });
    setSocialInput({ ...socialInput, url: "" });
  };

  const removeSocialLink = (index: number) => {
    const next = [...formData.socialLinks];
    next.splice(index, 1);
    setFormData({ ...formData, socialLinks: next });
  };

  const handleCopy = () => {
    const url = `${window.location.origin}/${formData.username}`;
    navigator.clipboard.writeText(url);
    alert("URL Copied!");
  };

  if (isLoading) {
    return <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="flex flex-col gap-8 max-w-4xl pb-20">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-black text-foreground tracking-tight">Tip Configuration</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your public presence and financial settings.</p>
        </div>
        <button 
          disabled={isSaving}
          onClick={handleSave}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-6 py-2.5 rounded-full transition-all flex items-center gap-2 shadow-lg hover:shadow-primary/20 disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>

      {/* URL Widget */}
      <div className="bg-primary/5 border border-primary/20 p-6 rounded-3xl flex flex-col gap-4">
        <label className="text-sm font-bold text-primary flex items-center gap-2">
            <Globe className="w-4 h-4" /> Your Public Tip URL
        </label>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1 flex items-center gap-3 bg-card border border-border rounded-2xl px-5 py-3 text-[15px] font-bold text-foreground w-full shadow-sm">
            <span className="truncate flex-1 text-muted-foreground">
               {baseUrl}/<span className="text-foreground">{formData.username || "username"}</span>
            </span>
            <Copy onClick={handleCopy} className="w-4 h-4 ml-auto text-primary hover:scale-110 cursor-pointer transition-transform" />
          </div>
          <button 
            onClick={() => window.open(`/${formData.username}`, "_blank")}
            className="bg-card hover:bg-muted text-foreground border border-border font-bold px-8 py-3 rounded-2xl whitespace-nowrap transition-all w-full sm:w-auto shadow-sm flex items-center justify-center gap-2"
          >
            Launch Page <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-10 border-b border-border/50">
        {["setup", "payout", "recent"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-sm font-bold capitalize transition-all relative ${activeTab === tab ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            {tab === "setup" ? "Profile Setup" : tab === "payout" ? "Payout Details" : "Recent Tips"}
            {activeTab === tab && <div className="absolute bottom-[-1px] left-0 right-0 h-[3px] bg-primary rounded-t-full"></div>}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-card rounded-3xl border border-border shadow-sm p-6 md:p-10">
        
        {/* Setup Tab */}
        {activeTab === "setup" && (
           <div className="flex flex-col gap-10">
              
              {/* Username Input */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-foreground">Custom Handle (URL)</label>
                <input
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, "") })}
                  placeholder="jiggle-official"
                  className="w-full bg-muted text-foreground border border-border rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
                <p className="text-xs text-muted-foreground">Only letters and numbers. Changing this will break your old links!</p>
              </div>

              {/* Cover & Profile Images */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="flex flex-col gap-3">
                    <label className="text-sm font-bold text-foreground">Cover Image</label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="h-32 rounded-2xl border-2 border-dashed border-border flex items-center justify-center bg-muted hover:bg-muted/80 transition-all cursor-pointer overflow-hidden relative"
                    >
                       {formData.coverImage ? (
                          <img src={formData.coverImage} className="w-full h-full object-cover" />
                       ) : <Upload className="w-6 h-6 text-muted-foreground" />}
                       <input type="file" hidden ref={fileInputRef} onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0], "cover")} />
                    </div>
                 </div>
                 <div className="flex flex-col gap-3">
                    <label className="text-sm font-bold text-foreground">Profile Image</label>
                    <div 
                      onClick={() => profileInputRef.current?.click()}
                      className="w-32 h-32 rounded-3xl border-2 border-dashed border-border flex items-center justify-center bg-muted hover:bg-muted/80 transition-all cursor-pointer overflow-hidden"
                    >
                       {formData.profileImage ? (
                          <img src={formData.profileImage} className="w-full h-full object-cover" />
                       ) : <Upload className="w-6 h-6 text-muted-foreground" />}
                       <input type="file" hidden ref={profileInputRef} onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0], "profile")} />
                    </div>
                 </div>
              </div>

              {/* Bio & Links */}
              <div className="flex flex-col gap-6">
                 <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-foreground">About You</label>
                    <textarea 
                       value={formData.about}
                       onChange={(e) => setFormData({...formData, about: e.target.value})}
                       className="w-full bg-muted text-foreground border border-border rounded-xl p-4 text-sm min-h-[120px] focus:ring-2 focus:ring-primary/20 transition-all"
                       placeholder="Tell your fans a bit about yourself..."
                    />
                 </div>

                 {/* Social Links Manager */}
                 <div className="flex flex-col gap-4">
                    <label className="text-sm font-bold text-foreground">Social Links</label>
                    <div className="flex gap-2">
                       <select 
                          value={socialInput.platform}
                          onChange={(e) => setSocialInput({...socialInput, platform: e.target.value})}
                          className="bg-muted text-foreground border border-border rounded-xl px-4 py-3 text-sm font-bold"
                       >
                          <option>Youtube</option>
                          <option>Instagram</option>
                          <option>Twitter</option>
                          <option>Twitch</option>
                          <option>Discord</option>
                       </select>
                       <input 
                          value={socialInput.url}
                          onChange={(e) => setSocialInput({...socialInput, url: e.target.value})}
                          placeholder="https://youtube.com/..."
                          className="flex-1 bg-muted text-foreground border border-border rounded-xl p-3 text-sm"
                       />
                       <button onClick={addSocialLink} className="bg-primary text-primary-foreground p-3 rounded-xl hover:scale-105 transition-transform">
                          <PlusCircle className="w-5 h-5" />
                       </button>
                    </div>
                    <div className="flex flex-wrap gap-3">
                       {formData.socialLinks.map((link, idx) => (
                          <div key={idx} className="bg-muted text-foreground px-4 py-2 rounded-full flex items-center gap-3 text-sm font-bold border border-border">
                             <Globe className="w-4 h-4" />
                             {link.url.replace(/https?:\/\/(www\.)?/, "").split("/")[0]}
                             <Trash2 onClick={() => removeSocialLink(idx)} className="w-3.5 h-3.5 text-muted-foreground hover:text-red-500 cursor-pointer" />
                          </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* Payout Tab */}
        {activeTab === "payout" && (
           <div className="flex flex-col gap-8">
              <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 p-6 rounded-3xl flex items-center gap-4">
                 <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center shrink-0">
                    <Landmark className="w-6 h-6 text-white" />
                 </div>
                 <div>
                    <h3 className="font-bold text-emerald-800 dark:text-emerald-400">Verification Account</h3>
                    <p className="text-xs text-emerald-600 dark:text-emerald-500">Enter where we should send your earnings after verification.</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-foreground">Withdrawal Method</label>
                    <select 
                       value={formData.payoutDetails.method}
                       onChange={(e) => setFormData({...formData, payoutDetails: {...formData.payoutDetails, method: e.target.value}})}
                       className="bg-muted text-foreground border border-border rounded-xl p-4 text-sm font-bold"
                    >
                       <option value="KHALTI">Khalti (E-Wallet)</option>
                       <option value="BANK">Bank Account (Nepal Only)</option>
                    </select>
                 </div>
                 <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-foreground">{formData.payoutDetails.method === "KHALTI" ? "Khalti ID (Mobile)" : "Account Number"}</label>
                    <input 
                       value={formData.payoutDetails.accountNumber}
                       onChange={(e) => setFormData({...formData, payoutDetails: {...formData.payoutDetails, accountNumber: e.target.value}})}
                       placeholder={formData.payoutDetails.method === "KHALTI" ? "98XXXXXXXX" : "XXXX-XXXX-XXXX"}
                       className="bg-muted text-foreground border border-border rounded-xl p-4 text-sm font-bold"
                    />
                 </div>
              </div>

              <div className="flex flex-col gap-2">
                 <label className="text-sm font-bold text-foreground">Verified Full Name</label>
                 <input 
                    value={formData.payoutDetails.accountName}
                    onChange={(e) => setFormData({...formData, payoutDetails: {...formData.payoutDetails, accountName: e.target.value}})}
                    placeholder="As shown on your ID or Citizen card"
                    className="bg-muted text-foreground border border-border rounded-xl p-4 text-sm font-bold"
                 />
                 <p className="text-xs text-muted-foreground italic">Important: This name must match your withdrawal account to avoid delays.</p>
              </div>
           </div>
        )}

        {/* Recent Tips Tab */}
        {activeTab === "recent" && (
           <div className="flex flex-col gap-6">
              <h3 className="text-lg font-bold">Your Latest Interactions</h3>
              {recentTips.length > 0 ? (
                 <div className="flex flex-col border border-border rounded-2xl overflow-hidden shadow-sm">
                    {recentTips.map((tip, idx) => (
                       <div key={idx} className="p-5 border-b border-border/50 last:border-0 hover:bg-muted transition-colors flex items-center justify-between">
                          <div className="flex flex-col gap-0.5">
                             <span className="text-sm font-bold text-foreground">{tip.supporter.name}</span>
                             <span className="text-xs text-muted-foreground">{new Date(tip.createdAt).toLocaleDateString()}</span>
                          </div>
                          <span className="text-sm font-black text-primary">Rs. {tip.financials.amountNPR}</span>
                       </div>
                    ))}
                 </div>
              ) : (
                 <div className="py-20 text-center text-muted-foreground italic">No tips received yet.</div>
              )}
           </div>
        )}

      </div>
    </div>
  );
}
