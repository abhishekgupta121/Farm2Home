"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Leaf,
  ShoppingCart,
  ShoppingBag,
  Tractor,
  ShieldCheck,
  TrendingUp,
  Languages,
  Carrot,
  Truck,
  Sprout,
} from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import DeliveryFlipCards from "@/app/components/DeliveryFlipCards";

export default function HomePage() {
  const router = useRouter();
  const { t, language, setLanguage } = useLanguage();

  const features = [
    {
      title: t("feat1Title"),
      description: t("feat1Desc"),
      icon: ShoppingBag,
      color: "bg-green-50 text-green-600",
    },
    {
      title: t("feat2Title"),
      description: t("feat2Desc"),
      icon: ShieldCheck,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: t("feat3Title"),
      description: t("feat3Desc"),
      icon: TrendingUp,
      color: "bg-orange-50 text-orange-600",
    },
    {
      title: t("feat4Title"),
      description: t("feat4Desc"),
      icon: Languages,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      if (parsedUser.role === "farmer") router.push("/farmer/dashboard");
      else if (parsedUser.role === "admin") router.push("/admin/dashboard");
      else router.push("/consumer/dashboard");
    }
  }, [router]);

  return (
    <main className="min-h-screen mesh-gradient text-slate-900 selection:bg-green-100 selection:text-green-900 relative overflow-hidden">
      {/* Background Texture & Particles */}
      <div className="fixed inset-0 -z-20 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/carbon-fibre.png")' }}></div>
      <div className="fixed inset-0 -z-20 bg-dot-pattern opacity-30"></div>
      
      {/* Minimalist Hero Decorations */}
      <div className="fixed top-[18%] left-[4%] opacity-30 animate-float text-green-600 z-0 pointer-events-none transition-all duration-1000 hover:scale-110">
        <Tractor size={130} />
      </div>

      <div className="fixed top-[15%] right-[5%] opacity-30 animate-float text-orange-600 z-0 pointer-events-none transition-all duration-1000 hover:scale-110">
        <Carrot size={120} />
      </div>

      <div className="fixed top-[-10%] left-[-10%] w-[60%] h-[60%] bg-green-200/30 rounded-full blur-[140px] animate-pulse-blob -z-20"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-orange-100/40 rounded-full blur-[140px] animate-pulse-blob -z-20" style={{ animationDelay: '2s' }}></div>

      {/* Premium Floating Navbar */}
      <div className="fixed top-6 left-0 w-full z-50 px-6 lg:px-16 pointer-events-none">
        <nav className="mx-auto max-w-[1400px] glass-rolex border border-white/10 px-10 py-5 flex items-center justify-between rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,40,20,0.4)] pointer-events-auto">
          <div className="flex items-center gap-4 group cursor-pointer" onClick={() => router.push("/")}>
            <div className="relative overflow-hidden rounded-2xl bg-white p-2.5 text-emerald-800 shadow-lg transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
              <Leaf size={24} className="relative z-10" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white leading-none">
                {t("farm2home")}
              </h1>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-200 mt-1">
                {t("subtitle")}
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-8 md:flex">
            {["features", "marketPrices", "contact"].map((item) => (
              <Link
                key={item}
                href={`/${item === "features" ? "features" : item === "marketPrices" ? "market-prices" : "contact"}`}
                className="text-sm font-bold text-emerald-50/80 transition-all hover:text-white relative group py-2"
              >
                {t(item as any)}
                <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-6">
            {/* Aesthetic Language Switcher */}
            <div className="flex items-center gap-1 bg-black/20 p-1.5 rounded-2xl border border-white/10 shadow-inner">
              <button 
                onClick={() => setLanguage("en")}
                className={`px-4 py-1.5 text-xs font-black rounded-xl transition-all duration-300 ${language === 'en' ? 'bg-white text-emerald-900 shadow-lg scale-105' : 'text-emerald-100/50 hover:text-white hover:bg-white/5'}`}
              >
                EN
              </button>
              <button 
                onClick={() => setLanguage("hi")}
                className={`px-4 py-1.5 text-xs font-black rounded-xl transition-all duration-300 ${language === 'hi' ? 'bg-white text-emerald-900 shadow-lg scale-105' : 'text-emerald-100/50 hover:text-white hover:bg-white/5'}`}
              >
                हिं
              </button>
            </div>
            
            <button 
              onClick={() => router.push("/login")}
              className="hidden sm:flex items-center gap-2 text-sm font-black text-emerald-900 px-6 py-3 rounded-2xl bg-white hover:bg-amber-400 transition-all duration-300 shadow-lg hover:-translate-y-1 active:scale-95"
            >
              Login
            </button>
          </div>
        </nav>
      </div>

      <div className="h-28"></div> {/* Spacer for fixed navbar */}

      {/* High-Impact Hero Section */}
      <section className="relative px-6 py-12 lg:px-16 lg:py-24 overflow-hidden animate-fade-up" style={{ animationDelay: '0.1s' }}>
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-16 lg:grid-cols-12">
            {/* Left Content */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-md px-4 py-2 text-xs font-bold text-green-700 border border-green-100 mb-8 shadow-sm">
                <ShieldCheck size={16} />
                {t("trustedPlatform")}
              </div>

              <h2 className="mb-8 text-5xl font-[900] leading-[1.1] text-slate-900 lg:text-7xl tracking-tighter">
                {t("heroTitle1")}
                <span className="text-gradient"> {t("heroTitleFarmers")} </span>
                <br />
                {t("heroTitle2")}
              </h2>

              <p className="mb-12 max-w-xl text-lg leading-relaxed text-slate-600 font-medium">
                {t("heroDesc")}
              </p>

              {/* Action Cards */}
              <div className="flex flex-col sm:flex-row gap-6">
                <button
                  onClick={() => router.push("/signup/farmer")}
                  className="group relative flex items-center gap-5 glass p-5 pr-10 rounded-[2rem] transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 lighting-green text-left overflow-hidden border-white/60 glare-effect"
                >
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border-2 border-white shadow-lg">
                    <Image
                      src="/farmer_avatar.png"
                      alt="Farmer"
                      fill
                      sizes="64px"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900">{t("iamFarmer")}</h3>
                    <p className="text-green-600 text-[10px] font-black uppercase tracking-widest mt-1">
                      Start selling now →
                    </p>
                  </div>
                  <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Tractor size={80} />
                  </div>
                </button>

                <button
                  onClick={() => router.push("/signup/consumer")}
                  className="group relative flex items-center gap-5 glass p-5 pr-10 rounded-[2rem] transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 lighting-pink text-left overflow-hidden border-white/60 glare-effect"
                >
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border-2 border-white shadow-lg">
                    <Image
                      src="/consumer_avatar.png"
                      alt="Consumer"
                      fill
                      sizes="64px"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900">{t("iamConsumer")}</h3>
                    <p className="text-pink-600 text-[10px] font-black uppercase tracking-widest mt-1">
                      Start buying now →
                    </p>
                  </div>
                  <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <ShoppingCart size={80} />
                  </div>
                </button>
              </div>
            </div>

            {/* Right Visual */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-square w-full overflow-hidden rounded-[3.5rem] shadow-2xl border-[12px] border-white/60 glass glare-effect">
                <Image
                  src="/farm2home_hero_visual.png"
                  alt="Farm2Home Hero"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover transition-transform duration-[2000ms] hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
              </div>

              {/* Stats/Floating Cards */}
              <div className="absolute -left-12 bottom-12 hidden xl:block animate-float">
                <div className="glass p-6 rounded-3xl shadow-xl border-white/80 min-w-[220px] glare-effect">
                  <div className="flex items-center gap-4">
                    <div className="bg-orange-100 text-orange-600 p-3.5 rounded-2xl shadow-inner">
                      <TrendingUp size={24} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-800">{t("liveMarket")}</h4>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter mt-0.5">{t("realTimeTrends")}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -right-8 top-1/4 hidden xl:block animate-float-reverse">
                <div className="glass p-4 rounded-full shadow-2xl border-white/80 flex items-center gap-3 glare-effect">
                  <div className="bg-green-600 text-white p-2.5 rounded-full shadow-lg">
                    <Leaf size={18} />
                  </div>
                  <span className="text-xs font-black text-slate-800 pr-3 tracking-tight">100% Organic</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges - Row of Confidence */}
      <section className="px-6 py-12 lg:px-16 border-y border-white/20 bg-white/10 backdrop-blur-sm relative z-10 animate-fade-up" style={{ animationDelay: '0.2s' }}>
        <div className="mx-auto max-w-7xl flex flex-wrap justify-center gap-12 lg:gap-24 opacity-60">
          {[
            { icon: ShieldCheck, label: "Government Verified" },
            { icon: Leaf, label: "100% Organic Quality" },
            { icon: ShoppingCart, label: "Direct Farm-to-Table" },
            { icon: TrendingUp, label: "Fair Market Pricing" },
          ].map((badge, i) => (
            <div key={i} className="flex items-center gap-3 grayscale hover:grayscale-0 transition-all duration-500">
              <badge.icon size={28} className="text-green-600" />
              <span className="text-sm font-black uppercase tracking-widest text-slate-900">{badge.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section - Clean & Modern */}
      <section className="px-6 py-24 lg:px-16 bg-white/30 backdrop-blur-sm relative animate-fade-up" style={{ animationDelay: '0.3s' }}>
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
        
        <div className="mx-auto max-w-7xl text-center mb-24">
          <h3 className="text-5xl font-black text-slate-900 mb-8 lg:text-6xl tracking-tight">
            {t("platformFeatures")}
          </h3>
          <p className="mx-auto max-w-2xl text-xl text-slate-600 font-medium">
            {t("featuresDesc")}
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-10 rounded-[3rem] glass transition-all duration-500 hover:bg-white hover:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] hover:-translate-y-3 hover:border-white border-white/40 glare-effect"
            >
              <div className={`mb-10 inline-flex rounded-[1.5rem] p-5 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 shadow-inner ${feature.color}`}>
                <feature.icon size={36} />
              </div>
              <h4 className="mb-4 text-2xl font-black text-slate-900 tracking-tight">
                {feature.title}
              </h4>
              <p className="text-sm leading-relaxed text-slate-500 font-bold uppercase tracking-wide opacity-80 group-hover:opacity-100 transition-opacity">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials - Adding the Human Touch */}
      <section className="px-6 py-24 lg:px-16 relative z-10 animate-fade-up" style={{ animationDelay: '0.4s' }}>
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h3 className="text-5xl font-black text-slate-900 mb-8 tracking-tight leading-tight">
                {t("testimonialTitle")}
              </h3>
              <p className="text-xl text-slate-600 font-medium mb-12">
                {t("testimonialSubtitle")}
              </p>
              <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-slate-800 transition-all shadow-xl hover:-translate-y-1">
                {t("readAllStories")}
              </button>
            </div>
            
            <div className="grid gap-6">
              {[
                { name: t("test1Name"), role: t("test1Role"), text: t("test1Text") },
                { name: t("test2Name"), role: t("test2Role"), text: t("test2Text") }
              ].map((test, i) => (
                <div key={i} className="glass p-8 rounded-3xl border-white/60 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 glare-effect">
                  <p className="text-lg font-bold text-slate-800 mb-6 italic">"{test.text}"</p>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-600"></div>
                    <div>
                      <h4 className="font-black text-slate-900">{test.name}</h4>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{test.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="pb-24">
        <DeliveryFlipCards />
      </div>

      {/* Modern Footer */}
      <footer className="px-6 py-20 lg:px-16 bg-slate-900 text-white rounded-t-[5rem] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-emerald-400 to-green-600"></div>
        <div className="mx-auto max-w-7xl relative z-10">
          <div className="flex flex-col items-center justify-between gap-16 md:flex-row">
            <div className="text-center md:text-left">
              <div className="flex items-center gap-4 justify-center md:justify-start mb-6 group cursor-pointer">
                <div className="bg-green-600 p-3 rounded-2xl transition-transform group-hover:rotate-12">
                  <Leaf className="text-white" size={32} />
                </div>
                <h4 className="text-4xl font-black tracking-tighter">{t("farm2home")}</h4>
              </div>
              <p className="text-slate-400 max-w-sm text-base font-medium leading-relaxed">
                {t("empowering")}
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-12">
              {["privacy", "terms", "support"].map(item => (
                <button key={item} className="text-sm font-black text-slate-500 hover:text-white transition-all hover:tracking-widest uppercase tracking-widest">
                  {t(item as any)}
                </button>
              ))}
            </div>

            <div className="flex gap-5">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-12 w-12 rounded-2xl bg-slate-800 flex items-center justify-center hover:bg-green-600 transition-all cursor-pointer border border-slate-700 hover:-translate-y-1 shadow-lg">
                  <div className="w-5 h-5 bg-white/20 rounded-md"></div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-20 pt-10 border-t border-slate-800 text-center text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">
            © 2024 Farm2Home Marketplace • Connecting Roots to Tables
          </div>
        </div>
      </footer>
    </main>
  );
}