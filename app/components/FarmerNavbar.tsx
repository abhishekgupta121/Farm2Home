"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Leaf,
  LogOut,
  Menu,
  X,
  UploadCloud,
  LayoutDashboard,
  User,
  TrendingUp,
  Star,
  CalendarClock,
  Sprout,
  ShoppingBag,
  PhoneCall,
  ChevronDown,
  DollarSign,
} from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

const farmerLinks = [
  { name: "Upload Crops", href: "/farmer", icon: UploadCloud },
  { name: "Ugly Sell", href: "/farmer/ugly-sell", icon: Star },
  { name: "Pre-list", href: "/farmer/pre-list", icon: CalendarClock },
  { name: "Dashboard", href: "/farmer/dashboard", icon: LayoutDashboard },
  { name: "Profile", href: "/farmer/profile", icon: User },
];

const publicLinks = [
  { name: "Features", href: "/features", icon: ShoppingBag },
  { name: "Market Prices", href: "/market-prices", icon: TrendingUp },
  { name: "Contact", href: "/contact", icon: PhoneCall },
];

export default function FarmerNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { language, setLanguage } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [farmerMenuOpen, setFarmerMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const farmerMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch {}
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close farmer dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (farmerMenuRef.current && !farmerMenuRef.current.contains(e.target as Node)) {
        setFarmerMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");
    router.push("/");
  };

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Spacer for fixed navbar */}
      <div className="h-24" />

      <div className="fixed top-5 left-0 w-full z-50 px-4 md:px-8 lg:px-16 pointer-events-none">
        <nav
          className={`mx-auto max-w-[1400px] flex items-center justify-between px-6 md:px-10 py-4 rounded-[2rem] pointer-events-auto transition-all duration-500 ${
            scrolled
              ? "shadow-[0_20px_60px_rgba(0,40,20,0.5)] border border-white/10"
              : "shadow-[0_10px_40px_rgba(0,40,20,0.3)] border border-white/10"
          } glass-rolex`}
        >
          {/* Logo */}
          <Link href="/farmer" className="flex items-center gap-3 group shrink-0">
            <div className="relative overflow-hidden rounded-xl bg-white p-2 text-emerald-800 shadow-lg transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
              <Leaf size={20} className="relative z-10" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-white leading-none">
                Farm2<span className="text-amber-400">Home</span>
              </h1>
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-emerald-300 mt-0.5">
                Farmer Portal
              </p>
            </div>
          </Link>

          {/* Desktop — Public Links */}
          <div className="hidden lg:flex items-center gap-6">
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-bold transition-all relative group py-1 ${
                  isActive(link.href)
                    ? "text-amber-400"
                    : "text-emerald-50/70 hover:text-white"
                }`}
              >
                {link.name}
                <span
                  className={`absolute bottom-0 left-0 h-0.5 bg-amber-400 transition-all duration-300 ${
                    isActive(link.href) ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            ))}
          </div>

          {/* Desktop — Farmer Tools Dropdown */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="relative" ref={farmerMenuRef}>
              <button
                onClick={() => setFarmerMenuOpen(!farmerMenuOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-700/40 hover:bg-emerald-600/50 border border-emerald-500/30 text-white font-bold text-sm transition-all"
              >
                <Sprout size={16} className="text-amber-400" />
                Farmer Tools
                <ChevronDown
                  size={14}
                  className={`text-emerald-300 transition-transform duration-300 ${
                    farmerMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {farmerMenuOpen && (
                <div className="absolute top-full mt-3 right-0 w-56 glass-rolex border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-fade-up z-50">
                  {farmerLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setFarmerMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-all ${
                          isActive(link.href)
                            ? "bg-emerald-700/60 text-amber-400"
                            : "text-emerald-100/80 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <Icon size={16} className="opacity-70" />
                        {link.name}
                        {isActive(link.href) && (
                          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Language Switcher */}
            <div className="flex items-center gap-1 bg-black/20 p-1 rounded-xl border border-white/10">
              {(["en", "hi"] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all duration-300 ${
                    language === lang
                      ? "bg-white text-emerald-900 shadow-md"
                      : "text-emerald-100/50 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {lang === "en" ? "EN" : "हिं"}
                </button>
              ))}
            </div>

            {/* Wallet & User Logout */}
            <div className="flex items-center gap-3 pl-3 border-l border-white/10">
              {/* Farmer Wallet */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-700/40 border border-emerald-500/30 rounded-xl">
                <div className="w-6 h-6 bg-amber-400 rounded-lg flex items-center justify-center text-emerald-900">
                  <DollarSign size={14} strokeWidth={3} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] font-black uppercase tracking-tighter text-emerald-300 leading-none">Earnings</span>
                  <span className="text-xs font-black text-white leading-none">₹{user?.walletBalance || 0}</span>
                </div>
              </div>

              {user && (
                <span className="text-xs font-bold text-emerald-300 max-w-[80px] truncate">
                  {user.name}
                </span>
              )}
              <button
                onClick={handleLogout}
                title="Logout"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/40 border border-red-400/20 text-red-300 hover:text-red-200 font-bold text-sm transition-all"
              >
                <LogOut size={15} />
                Logout
              </button>
            </div>
          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden text-white p-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>

        {/* Mobile Dropdown */}
        {mobileOpen && (
          <div className="mx-auto max-w-[1400px] mt-2 glass-rolex border border-white/10 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto animate-fade-up">
            {/* Public Links */}
            <div className="p-4 space-y-1 border-b border-white/10">
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 px-3 mb-2">
                General
              </p>
              {publicLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      isActive(link.href)
                        ? "bg-emerald-700/50 text-amber-400"
                        : "text-emerald-100/70 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon size={16} />
                    {link.name}
                  </Link>
                );
              })}
            </div>

            {/* Farmer Links */}
            <div className="p-4 space-y-1 border-b border-white/10">
              <p className="text-[10px] font-black uppercase tracking-widest text-amber-400 px-3 mb-2">
                Farmer Tools
              </p>
              {farmerLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      isActive(link.href)
                        ? "bg-emerald-700/50 text-amber-400"
                        : "text-emerald-100/70 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon size={16} />
                    {link.name}
                  </Link>
                );
              })}
            </div>

            {/* Language + Logout */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-1 bg-black/20 p-1 rounded-xl border border-white/10">
                {(["en", "hi"] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all duration-300 ${
                      language === lang
                        ? "bg-white text-emerald-900 shadow-md"
                        : "text-emerald-100/50 hover:text-white"
                    }`}
                  >
                    {lang === "en" ? "EN" : "हिं"}
                  </button>
                ))}
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/20 border border-red-400/20 text-red-300 font-bold text-sm hover:bg-red-500/40 transition"
              >
                <LogOut size={15} />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
