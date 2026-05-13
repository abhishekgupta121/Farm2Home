"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Truck, CheckCircle, Package, ShieldCheck, ArrowRight, LogOut, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

function AdminDeliveryPortalContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlOrderId = searchParams.get("orderId") || "";

  const [user, setUser] = useState<any>(null);
  const [orderId, setOrderId] = useState(urlOrderId);
  const [otp, setOtp] = useState("");
  const [type, setType] = useState<"pickup" | "delivery">("pickup");
  const [loading, setLoading] = useState(false);

  // Auth Protection - Only Admin can access
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
    } else {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== "admin") {
        router.push("/");
      } else {
        setUser(parsedUser);
      }
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
        <div className="animate-spin w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-blue-100 selection:text-blue-900">
      {/* Admin Navbar (Same as Admin Dashboard) */}
      <nav className="bg-slate-900 text-white px-4 sm:px-8 py-4 sticky top-0 z-50 shadow-lg shadow-slate-900/10">
        <div className="max-w-[1400px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="p-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all flex items-center justify-center" title="Back to Dashboard">
              <ArrowLeft size={18} />
            </Link>
            <div className="flex items-center gap-3">
              <div className="bg-blue-500/20 p-2 rounded-xl">
                <ShieldCheck size={24} className="text-blue-400" />
              </div>
              <div>
                <span className="text-lg font-black tracking-tight block">Admin Console</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Farm2Home Escrow</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl text-white border border-blue-400/30">
              <div className="p-2 bg-white/20 rounded-xl">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-70 leading-none mb-1">Escrow Wallet</p>
                <p className="text-sm font-black leading-none">₹{user.walletBalance || 0}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-red-500 hover:text-white font-bold rounded-xl transition-all active:scale-95 text-sm"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </nav>

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
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${type === "pickup"
                  ? "bg-white text-orange-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
                }`}
            >
              <Package size={16} />
              Pickup
            </button>
            <button
              onClick={() => setType("delivery")}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${type === "delivery"
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
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl px-6 py-4 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-bold disabled:opacity-70 disabled:cursor-not-allowed"
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
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl px-6 py-4 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-bold tracking-[0.3em] text-center text-xl"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg active:scale-95 flex justify-center items-center gap-2 ${type === "pickup"
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

export default function AdminDeliveryPortal() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full"></div>
      </div>
    }>
      <AdminDeliveryPortalContent />
    </Suspense>
  );
}





