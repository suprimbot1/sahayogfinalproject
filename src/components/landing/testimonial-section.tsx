import { Star } from "lucide-react";
import Image from "next/image";

const TESTIMONIALS = [
  {
    name: "Alex Rivera",
    handle: "@arivera_dev",
    quote: "I am a longtime user of Sahayog and the reason that I use it is because it is amazing. It is fluid, I never have issues with dropping my livestream, I love all of the tools that are inside of Sahayog and I'm able to use it with a team seamlessly! Love you Sahayog!",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
  },
  {
    name: "Sarah Chen",
    handle: "@sarah.streams",
    quote: "I have used this system for 2 years and I am in camera heaven with my co-host on Sahayog. Thank you for every config created!",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
  },
  {
    name: "Marcus Thorne",
    handle: "@mthorne_games",
    quote: "The interface is simply stunning. It feels like a high-end studio in my browser. Highly recommend for any serious creator.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop"
  }
];

export function TestimonialSection() {
  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight uppercase">Trusted by Creators</h2>
          <p className="text-slate-400 max-w-2xl mx-auto italic">
            See what the community is saying about their experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-[32px] hover:bg-white/10 transition-all group">
              <p className="text-slate-300 text-sm leading-relaxed mb-8 italic">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl overflow-hidden grayscale group-hover:grayscale-0 transition-all">
                  <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm tracking-tight">{t.name}</h4>
                  <p className="text-slate-500 text-[11px] font-black uppercase tracking-widest">
                    created on Sahayog
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
