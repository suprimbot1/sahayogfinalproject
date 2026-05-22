"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { 
  Plus, 
  Trash2, 
  Globe, 
  ExternalLink, 
  Copy, 
  Save, 
  Loader2, 
  Video as YoutubeIcon,
  Camera as InstagramIcon,
  MessageCircle as FacebookIcon,
  User as ProfileIcon,
  Code as GithubIcon,
  ChevronDown,
  X,
  Zap,
  Share2
} from "lucide-react";
import { useToast } from "@/components/ui/toast";

// Social Platform Mapping (Fixed for lucide-react 1.7.0)
const SOCIAL_LIST = [
  { id: "facebook", name: "Facebook", icon: FacebookIcon },
  { id: "instagram", name: "Instagram", icon: InstagramIcon },
];

function VideoIconPlaceholder(props: any) { return <YoutubeIcon {...props} /> }

export default function LinkInBioPage() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { success, error, info } = useToast();
  
  // Link Editor State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLink, setNewLink] = useState({ title: "", url: "" });
  
  // Social Link Editor State
  const [editingSocial, setEditingSocial] = useState<string | null>(null);
  const [socialValue, setSocialValue] = useState("");

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/profile")
        .then(res => res.json())
        .then(data => {
          if (!data.bioLinks) data.bioLinks = [];
          if (!data.socialLinks) data.socialLinks = [];
          setProfile(data);
          setIsLoading(false);
        });
    }
  }, [status]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (res.ok) success("Your Link-in-Bio has been updated! 🍹");
    } catch (err) {
      error("Failed to save profile changes.");
    } finally {
      setIsSaving(false);
    }
  };

  const addLink = () => {
    if (!newLink.title || !newLink.url) return;
    const updatedLinks = [...(profile.bioLinks || []), { ...newLink, active: true }];
    setProfile({ ...profile, bioLinks: updatedLinks });
    setNewLink({ title: "", url: "" });
    setShowAddForm(false);
  };

  const removeLink = (index: number) => {
    const updatedLinks = [...(profile.bioLinks || [])];
    updatedLinks.splice(index, 1);
    setProfile({ ...profile, bioLinks: updatedLinks });
  };

  const toggleLinkActive = (index: number) => {
    const updatedLinks = [...(profile.bioLinks || [])];
    updatedLinks[index].active = !updatedLinks[index].active;
    setProfile({ ...profile, bioLinks: updatedLinks });
  };

  // Social Link Logic
  const openSocialEditor = (platformId: string) => {
    const existing = profile.socialLinks.find((s: any) => s.platform === platformId);
    setSocialValue(existing?.url || "");
    setEditingSocial(platformId);
  };

  const saveSocialLink = () => {
    const updatedSocial = [...(profile.socialLinks || [])];
    const index = updatedSocial.findIndex((s: any) => s.platform === editingSocial);
    
    if (socialValue.trim() === "") {
      if (index !== -1) updatedSocial.splice(index, 1);
    } else {
      if (index !== -1) updatedSocial[index].url = socialValue;
      else updatedSocial.push({ platform: editingSocial, url: socialValue });
    }
    
    setProfile({ ...profile, socialLinks: updatedSocial });
    setEditingSocial(null);
  };

  if (isLoading) return <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#008d4a]" /></div>;

  const publicUrl = `sahayog.host/${profile?.username || "loading"}`;

  return (
    <div className="flex flex-col gap-6 max-w-[1400px] mx-auto min-h-screen bg-background pb-20 px-4 md:px-10">
      
      {/* Top Navbar Actions */}
      <div className="flex items-center justify-end gap-3 w-full border-b border-border pb-4 pt-4">
         <div className="hidden md:flex items-center gap-2 bg-muted border border-border rounded-lg px-4 py-2.5 min-w-[320px]">
            <Globe className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-bold text-muted-foreground">https://{publicUrl}</span>
            <ChevronDown className="w-4 h-4 text-muted-foreground ml-auto" />
         </div>
         <div className="flex items-center gap-2">
            <button onClick={() => { navigator.clipboard.writeText(publicUrl); info("Copied Profile URL!", "Clipboard"); }} className="p-2.5 bg-muted border border-border rounded-lg hover:bg-muted/80 transition-colors">
               <Copy className="w-4 h-4 text-muted-foreground" />
            </button>
            <button onClick={() => window.open(`/links/${profile.username}`)} className="p-2.5 bg-muted border border-border rounded-lg hover:bg-muted/80 transition-colors">
               <ExternalLink className="w-4 h-4 text-muted-foreground" />
            </button>
            <button onClick={handleSave} className="bg-primary text-primary-foreground px-8 py-2.5 rounded-lg font-black text-sm shadow-lg border border-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2">
               {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Share"}
            </button>
         </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-16 mt-8">
        
        {/* Editor Screen */}
        <div className="flex-1 flex flex-col gap-12">
           
           {/* Profile Block */}
           <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
              <div className="w-32 h-32 rounded-full bg-[#f0fcf7] dark:bg-[#0F1E19] flex items-center justify-center text-[#008d4a] dark:text-[#23C973] text-5xl font-black border-4 border-background shadow-xl overflow-hidden shrink-0">
                  {profile?.profileImage ? (
                   <img src={profile.profileImage} className="w-full h-full object-cover" />
                 ) : profile?.username?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="flex-1 flex flex-col gap-6 text-center sm:text-left w-full">
                 <div>
                    <h2 className="text-3xl font-black text-foreground tracking-tighter">@{profile?.username || "username"}</h2>
                    <input 
                       type="text" 
                       value={profile.slogan || ""} 
                       onChange={(e) => setProfile({...profile, slogan: e.target.value})}
                       className="text-lg font-bold text-muted-foreground bg-transparent border-none focus:ring-0 p-0 w-full placeholder:opacity-30 mt-1"
                       placeholder="A short bio about you"
                    />
                 </div>
                 
                 {/* Social Icons Row */}
                 <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                    {SOCIAL_LIST.map((social) => {
                       const isLinked = profile.socialLinks.some((s: any) => s.platform === social.id);
                       return (
                          <div key={social.id} className="relative group cursor-pointer" onClick={() => openSocialEditor(social.id)}>
                             <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                               isLinked ? "bg-[#008d4a15] text-[#008d4a] border-2 border-[#008d4a20]" : "bg-muted text-muted-foreground hover:bg-muted/80"
                             }`}>
                                <social.icon className="w-[18px] h-[18px]" />
                             </div>
                             <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border-2 border-background shadow-sm ${
                                isLinked ? "bg-[#008d4a]" : "bg-muted-foreground/30"
                             }`}>
                                <Plus className={`w-3 h-3 text-white ${isLinked ? "rotate-45" : ""}`} />
                             </div>
                          </div>
                       );
                    })}
                 </div>

                 {/* Inline Social Editor Popover */}
                 {editingSocial && (
                    <div className="bg-slate-900 rounded-2xl p-4 shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-2 border border-slate-800">
                       <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">{editingSocial}:</span>
                       <input 
                         autoFocus
                         value={socialValue}
                         onChange={(e) => setSocialValue(e.target.value)}
                         placeholder="Enter URL..."
                         className="bg-slate-800 text-white text-sm px-3 py-2 rounded-xl flex-1 outline-none focus:ring-1 focus:ring-emerald-500"
                       />
                       <button onClick={saveSocialLink} className="bg-emerald-600 text-white p-2 rounded-xl"><CheckCircle className="w-4 h-4" /></button>
                       <button onClick={() => setEditingSocial(null)} className="text-slate-400"><X className="w-4 h-4" /></button>
                    </div>
                 )}
              </div>
           </div>

           {/* Big Green Primary Button */}
           <button 
             onClick={() => setShowAddForm(true)}
             className="w-full bg-[#008d4a] text-white py-5 rounded-[24px] font-black text-xl flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/10 hover:bg-[#007a40] transition-all hover:scale-[1.01] active:scale-[0.99]"
           >
              <Plus className="w-6 h-6 stroke-[4]" /> Add New Link
           </button>

           {/* Dynamic Links List */}
           <div className="flex flex-col gap-5">
              {profile.bioLinks?.length === 0 ? (
                <div className="py-12 border-2 border-dashed border-border rounded-[32px] flex flex-col items-center justify-center opacity-30 text-foreground">
                   <Zap className="w-8 h-8 mb-2 text-muted-foreground" />
                   <p className="text-sm font-bold uppercase tracking-widest leading-none text-muted-foreground">No custom links yet</p>
                </div>
              ) : profile.bioLinks.map((link: any, i: number) => (
                <div key={i} className={`group bg-card border rounded-[32px] p-6 flex flex-col sm:flex-row items-center justify-between transition-all hover:shadow-2xl hover:shadow-emerald-500/5 ${link.active ? "border-border" : "border-border grayscale opacity-60"}`}>
                   <div className="flex items-center gap-6">
                      <div className="w-12 h-12 bg-muted border border-border rounded-2xl flex items-center justify-center text-muted-foreground group-hover:text-[#008d4a] transition-colors shrink-0">
                        <Globe className="w-6 h-6" />
                      </div>
                      <div className="flex flex-col">
                         <span className="font-black text-lg text-foreground tracking-tight">{link.title || "Untitled Link"}</span>
                         <span className="text-xs font-bold text-muted-foreground truncate max-w-[200px]">{link.url}</span>
                      </div>
                   </div>
                   <div className="flex items-center gap-6 mt-4 sm:mt-0">
                      <button onClick={() => removeLink(i)} className="text-muted-foreground/30 hover:text-rose-500 transition-colors p-2"><Trash2 className="w-5 h-5" /></button>
                      <button 
                        onClick={() => toggleLinkActive(i)}
                        className={`w-12 h-7 rounded-full relative transition-all shadow-inner ${link.active ? "bg-[#008d4a]" : "bg-muted-foreground/20"}`}
                      >
                         <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all shadow-sm ${link.active ? "right-1" : "left-1"}`}></div>
                      </button>
                   </div>
                </div>
              ))}
           </div>

           {/* Add Link Form Modal-ish */}
           {showAddForm && (
              <div className="bg-card border-4 border-primary/10 rounded-[40px] p-8 shadow-2xl space-y-6 animate-in zoom-in-95">
                 <div className="flex flex-col gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em] ml-2">Link Label</label>
                       <input value={newLink.title} onChange={e => setNewLink({...newLink, title: e.target.value})} placeholder="e.g. Subscribe on YouTube" className="bg-muted text-foreground p-5 rounded-[22px] font-bold text-lg focus:ring-2 focus:ring-[#008d4a] w-full outline-none" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em] ml-2">Destination URL</label>
                       <input value={newLink.url} onChange={e => setNewLink({...newLink, url: e.target.value})} placeholder="https://..." className="bg-muted text-foreground p-5 rounded-[22px] font-medium text-md focus:ring-2 focus:ring-[#008d4a] w-full outline-none" />
                    </div>
                 </div>
                 <div className="flex justify-end gap-3 pt-4">
                    <button onClick={() => setShowAddForm(false)} className="text-muted-foreground font-black px-6 text-sm">Cancel</button>
                    <button onClick={addLink} className="bg-[#008d4a] shadow-lg shadow-emerald-500/20 text-white px-12 py-3 rounded-[18px] font-black hover:bg-[#007a40] transition-colors">Add to Bio</button>
                 </div>
              </div>
           )}

        </div>

        {/* Right: Phone Preview (Dynamic Content) */}
        <div className="xl:w-[480px] flex justify-center sticky top-8 h-fit">
           <div className="relative w-[340px] h-[700px] border-[14px] border-gray-900 rounded-[3.5rem] shadow-[0_50px_120px_-30px_rgba(0,0,0,0.4)] overflow-hidden shrink-0 ring-4 ring-[#008d4a10]">
              
              {/* Dynamic Galaxy Content */}
              <div className="relative w-full h-full bg-[#030a06] overflow-hidden flex flex-col items-center pt-24 pb-12 px-6 text-center">
                 <div className="absolute inset-0 opacity-40 bg-[radial-gradient(white_1.2px,transparent_1.2px)]" style={{ backgroundSize: '24px 24px' }}></div>
                 <div className="absolute inset-0 bg-gradient-to-b from-[#008d4a20] to-transparent"></div>

                 {/* Dynamic Avatar */}
                 <div className="relative z-10 w-24 h-24 rounded-full bg-white border-4 border-white shadow-2xl flex flex-col items-center justify-center overflow-hidden">
                    {profile?.profileImage ? (
                      <img src={profile.profileImage} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[#008d4a] text-4xl font-black">{profile?.username?.charAt(0).toUpperCase() || "U"}</span>
                    )}
                 </div>

                 {/* Dynamic Name and Slogan */}
                 <h3 className="relative z-10 text-2xl font-black text-[#bcfc01] tracking-tighter mt-6 mb-1">@{profile?.username || "username"}</h3>
                 <p className="relative z-10 text-[10px] text-white/50 font-bold uppercase tracking-[0.3em]">{profile.slogan || "Sahayog Platform"}</p>
                 
                 {/* Dynamic Social Icons in Preview */}
                 <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 mt-6 mb-8">
                    {profile.socialLinks?.map((social: any, i: number) => {
                       const platform = SOCIAL_LIST.find(p => p.id === social.platform) || SOCIAL_LIST[0];
                       return (
                          <div key={i} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/5 backdrop-blur-md">
                             <platform.icon className="w-[18px] h-[18px] text-[#bcfc01]" />
                          </div>
                       );
                    })}
                 </div>

                 {/* Dynamic Active Links */}
                 <div className="relative z-10 w-full flex flex-col gap-4 max-h-[220px] overflow-hidden">
                    {profile.bioLinks?.filter((l: any) => l.active).map((link: any, i: number) => (
                      <div key={i} className="w-full bg-white/5 backdrop-blur-xl border border-white/5 rounded-2xl p-4 flex items-center justify-between shadow-lg transform scale-100 hover:scale-[1.02] transition-transform">
                         <span className="text-sm font-black text-white tracking-tight">{link.title}</span>
                         <ArrowRightIconPlaceholder className="w-4 h-4 text-[#bcfc01]" />
                      </div>
                    ))}
                 </div>

                 {/* Mock UI elements */}
                 <div className="absolute top-8 right-8 z-20">
                    <Share2 className="w-5 h-5 text-white/40" />
                 </div>
                 <div className="absolute top-8 left-8 z-20">
                   <div className="text-xl font-black text-[#bcfc01] tracking-tighter italic mr-1">Sahayog<span className="text-white">.</span></div>
                 </div>

                 {/* Footer Static links */}
                 <div className="mt-auto z-10 flex items-center gap-3 text-[10px] font-black text-white/20 uppercase tracking-[0.2em] pointer-events-none">
                    <span>Terms</span>
                    <div className="w-1 h-1 rounded-full bg-white/10"></div>
                    <span>Privacy</span>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}

function ArrowRightIconPlaceholder(props: any) { return <ExternalLink {...props} /> }
function CheckCircle(props: any) { return <Save {...props} /> }
