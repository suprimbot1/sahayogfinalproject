import { Star } from "lucide-react";
import Image from "next/image";

const TESTIMONIALS = [
  {
    quote: "This is absolutely the easiest streaming platform I know. I'm almost 50 and not a lot of technology can be easy 😅... But you guys have done an amazing job of making this crazy simple. Thank you 🙏🏼",
    name: "User Name 1",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
  },
  {
    quote: "I am a longtime user of StreamCast and the reason that I use it is because it is amazing. It is fluid, I never have issues with dropping my livestream, I love all of the tools that are inside of StreamCast and I'm able to use it with a team seamlessly! Love you StreamCast!",
    name: "User Name 2",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80",
  },
  {
    quote: "I have used this system for 2 years and I am in camera heaven with my co-host on StreamCast. Thank you for every config created!",
    name: "User Name 3",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=150&q=80",
  }
];

export function TestimonialSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-[#070B14] to-[#070B14] -z-10" />

      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
            60,000,000+ streams and recordings
            <br />
            created on StreamCast
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div 
              key={i}
              className="bg-[#111827]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-8 flex flex-col hover:border-white/10 transition-colors shadow-2xl"
            >
              <div className="flex-grow">
                <p className="text-slate-300 text-[1.05rem] leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>
              
              <div className="flex items-center gap-4 mt-8 pt-6 border-t border-white/5">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border border-white/10">
                  <img src={t.avatar} alt={t.name} className="object-cover w-full h-full" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">{t.name}</h4>
                  <div className="flex items-center gap-1 mt-1 text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
