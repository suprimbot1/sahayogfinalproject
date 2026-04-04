import dbConnect from "@/lib/mongoose";
import UserProfile from "@/models/UserProfile";
import { notFound } from "next/navigation";
import { 
  Video as YoutubeIcon, 
  Camera as InstagramIcon, 
  MessageCircle,
  User as ProfileIcon, 
  Code, 
  Globe, 
  ArrowRight,
  ExternalLink
} from "lucide-react";

// Platform Icon mapping
const PLATFORM_ICONS: Record<string, any> = {
  youtube: YoutubeIcon,
  instagram: InstagramIcon,
  twitter: Globe,
  x: Globe,
  facebook: MessageCircle,
  linkedin: ProfileIcon,
  github: Code,
  website: Globe,
};

export default async function PublicLinksPage({ params }: { params: { username: string } }) {
  await dbConnect();
  
  const profile = await UserProfile.findOne({ username: params.username.toLowerCase() }).lean();

  if (!profile) {
    notFound();
  }

  const bioLinks = profile.bioLinks?.filter((link: any) => link.active) || [];
  const socialLinks = profile.socialLinks || [];

  return (
    <main className="min-h-screen bg-[#0a1128] text-white flex flex-col items-center py-12 px-6 relative overflow-hidden font-sans">
      
      {/* Background Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Header Content */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-md">
        
        {/* Avatar */}
        <div className="w-24 h-24 rounded-full border-2 border-indigo-500/50 p-1 bg-slate-900/50 backdrop-blur-md mb-6 shadow-2xl">
          {profile.profileImage ? (
            <img 
              src={profile.profileImage} 
              alt={profile.username} 
              className="w-full h-full rounded-full object-cover" 
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-3xl font-black">
              {profile.username.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Name & Bio */}
        <h1 className="text-2xl font-black tracking-tight mb-2">@{profile.username}</h1>
        {profile.slogan && <p className="text-indigo-400 font-bold text-sm mb-3 uppercase tracking-widest">{profile.slogan}</p>}
        {profile.about && (
          <p className="text-center text-slate-400 text-[15px] leading-relaxed mb-8 max-w-sm">
            {profile.about}
          </p>
        )}

        {/* Social Icons */}
        <div className="flex flex-wrap justify-center gap-4 mb-10 w-full">
          {socialLinks.map((social: any, i: number) => {
             const Icon = PLATFORM_ICONS[social.platform.toLowerCase()] || Globe;
             return (
               <a 
                 key={i}
                 href={social.url}
                 target="_blank"
                 rel="noopener noreferrer"
                 className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all hover:scale-110 active:scale-95"
                 title={social.platform}
               >
                 <Icon className="w-5 h-5 text-indigo-400" />
               </a>
             );
          })}
        </div>

        {/* Bio Links List */}
        <div className="w-full flex flex-col gap-4">
          {bioLinks.length > 0 ? (
            bioLinks.map((link: any, i: number) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-500/50 rounded-2xl p-4 flex items-center justify-between transition-all hover:-translate-y-1 shadow-lg backdrop-blur-sm overflow-hidden"
              >
                <div className="absolute inset-y-0 left-0 w-1 bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                     <ExternalLink className="w-5 h-5 text-indigo-400" />
                   </div>
                   <span className="font-bold text-[16px] tracking-tight">{link.title}</span>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-indigo-400 transform group-hover:translate-x-1 transition-all" />
              </a>
            ))
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-3xl">
              <p className="text-slate-500 text-sm italic">No links added yet.</p>
            </div>
          )}
        </div>

        {/* Footer Brand */}
        <div className="mt-20 flex flex-col items-center gap-4">
           <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
              <span className="text-[10px] font-black tracking-[0.2em] uppercase">Powered by</span>
              <div className="text-xl font-black tracking-tight flex items-center">
                sah<span className="bg-indigo-600 text-white rounded-[4px] px-1 mx-[2px] -rotate-3">ayog</span>
              </div>
           </div>
           <button 
             className="text-xs text-indigo-400/60 hover:text-indigo-400 font-bold tracking-tight bg-indigo-500/5 px-4 py-2 rounded-full border border-indigo-500/10"
             onClick={() => window.location.href = '/'}
           >
             Create your own link-in-bio
           </button>
        </div>

      </div>

    </main>
  );
}
