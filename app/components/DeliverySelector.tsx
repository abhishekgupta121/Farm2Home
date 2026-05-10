"use client";

import { useState } from "react";
import { Bike, TreePine, Zap, CheckCircle } from "lucide-react";

interface DeliveryOption {
  id: "home_delivery" | "farm_pickup" | "express_delivery";
  label: string;
  icon: React.ReactNode;
  description: string;
  charge: number;
  chargeLabel: string;
  eta: string;
  gradient: string;
  activeRing: string;
}

const OPTIONS: DeliveryOption[] = [
  {
    id: "home_delivery",
    label: "Home Delivery",
    icon: <Bike size={22} />,
    description: "Delivered to your doorstep with insulated packaging",
    charge: 40,
    chargeLabel: "₹40",
    eta: "24–48 hours",
    gradient: "from-green-500 to-emerald-500",
    activeRing: "ring-green-500",
  },
  {
    id: "farm_pickup",
    label: "Farm Pickup",
    icon: <TreePine size={22} />,
    description: "Collect directly from the farmer — freshest possible",
    charge: 0,
    chargeLabel: "Free",
    eta: "Flexible schedule",
    gradient: "from-amber-500 to-orange-500",
    activeRing: "ring-amber-500",
  },
  {
    id: "express_delivery",
    label: "Express Delivery",
    icon: <Zap size={22} />,
    description: "Same-day priority delivery for urgent orders",
    charge: 100,
    chargeLabel: "₹100",
    eta: "Same day",
    gradient: "from-blue-500 to-violet-500",
    activeRing: "ring-blue-500",
  },
];

interface DeliverySelectorProps {
  selected: string;
  onSelect: (method: string, charge: number) => void;
}

export default function DeliverySelector({ selected, onSelect }: DeliverySelectorProps) {
  return (
    <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6">
      <h3 className="text-lg font-black text-slate-900 mb-5 flex items-center gap-2">
        🚚 <span>Choose Delivery Method</span>
      </h3>

      <div className="space-y-3">
        {OPTIONS.map((option) => {
          const isActive = selected === option.id;
          return (
            <button
              key={option.id}
              onClick={() => onSelect(option.id, option.charge)}
              className={`w-full text-left flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 active:scale-[0.99] ${
                isActive
                  ? `border-transparent ring-2 ${option.activeRing} bg-slate-50`
                  : "border-slate-200 hover:border-slate-300 bg-white"
              }`}
            >
              {/* Icon */}
              <div className={`p-3 rounded-xl bg-gradient-to-br ${option.gradient} text-white shrink-0 shadow-md`}>
                {option.icon}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-black text-slate-900">{option.label}</span>
                  {option.id === "farm_pickup" && (
                    <span className="text-[10px] bg-green-100 text-green-700 font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Free</span>
                  )}
                  {option.id === "express_delivery" && (
                    <span className="text-[10px] bg-blue-100 text-blue-700 font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Fastest</span>
                  )}
                </div>
                <p className="text-slate-500 text-sm font-medium mt-0.5">{option.description}</p>
                <p className="text-xs font-bold text-slate-400 mt-1">⏱ {option.eta}</p>
              </div>

              {/* Charge & Radio */}
              <div className="text-right shrink-0 flex flex-col items-end gap-2">
                <span className="text-lg font-black text-slate-900">{option.chargeLabel}</span>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  isActive ? `border-transparent bg-gradient-to-br ${option.gradient}` : "border-slate-300"
                }`}>
                  {isActive && <CheckCircle size={12} className="text-white" strokeWidth={3} />}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected summary */}
      {selected && (
        <div className="mt-4 p-3 bg-slate-50 rounded-xl flex justify-between items-center text-sm border border-slate-100">
          <span className="text-slate-500 font-bold">Delivery charge</span>
          <span className="text-slate-900 font-black">
            {OPTIONS.find((o) => o.id === selected)?.chargeLabel}
          </span>
        </div>
      )}
    </div>
  );
}

export { OPTIONS as DELIVERY_OPTIONS };
