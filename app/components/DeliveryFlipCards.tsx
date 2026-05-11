"use client";

import { useState } from "react";
import { Bike, TreePine, Zap, Clock, MapPin, Banknote, Star, Package, CheckCircle, ChevronRight } from "lucide-react";

interface DeliveryCard {
  id: string;
  icon: React.ReactNode;
  bgGradient: string;
  accentColor: string;
  borderColor: string;
  glowColor: string;
  title: string;
  subtitle: string;
  badge?: string;
  features: { icon: React.ReactNode; text: string }[];
  charge: string;
  eta: string;
}

const cards: DeliveryCard[] = [
  {
    id: "home_delivery",
    icon: <Bike size={48} strokeWidth={1.5} />,
    bgGradient: "from-green-500 to-emerald-600",
    accentColor: "text-green-600",
    borderColor: "border-green-200",
    glowColor: "shadow-green-500/20",
    title: "Home Delivery",
    subtitle: "Farm fresh, at your doorstep",
    badge: "Most Popular",
    features: [
      { icon: <Clock size={14} />, text: "Delivery within 24–48 hours" },
      { icon: <MapPin size={14} />, text: "Live order tracking" },
      { icon: <Banknote size={14} />, text: "Cash on Delivery available" },
      { icon: <Package size={14} />, text: "Insulated packaging for freshness" },
    ],
    charge: "₹40",
    eta: "24–48 hrs",
  },
  {
    id: "farm_pickup",
    icon: <TreePine size={48} strokeWidth={1.5} />,
    bgGradient: "from-amber-500 to-orange-500",
    accentColor: "text-amber-600",
    borderColor: "border-amber-200",
    glowColor: "shadow-amber-500/20",
    title: "Farm Pickup",
    subtitle: "Collect directly from the source",
    features: [
      { icon: <CheckCircle size={14} />, text: "Pick up at your convenience" },
      { icon: <Banknote size={14} />, text: "Zero delivery charges" },
      { icon: <Star size={14} />, text: "Freshest produce guaranteed" },
      { icon: <MapPin size={14} />, text: "Pickup location shared via app" },
    ],
    charge: "Free",
    eta: "Flexible",
  },
];

function FlipCard({ card }: { card: DeliveryCard }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="relative h-80 cursor-pointer group"
      style={{ perspective: "1000px" }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onClick={() => setFlipped((f) => !f)}
    >
      <div
        className="relative w-full h-full transition-transform duration-700 ease-in-out"
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* FRONT */}
        <div
          className={`absolute inset-0 rounded-[2rem] bg-gradient-to-br ${card.bgGradient} flex flex-col items-center justify-center gap-5 text-white p-8 shadow-2xl ${card.glowColor}`}
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
        >
          {card.badge && (
            <span className="absolute top-5 right-5 bg-white/20 backdrop-blur-sm text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-white/30">
              {card.badge}
            </span>
          )}
          <div className="bg-white/20 backdrop-blur-sm p-5 rounded-2xl border border-white/30 shadow-inner">
            {card.icon}
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-black tracking-tight">{card.title}</h3>
            <p className="text-white/80 text-sm font-medium mt-1">{card.subtitle}</p>
          </div>
          <div className="flex items-center gap-2 text-white/70 text-xs font-bold mt-2 animate-bounce">
            <span>Hover to see details</span>
            <ChevronRight size={14} />
          </div>
        </div>

        {/* BACK */}
        <div
          className={`absolute inset-0 rounded-[2rem] bg-white border-2 ${card.borderColor} flex flex-col justify-between p-7 shadow-2xl ${card.glowColor}`}
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className={`p-2 rounded-xl bg-gradient-to-br ${card.bgGradient} text-white`}>
                {/* smaller icon */}
                {card.icon &&
                  <span className="scale-50 inline-block">{card.icon}</span>
                }
              </div>
              <div>
                <h3 className={`text-lg font-black ${card.accentColor}`}>{card.title}</h3>
                <p className="text-slate-400 text-xs font-bold">{card.subtitle}</p>
              </div>
            </div>

            <ul className="space-y-3">
              {card.features.map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-700">
                  <span className={`${card.accentColor} shrink-0`}>{f.icon}</span>
                  <span className="text-sm font-medium">{f.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={`flex items-center justify-between bg-gradient-to-r ${card.bgGradient} rounded-2xl px-5 py-3 text-white mt-4`}>
            <div>
              <p className="text-white/70 text-[10px] font-black uppercase tracking-widest">Delivery Charge</p>
              <p className="text-xl font-black">{card.charge}</p>
            </div>
            <div className="text-right">
              <p className="text-white/70 text-[10px] font-black uppercase tracking-widest">Est. Time</p>
              <p className="text-sm font-black">{card.eta}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DeliveryFlipCards() {
  return (
    <section className="py-20 px-4 sm:px-8 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-14">
          <span className="inline-block bg-green-100 text-green-700 text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full mb-4">
            🚚 Delivery Options
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            We Deliver <span className="text-green-600">Your Way</span>
          </h2>
          <p className="text-slate-500 mt-4 text-lg font-medium max-w-xl mx-auto">
            Choose how you want to receive your farm-fresh produce. Reliable, flexible, and always fresh.
          </p>
          <p className="text-slate-400 text-sm mt-2 font-bold">✨ Hover over a card to see details</p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card) => (
            <FlipCard key={card.id} card={card} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 text-center bg-gradient-to-r from-green-600 to-emerald-600 rounded-[2rem] p-8 shadow-2xl shadow-green-600/20">
          <h3 className="text-2xl font-black text-white mb-2">Ready to Order?</h3>
          <p className="text-green-100 font-medium mb-6">Browse fresh produce from local farmers and choose your preferred delivery method at checkout.</p>
          <a
            href="/consumer/dashboard"
            className="inline-flex items-center gap-2 bg-white text-green-700 font-black px-8 py-4 rounded-2xl hover:bg-green-50 transition-all duration-200 shadow-lg active:scale-95"
          >
            Shop Now <ChevronRight size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}
