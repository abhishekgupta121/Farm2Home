"use client";

import { CheckCircle, Circle, Truck, Package, MapPin, Home } from "lucide-react";

const STAGES = [
  { key: "pending", label: "Order Placed", icon: <Package size={16} /> },
  { key: "confirmed", label: "Confirmed", icon: <CheckCircle size={16} /> },
  { key: "in_transit", label: "Out for Delivery", icon: <Truck size={16} /> },
  { key: "delivered", label: "Delivered", icon: <Home size={16} /> },
];

const STATUS_ORDER = ["pending", "confirmed", "in_transit", "delivered"];

interface OrderTimelineProps {
  status: string;
  method?: string;
  estimatedDate?: string;
  timeline?: { stage: string; timestamp: string; note?: string }[];
}

export default function OrderTimeline({ status, method, estimatedDate, timeline = [] }: OrderTimelineProps) {
  const currentIndex = STATUS_ORDER.indexOf(status);

  return (
    <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6">
      <h3 className="text-base font-black text-slate-900 mb-6 flex items-center gap-2">
        <Truck size={18} className="text-green-600" />
        Order Status
      </h3>

      {/* Stage Tracker */}
      <div className="relative flex justify-between items-start mb-8">
        {/* Progress bar */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-200 z-0" />
        <div
          className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500 z-0 transition-all duration-700"
          style={{ width: `${Math.min((currentIndex / (STAGES.length - 1)) * 100, 100)}%` }}
        />

        {STAGES.map((stage, i) => {
          const isDone = i < currentIndex;
          const isCurrent = i === currentIndex;
          const isPending = i > currentIndex;

          return (
            <div key={stage.key} className="flex flex-col items-center gap-2 z-10 relative flex-1">
              {/* Circle */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  isDone
                    ? "bg-green-500 border-green-500 text-white"
                    : isCurrent
                    ? "bg-white border-green-500 text-green-600 shadow-lg shadow-green-500/20 animate-pulse"
                    : "bg-white border-slate-200 text-slate-300"
                }`}
              >
                {isDone ? <CheckCircle size={18} strokeWidth={2.5} /> : stage.icon}
              </div>
              {/* Label */}
              <span
                className={`text-[10px] font-black uppercase tracking-widest text-center leading-tight ${
                  isDone || isCurrent ? "text-slate-800" : "text-slate-300"
                }`}
              >
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Meta info */}
      <div className="flex gap-4 mt-2 flex-wrap">
        {method && (
          <div className="bg-slate-50 rounded-xl px-4 py-2 text-xs">
            <span className="text-slate-400 font-bold block uppercase tracking-widest">Method</span>
            <span className="text-slate-900 font-black capitalize">{method.replace(/_/g, " ")}</span>
          </div>
        )}
        {estimatedDate && (
          <div className="bg-slate-50 rounded-xl px-4 py-2 text-xs">
            <span className="text-slate-400 font-bold block uppercase tracking-widest">ETA</span>
            <span className="text-slate-900 font-black">{new Date(estimatedDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
          </div>
        )}
      </div>

      {/* Timeline log */}
      {timeline.length > 0 && (
        <div className="mt-6 border-t border-slate-100 pt-5">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Activity Log</p>
          <div className="space-y-4">
            {[...timeline].reverse().map((t, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 shrink-0 mt-1.5" />
                <div>
                  <p className="text-sm font-bold text-slate-800">{t.stage}</p>
                  {t.note && <p className="text-xs text-slate-500 font-medium">{t.note}</p>}
                  <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                    {new Date(t.timestamp).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
