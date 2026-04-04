"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Settings, BookOpen, LogOut, ShieldCheck } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export function Topbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const user = session?.user || {
    name: "Sahayog User",
    email: "user@sahayog.app",
    image: null
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-16 border-b border-border bg-white flex items-center justify-end px-8 fixed top-0 right-0 left-64 z-50 w-[calc(100%-16rem)]">
      <div className="relative" ref={dropdownRef}>
        {/* Profile Trigger */}
        <div 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-1.5 rounded-xl transition-all select-none"
        >
          <div className="w-10 h-10 rounded-full overflow-hidden border border-border bg-slate-100 flex items-center justify-center shrink-0">
            {user.image ? (
              <img src={user.image} alt={user.name || "User"} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                {user.name?.charAt(0) || "U"}
              </div>
            )}
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-sm font-bold text-slate-900 leading-none mb-1">
              {user.name}
            </span>
            <span className="text-[11px] font-medium text-slate-500 leading-none">
              {user.email}
            </span>
          </div>
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </div>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 mt-3 w-72 bg-white rounded-3xl shadow-2xl border border-slate-100 py-3 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* User Header */}
            <div className="px-5 py-4 flex items-center gap-4 border-b border-slate-50 mb-2">
               <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-100 shrink-0">
                  {user.image ? (
                    <img src={user.image} alt={user.name || "User"} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
                      {user.name?.charAt(0)}
                    </div>
                  )}
               </div>
               <div className="flex flex-col">
                  <span className="text-[15px] font-black text-slate-900 leading-tight">{user.name}</span>
                  <span className="text-xs font-medium text-slate-400">{user.email}</span>
               </div>
            </div>

            {/* Links */}
            <div className="px-2 space-y-1">
              <Link 
                href="/tips/configuration"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-4 px-4 py-3 text-[15px] font-bold text-slate-700 hover:bg-slate-50 rounded-2xl transition-colors group"
              >
                <div className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-white border border-transparent group-hover:border-slate-100 transition-all">
                  <ShieldCheck className="w-4 h-4 text-slate-500" />
                </div>
                Account Settings
              </Link>
              
              <Link 
                href="/terms"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-4 px-4 py-3 text-[15px] font-bold text-slate-700 hover:bg-slate-50 rounded-2xl transition-colors group"
              >
                <div className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-white border border-transparent group-hover:border-slate-100 transition-all">
                  <BookOpen className="w-4 h-4 text-slate-500" />
                </div>
                Terms and Conditions
              </Link>
            </div>

            {/* Separator */}
            <div className="h-px bg-slate-50 my-2 mx-4" />

            {/* Logout */}
            <div className="px-2">
              <button 
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center gap-4 w-full px-4 py-3 text-[15px] font-black text-rose-500 hover:bg-rose-50 rounded-2xl transition-colors group"
              >
                <div className="w-9 h-9 flex items-center justify-center">
                  <LogOut className="w-4 h-4" />
                </div>
                Log out
              </button>
            </div>

          </div>
        )}
      </div>
    </header>
  );
}
