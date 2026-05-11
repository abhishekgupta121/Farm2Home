"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Truck, CheckCircle, Package, ShieldCheck, ArrowRight, LogOut, ArrowLeft, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function DeliveryPortal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlOrderId = searchParams.get("orderId") || "";

  const [user, setUser] = useState<any>(null);
  const [orderId, setOrderId] = useState(urlOrderId);
  const [otp, setOtp] = useState("");
  const [type, setType] = useState<"pickup" | "delivery">("pickup");
  const [loading, setLoading] = useState(false);

  // Auth Protection - Logged in users only
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
    } else {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    }
  }, [router]);

  useEffect(() => {
    if (urlOrderId) {
      setOrderId(urlOrderId);
    }
  }, [urlOrderId]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

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
        if (!urlOrderId) setOrderId("");
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

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-blue-100 selection:text-blue-900 pb-20">
      {/* Premium Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 px-4 sm:px-8 py-4">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard" className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all flex items-center justify-center" title="Back to Dashboard">
                <ArrowLeft size={18} />
              </Link>
              <div className="bg-blue-100 p-3 rounded-2xl text-blue-600 shadow-sm hidden sm:block">
                <Truck size={28} />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Delivery Portal</h1>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs font-bold uppercase tracking-widest">
                    <ShieldCheck size={12} className="text-blue-500" />
                    Secure Handover
                  </div>

                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto justify-end">


            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 sm:px-6 py-3 bg-red-50 text-red-600 hover:bg-red-100 font-bold rounded-2xl transition-all active:scale-95"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-xl border border-slate-100 p-8 sm:p-12 relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -ml-20 -mb-20"></div>

          <div className="relative z-10">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Verify Status</h2>
              <p className="text-slate-500 font-bold">Update order status using secure OTPs.</p>
            </div>

            {/* Type Selector */}
            <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8">
              <button
                onClick={() => setType("pickup")}
                className={`flex-1 py-3.5 px-4 rounded-xl text-sm font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
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
                className={`flex-1 py-3.5 px-4 rounded-xl text-sm font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
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
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl px-6 py-4 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-bold disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={!!urlOrderId}
                  readOnly={!!urlOrderId}
                />
                {urlOrderId && (
                  <p className="text-[10px] font-bold text-orange-500 ml-2 uppercase tracking-widest">Pre-filled from dashboard</p>
                )}
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
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl px-6 py-4 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-bold tracking-[0.3em] text-center text-2xl focus:bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4.5 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg active:scale-95 flex justify-center items-center gap-2 ${
                  type === "pickup" 
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-orange-500/30" 
                    : "bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 shadow-green-600/30"
                } disabled:opacity-50 disabled:cursor-not-allowed py-4`}
              >
                {loading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <>
                    Verify {type === "pickup" ? "Pickup" : "Delivery"}
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className={`mt-8 text-center p-5 rounded-2xl border transition-all ${
              type === "pickup" 
                ? "bg-orange-50 border-orange-100 text-orange-800" 
                : "bg-green-50 border-green-100 text-green-800"
            }`}>
              <p className="text-xs font-bold uppercase tracking-widest leading-relaxed">
                {type === "pickup" 
                  ? "Ask the farmer for the Pickup OTP. This will mark the order as SHIPPED."
                  : "Ask the consumer for the Delivery OTP. This will mark the order as DELIVERED."}
              </p>
            </div>

            {/* Visual cue from image */}
            <div className="mt-6 flex justify-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl text-slate-600 text-xs font-bold uppercase tracking-widest">
                <Truck size={14} className="text-blue-500" />
                Delivery Handover
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
