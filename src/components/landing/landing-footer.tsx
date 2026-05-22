import Link from "next/link";
import { Play } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="bg-[#070B14] pt-20 pb-10 border-t border-white/5">
      <div className="max-w-[1200px] mx-auto px-6">
        
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-16">
          {/* Logo Column */}
          <div className="col-span-2 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4 group inline-flex">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <Play className="w-4 h-4 text-white fill-white ml-0.5 group-hover:scale-110 transition-transform" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">Sahayog</span>
            </Link>
            <p className="text-slate-400 text-sm mb-6 max-w-xs">
              The easiest way to create professional live streams and recordings directly in your browser.
            </p>
          </div>

          {/* Product */}
          <div className="col-span-1">
            <h4 className="text-white font-semibold mb-4 text-sm tracking-wide uppercase">Product</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Studio</Link></li>
              <li><Link href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Multistreaming</Link></li>
              <li><Link href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Recording</Link></li>
              <li><Link href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Pricing</Link></li>
              <li><Link href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Destinations</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="col-span-1">
            <h4 className="text-white font-semibold mb-4 text-sm tracking-wide uppercase">Resources</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Blog</Link></li>
              <li><Link href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Help Center</Link></li>
              <li><Link href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Community</Link></li>
              <li><Link href="#" className="text-slate-400 hover:text-white transition-colors text-sm">System Status</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="col-span-1">
            <h4 className="text-white font-semibold mb-4 text-sm tracking-wide uppercase">Company</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="text-slate-400 hover:text-white transition-colors text-sm">About Us</Link></li>
              <li><Link href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Careers</Link></li>
              <li><Link href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Partners</Link></li>
              <li><Link href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Contact</Link></li>
            </ul>
          </div>

          {/* Legal / Social */}
          <div className="col-span-1 border-t border-white/5 pt-8 md:border-t-0 md:pt-0">
             <h4 className="text-white font-semibold mb-4 text-sm tracking-wide uppercase">Legal</h4>
              <ul className="space-y-3 mb-8">
                <li><Link href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Terms of Service</Link></li>
                <li><Link href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Privacy Policy</Link></li>
              </ul>
              
              <div className="flex items-center gap-4">
                <Link href="#" className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                  <span className="text-slate-300 font-bold text-xs">X</span>
                </Link>
                <Link href="#" className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                  <span className="text-slate-300 font-bold text-xs">YT</span>
                </Link>
                <Link href="#" className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                  <span className="text-slate-300 font-bold text-xs">IN</span>
                </Link>
              </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Sahayog. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}
