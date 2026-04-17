import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const RESOURCES = [
  {
    tag: "TUTORIAL",
    title: "How to multistream on YouTube & Twitch for absolute beginners",
    img: "/landing/blog_thumb_1_1776451354225.png",
    color: "from-orange-500 to-red-500"
  },
  {
    tag: "GEAR GUIDE",
    title: "The best microphones for live streaming under $200 (2026 update)",
    img: "/landing/blog_thumb_2_1776451367952.png",
    color: "from-blue-400 to-indigo-500"
  },
  {
    tag: "GROWTH",
    title: "How to increase your live chat engagement instantly",
    img: "/landing/blog_thumb_3_1776451383328.png",
    color: "from-amber-200 to-amber-500 text-amber-900" 
  },
  {
    tag: "STRATEGY",
    title: "When is the best time to go live? Our massive data study",
    img: "/landing/blog_thumb_4_1776451396384.png",
    color: "from-cyan-400 to-blue-500"
  }
];

export function BlogSection() {
  return (
    <section className="py-24 bg-white/[0.02]" id="resources">
      <div className="max-w-[1200px] mx-auto px-6">
        
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
            Stream better, grow faster
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Discover in-depth guides, practical advice, and proven strategies to help you create higher-quality content and engage your audience. <Link href="#" className="text-blue-400 hover:text-blue-300 hover:underline underline-offset-4">Read our blog</Link>
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {RESOURCES.map((resource, i) => (
            <Link 
              href="#" 
              key={i}
              className="group flex flex-col items-start bg-[#0D1321] rounded-2xl border border-white/5 overflow-hidden hover:border-white/10 hover:bg-[#121A2A] transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
            >
              {/* Thumbnail image */}
              <div className="w-full aspect-[4/3] bg-gradient-to-br relative overflow-hidden">
                 <div className={`absolute inset-0 bg-gradient-to-br ${resource.color} opacity-40 group-hover:opacity-50 transition-opacity z-0`}></div>
                 <Image 
                   src={resource.img} 
                   alt={resource.title} 
                   fill
                   className="object-cover mix-blend-overlay group-hover:scale-105 transition-transform duration-500"
                 />
              </div>
              
              {/* Card Content */}
              <div className="p-6 flex flex-col flex-grow">
                <span className="text-[10px] font-bold tracking-wider text-slate-400 mb-3 uppercase">
                  {resource.tag}
                </span>
                <h3 className="text-lg font-bold text-white mb-6 leading-snug group-hover:text-blue-400 transition-colors">
                  {resource.title}
                </h3>
                
                <div className="mt-auto flex items-center gap-2 text-sm font-semibold text-blue-500 group-hover:text-blue-400">
                  Read more
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
