"use client";

import { useState, useEffect } from "react";
import { 
  Save, 
  Loader2, 
  Globe, 
  Percent, 
  ShieldCheck, 
  Mail, 
  Wallet,
  AlertTriangle,
  Building2
} from "lucide-react";
import { useToast } from "@/components/ui/toast";

export default function AdminSettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { success, error, info } = useToast();
  
  const [settings, setSettings] = useState({
    platformName: "Sahayog",
    supportEmail: "support@sahayog.app",
    commissionPercentage: 10,
    minWithdrawalAmount: 100,
    maintenanceMode: false,
    khaltiEnabled: true,
    bankTransferEnabled: true,
  });

  useEffect(() => {
    fetch("/api/admin/settings")
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setSettings(data);
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        success("Global settings updated successfully!");
      } else {
        error(data.error || "Failed to update settings");
      }
    } catch (e) {
      error("A network error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return (
    <div className="p-12 flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
      <p className="text-sm font-black text-muted-foreground uppercase tracking-widest">Loading configuration...</p>
    </div>
  );

  return (
    <div className="flex flex-col gap-10 max-w-4xl mx-auto pb-20">
      
      {/* Header */}
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black text-foreground tracking-tight">Global Settings</h1>
          <p className="text-sm text-muted-foreground">Manage platform-wide financial and technical rules.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-black px-8 py-3 rounded-2xl flex items-center gap-2 shadow-lg shadow-primary/20 transition-all disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 animate-in fade-in slide-in-from-top-4 duration-700">
        
        {/* Basic Config */}
        <div className="bg-card border border-border rounded-[32px] p-8 shadow-sm flex flex-col gap-8">
           <div className="flex items-center gap-3 border-b border-border pb-4">
              <Globe className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-black uppercase tracking-tight">General Branding</h2>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                 <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Platform Name</label>
                 <input 
                   value={settings.platformName}
                   onChange={e => setSettings({...settings, platformName: e.target.value})}
                   className="w-full bg-muted border border-border rounded-xl p-4 font-black text-md outline-none focus:ring-2 focus:ring-primary/20 transition-all" 
                 />
              </div>
              <div className="flex flex-col gap-2">
                 <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Support Email</label>
                 <div className="relative">
                   <input 
                     value={settings.supportEmail}
                     onChange={e => setSettings({...settings, supportEmail: e.target.value})}
                     className="w-full bg-muted border border-border rounded-xl p-4 font-black text-md outline-none focus:ring-2 focus:ring-primary/20 transition-all pl-12" 
                   />
                   <Mail className="w-4 h-4 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2" />
                 </div>
              </div>
           </div>

           <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 p-6 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/50 rounded-xl flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                 </div>
                 <div>
                    <h4 className="font-black text-amber-900 dark:text-amber-400 text-sm leading-none mb-1">Maintenance Mode</h4>
                    <p className="text-xs text-amber-700 dark:text-amber-500">If enabled, users will see a "Site under maintenance" screen.</p>
                 </div>
              </div>
              <button 
                onClick={() => setSettings({...settings, maintenanceMode: !settings.maintenanceMode})}
                className={`w-14 h-8 rounded-full transition-all flex items-center p-1 ${settings.maintenanceMode ? 'bg-amber-500' : 'bg-slate-300'}`}
              >
                <div className={`w-6 h-6 bg-white rounded-full transition-transform ${settings.maintenanceMode ? 'translate-x-6' : ''}`}></div>
              </button>
           </div>
        </div>

        {/* Financial Rules */}
        <div className="bg-card border border-border rounded-[32px] p-8 shadow-sm flex flex-col gap-8">
           <div className="flex items-center gap-3 border-b border-border pb-4">
              <Percent className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-black uppercase tracking-tight">Financial Engine</h2>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-3">
                 <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Platform Commission</label>
                    <span className="text-xs font-black text-primary">{settings.commissionPercentage}%</span>
                 </div>
                 <input 
                   type="range" 
                   min="0" max="50"
                   value={settings.commissionPercentage}
                   onChange={e => setSettings({...settings, commissionPercentage: Number(e.target.value)})}
                   className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
                 />
                 <p className="text-[10px] text-muted-foreground font-medium italic">This amount is automatically deducted from each tip transaction.</p>
              </div>

              <div className="flex flex-col gap-2">
                 <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Minimum Withdrawal (NPR)</label>
                 <input 
                   type="number"
                   value={settings.minWithdrawalAmount}
                   onChange={e => setSettings({...settings, minWithdrawalAmount: Number(e.target.value)})}
                   className="w-full bg-muted border border-border rounded-xl p-4 font-black text-md outline-none focus:ring-2 focus:ring-primary/20 transition-all" 
                 />
              </div>
           </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-card border border-border rounded-[32px] p-8 shadow-sm flex flex-col gap-8">
           <div className="flex items-center gap-3 border-b border-border pb-4">
              <Wallet className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-black uppercase tracking-tight">Payout Gateways</h2>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-6 rounded-2xl border-2 transition-all flex items-center justify-between ${settings.khaltiEnabled ? 'border-primary/20 bg-primary/5' : 'border-border bg-muted/20 grayscale opacity-60'}`}>
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 font-black text-xs">KH</div>
                    <span className="font-black text-sm">Khalti Wallet</span>
                 </div>
                 <button onClick={() => setSettings({...settings, khaltiEnabled: !settings.khaltiEnabled})} className={`w-12 h-6 rounded-full p-1 transition-colors ${settings.khaltiEnabled ? 'bg-primary' : 'bg-slate-400'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.khaltiEnabled ? 'translate-x-6' : ''}`}></div>
                 </button>
              </div>

              <div className={`p-6 rounded-2xl border-2 transition-all flex items-center justify-between ${settings.bankTransferEnabled ? 'border-primary/20 bg-primary/5' : 'border-border bg-muted/20 grayscale opacity-60'}`}>
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                       <Building2 className="w-5 h-5 text-slate-600" />
                    </div>
                    <span className="font-black text-sm">Bank Transfer</span>
                 </div>
                 <button onClick={() => setSettings({...settings, bankTransferEnabled: !settings.bankTransferEnabled})} className={`w-12 h-6 rounded-full p-1 transition-colors ${settings.bankTransferEnabled ? 'bg-primary' : 'bg-slate-400'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.bankTransferEnabled ? 'translate-x-6' : ''}`}></div>
                 </button>
              </div>
           </div>
        </div>

        <div className="flex items-center gap-3 text-muted-foreground bg-muted/30 p-6 rounded-3xl border border-dashed border-border">
           <ShieldCheck className="w-5 h-5 shrink-0" />
           <p className="text-xs font-medium leading-relaxed italic">
             <strong>Security Protocol:</strong> These settings are global. Changing them will affect all creators and transactions immediately. Ensure you have verified these values before saving.
           </p>
        </div>

      </div>
    </div>
  );
}
