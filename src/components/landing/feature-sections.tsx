import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

const FEATURES = [
  {
    id: "guests",
    title: "Invite remote guests instantly",
    description: "Scale your streams with ease. Bring in co-hosts, interview experts, and manage multiple video feeds perfectly synced.",
    bullets: [
      "Up to 10 guests seamlessly integrated",
      "Green room and private chat before broadcast",
      "High-fidelity individual audio tracks"
    ],
    image: "/landing/feature_guests_1776451290983.png",
    reverse: false,
  },
  {
    id: "multistream",
    title: "Stream to all platforms at once",
    description: "Why choose one audience? Broadcast synchronously to YouTube, Facebook, LinkedIn, Twitch, and custom RTMP destinations.",
    bullets: [
      "One click multi-destination publishing",
      "Unified chat across all platforms",
      "Adaptive bitrate optimization"
    ],
    image: "/landing/feature_multiplatform_1776451310412.png",
    reverse: true,
  },
  {
    id: "branding",
    title: "Professional branding tools",
    description: "Make your stream look like a premium TV broadcast. Add logos, lower thirds, backgrounds, and custom video overlays effortlessly.",
    bullets: [
      "Drag-and-drop overlay manager",
      "Animated lower thirds and name tags",
      "Save custom brand kits for different shows"
    ],
    image: "/landing/feature_branding_1776451325872.png",
    reverse: false,
  }
];

export function FeatureSections() {
  return (
    <section className="py-24 overflow-hidden" id="product">
      <div className="max-w-[1200px] mx-auto px-6 space-y-32">
        {FEATURES.map((feature, idx) => (
          <div 
            key={feature.id} 
            className={`flex flex-col gap-12 lg:gap-20 items-center ${
              feature.reverse ? "lg:flex-row-reverse" : "lg:flex-row"
            }`}
          >
            {/* Text Content */}
            <div className="flex-1 space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white leading-[1.2]">
                {feature.title}
              </h2>
              <p className="text-lg text-slate-300 font-medium leading-relaxed">
                {feature.description}
              </p>
              
              <ul className="space-y-4 pt-2">
                {feature.bullets.map((bullet, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-200">
                    <CheckCircle2 className="w-6 h-6 text-blue-500 fill-blue-500/20 flex-shrink-0 mt-0.5" />
                    <span className="text-[1.05rem]">{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mockup Mockup */}
            <div className="flex-1 w-full relative">
              {/* Decorative Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 bg-blue-600/10 rounded-full blur-[80px] -z-10" />
              
              <div className="relative w-full aspect-[4/3] rounded-3xl overflow-visible group">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  fill
                  className="object-contain drop-shadow-[0_15px_40px_rgba(0,0,0,0.4)] group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
