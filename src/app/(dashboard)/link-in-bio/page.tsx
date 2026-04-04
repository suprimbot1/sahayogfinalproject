"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { 
  Plus, 
  Trash2, 
  Globe, 
  ExternalLink, 
  Copy, 
  Save, 
  Loader2, 
  Eye, 
  Settings, 
  Link as LinkIcon,
  CheckCircle,
  GripVertical,
  CircleCheck,
  CircleAlert
} from "lucide-react";

export default function LinkInBioPage() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [newLink, setNewLink] = useState({ title: "", url: "" });
  const [showAddForm, setShowAddForm] = useState(false);

  // Initial Fetch
  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/profile")
        .then(res => res.json())
        .then(data => {
          setProfile(data);
          setIsLoading(false);
        })
        .catch(err => {
          console.error("Fetch Error:", err);
          setIsLoading(false);
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
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      if (data.success) {
        alert("Link in Bio saved successfully!");
      } else {
        alert(data.error || "Failed to save.");
      }
    } catch (err) {
      alert("Error saving profile.");
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

  const updateLink = (index: number, field: string, value: any) => {
     const updatedLinks = [...(profile.bioLinks || [])];
     updatedLinks[index][field] = value;
     setProfile({ ...profile, bioLinks: updatedLinks });
  };

  if (isLoading) return <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  if (!profile) return <div className="p-12 text-center">Please log in to manage your link in bio.</div>;

  const publicUrl = typeof window !== "undefined" ? `${window.location.host}/links/${profile.username}` : `sahayog.app/links/${profile.username}`;

  return (
    <div className="flex flex-col xl:flex-row gap-8 min-h-[calc(100vh-10rem)] pb-20">
      
      {/* Left Settings Panel */}
      <div className="flex-1 max-w-2xl bg-card rounded-3xl border border-border p-8 shadow-sm h-fit">
        <div className="flex flex-col gap-10">
          
          {/* Header & Bio Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-foreground tracking-tight">Profile Details</h2>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-6 py-2 rounded-2xl flex items-center gap-2 transition-all disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Changes
              </button>
            </div>

            <div className="flex items-start gap-4 p-5 bg-muted/5 rounded-3xl border border-border/50">
              <div className="w-20 h-20 rounded-full border-2 border-primary/20 p-1 flex-shrink-0">
                {profile.profileImage ? (
                  <img src={profile.profileImage} alt={profile.username} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center text-2xl font-black text-slate-400">
                    {profile.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex-1 mt-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-black text-lg text-foreground">@{profile.username}</span>
                  <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold uppercase tracking-widest border border-primary/20">Verified</span>
                </div>
                <textarea 
                  value={profile.about || ""}
                  onChange={(e) => setProfile({...profile, about: e.target.value})}
                  placeholder="Share a short bio with your audience..."
                  className="w-full bg-transparent text-sm text-slate-500 font-medium leading-relaxed resize-none focus:outline-none focus:text-foreground transition-colors min-h-[60px]"
                />
              </div>
            </div>
          </div>

          {/* Links Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-2">
               <h2 className="text-xl font-black text-foreground tracking-tight flex items-center gap-2">
                 <LinkIcon className="w-5 h-5 text-primary" />
                 Your Custom Links
                </h2>
                <div className="text-[10px] font-black text-muted-foreground bg-muted/30 px-3 py-1 rounded-full uppercase tracking-tighter">
                  {profile.bioLinks?.length || 0} Links Added
                </div>
            </div>

            <div className="space-y-4">
              {profile.bioLinks?.map((link: any, i: number) => (
                <div key={i} className="group relative bg-muted/5 border border-border hover:border-primary/20 rounded-3xl p-5 transition-all shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 mt-2">
                      <GripVertical className="w-4 h-4" />
                    </div>
                    <div className="flex-1 space-y-3">
                       <input 
                         value={link.title}
                         onChange={(e) => updateLink(i, "title", e.target.value)}
                         className="w-full bg-transparent font-bold text-md text-foreground focus:outline-none placeholder:opacity-50"
                         placeholder="Link Title (e.g. My Latest Video)"
                       />
                       <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                         <Globe className="w-3.5 h-3.5" />
                         <input 
                           value={link.url}
                           onChange={(e) => updateLink(i, "url", e.target.value)}
                           className="flex-1 bg-transparent focus:outline-none focus:text-primary transition-colors"
                           placeholder="https://yourlink.com"
                         />
                       </div>
                    </div>
                    <div className="flex items-center gap-3">
                       <button 
                         onClick={() => toggleLinkActive(i)}
                         className={`w-10 h-6 rounded-full relative transition-colors ${link.active ? "bg-primary" : "bg-slate-200"}`}
                       >
                         <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${link.active ? "right-1" : "left-1"}`}></div>
                       </button>
                       <button 
                         onClick={() => removeLink(i)}
                         className="p-1 text-slate-300 hover:text-rose-500 transition-colors"
                       >
                         <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                  </div>
                </div>
              ))}

              {showAddForm ? (
                <div className="bg-white border-2 border-primary/30 rounded-3xl p-6 shadow-xl space-y-4 animate-in fade-in slide-in-from-bottom-2">
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Label</label>
                        <input 
                          value={newLink.title}
                          onChange={(e) => setNewLink({...newLink, title: e.target.value})}
                          placeholder="My Discord"
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary font-bold"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Destination URL</label>
                        <input 
                          value={newLink.url}
                          onChange={(e) => setNewLink({...newLink, url: e.target.value})}
                          placeholder="https://..."
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                   </div>
                   <div className="flex justify-end gap-3 pt-2">
                      <button onClick={() => setShowAddForm(false)} className="px-5 py-2 text-sm font-bold text-slate-400 hover:text-slate-600">Cancel</button>
                      <button onClick={addLink} className="bg-primary text-primary-foreground font-black px-8 py-2 rounded-xl text-sm shadow-lg hover:shadow-primary/20 transition-all">Add Link</button>
                   </div>
                </div>
              ) : (
                <button 
                  onClick={() => setShowAddForm(true)}
                  className="w-full py-4 border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 rounded-3xl flex items-center justify-center gap-3 transition-all group"
                >
                  <Plus className="w-5 h-5 text-slate-300 group-hover:text-primary transition-colors" />
                  <span className="text-sm font-black text-slate-400 group-hover:text-primary tracking-tight transition-colors">Add New Link</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Phone Preview Panel */}
      <div className="xl:flex-1 flex flex-col items-center sticky top-24 h-fit">
        
        {/* Mock Live URL Bar */}
        <div className="w-full max-w-[320px] mb-8 group">
          <div className="flex items-center gap-3 bg-white/80 backdrop-blur-md border border-border rounded-2xl px-5 py-3 text-sm font-bold shadow-sm group-hover:border-primary/20 transition-all">
            <span className="truncate flex-1 text-slate-400 font-medium">{publicUrl}</span>
            <Copy 
              onClick={() => { navigator.clipboard.writeText(publicUrl); alert("URL Copied!"); }}
              className="w-4 h-4 text-slate-300 hover:text-primary cursor-pointer transition-colors" 
            />
          </div>
        </div>

        {/* Improved Phone Mockup Frame */}
        <div className="relative w-[320px] h-[640px] bg-white border-[10px] border-slate-900 rounded-[3rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden shrink-0">
          <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-50">
             <div className="bg-slate-900 h-full w-24 rounded-b-2xl"></div>
          </div>
          
          <div className="relative w-full h-full bg-[#0a1128] overflow-hidden flex flex-col pt-16 pb-8 px-5">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.4)_1px,transparent_1px)]" style={{ backgroundSize: '16px 16px' }}></div>
            
            {/* Header */}
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full border-2 border-indigo-400 p-1 bg-slate-900/50 backdrop-blur-md shadow-2xl mb-4">
                 {profile.profileImage ? (
                   <img src={profile.profileImage} className="w-full h-full rounded-full object-cover" />
                 ) : (
                   <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-black text-white">
                      {profile.username.charAt(0).toUpperCase()}
                   </div>
                 )}
              </div>
              <h3 className="text-lg font-black text-white tracking-tight">@{profile.username}</h3>
              <p className="text-[11px] text-indigo-300 font-bold uppercase tracking-[0.2em] mt-1">{profile.slogan || "Creator"}</p>
              <p className="text-slate-400 text-[10px] leading-relaxed line-clamp-2 px-4 mt-3">
                {profile.about || "No bio yet."}
              </p>
            </div>

            {/* Links Area */}
            <div className="relative z-10 mt-8 flex flex-col gap-3 overflow-y-auto no-scrollbar pb-10">
               {profile.bioLinks?.filter((l: any) => l.active).map((link: any, idx: number) => (
                 <div key={idx} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between shadow-lg backdrop-blur-md animate-in fade-in zoom-in-95 duration-300">
                    <span className="text-[13px] font-black text-white tracking-tight truncate">{link.title}</span>
                    <ExternalLink className="w-3 h-3 text-indigo-400" />
                 </div>
               ))}
               {(!profile.bioLinks || profile.bioLinks.filter((l: any) => l.active).length === 0) && (
                 <div className="flex flex-col items-center justify-center py-10 opacity-30">
                    <CircleAlert className="w-8 h-8 text-indigo-400 mb-2" />
                    <span className="text-[10px] font-black uppercase text-indigo-300 tracking-widest">No active links</span>
                 </div>
               )}
            </div>

            {/* Mock Footer */}
            <div className="mt-auto relative z-10">
              <div className="flex items-center justify-center gap-1 opacity-40">
                <span className="text-[8px] font-black text-white tracking-widest uppercase">Sahayog Hub</span>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
