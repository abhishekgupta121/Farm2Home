"use client";

import { useState } from "react";
import { Truck, CheckCircle, Package, ShieldCheck, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

export default function DeliveryPortal() {
  const [orderId, setOrderId] = useState("");
  const [otp, setOtp] = useState("");
  const [type, setType] = useState<"pickup" | "delivery">("pickup");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId || !otp) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/delivery/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, otp, type }),
      });
      const data = await res.json();
      
      if (res.ok) {
        toast.success(data.message);
        setOrderId("");
        setOtp("");
      } else {
        toast.error(data.error || "Verification failed");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-slate-900 text-white p-4 sm:p-6 shadow-md">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500 p-2 rounded-xl">
              <Truck size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-black tracking-tight">Delivery Portal</h1>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-slate-400 text-sm font-bold bg-slate-800 px-4 py-2 rounded-xl">
            <ShieldCheck size={16} />
            Secure Tracking
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-xl border border-slate-200 p-8 sm:p-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Verify Status</h2>
            <p className="text-slate-500 font-bold">Update order status using secure OTPs.</p>
          </div>

          {/* Type Selector */}
          <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8">
            <button
              onClick={() => setType("pickup")}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                type === "pickup" 
                  ? "bg-white text-orange-600 shadow-sm" 
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <Package size={16} />
              Pickup
            </button>
            <button
              onClick={() => setType("delivery")}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                type === "delivery" 
                  ? "bg-white text-green-600 shadow-sm" 
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <CheckCircle size={16} />
              Delivery
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-2">Order ID</label>
              <input
                type="text"
                placeholder="Enter 8-char Short ID or Full 24-char ID"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl px-6 py-4 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-bold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-2">
                {type === "pickup" ? "Farmer OTP" : "Consumer OTP"}
              </label>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl px-6 py-4 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-bold tracking-[0.3em] text-center text-xl"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg active:scale-95 flex justify-center items-center gap-2 ${
                type === "pickup" 
                  ? "bg-orange-500 hover:bg-orange-600 shadow-orange-500/30" 
                  : "bg-green-600 hover:bg-green-700 shadow-green-600/30"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Verify {type === "pickup" ? "Pickup" : "Delivery"}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center bg-blue-50 p-4 rounded-2xl border border-blue-100">
            <p className="text-[10px] font-bold text-blue-800 uppercase tracking-widest leading-relaxed">
              {type === "pickup" 
                ? "Ask the farmer for the Pickup OTP. This will mark the order as SHIPPED."
                : "Ask the consumer for the Delivery OTP. This will mark the order as DELIVERED."}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
