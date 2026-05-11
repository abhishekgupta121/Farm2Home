"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Truck, CheckCircle, Package, ShieldCheck, ArrowRight, LogOut, ArrowLeft, Loader2, Clock, Search } from "lucide-react";
import toast from "react-hot-toast";

function DeliveryPortalContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlOrderId = searchParams.get("orderId") || "";

  const [user, setUser] = useState<any>(null);
  const [orderId, setOrderId] = useState(urlOrderId);
  const [otp, setOtp] = useState("");
  const [type, setType] = useState<"pickup" | "delivery">("pickup");
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders?admin=true");
      const data = await res.json();
      if (res.ok) setOrders(data.orders);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    }
  };

  // Public access - no login required
  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (e) {
        setUser({ role: "delivery", name: "Delivery Partner" });
      }
    } else {
      setUser({ role: "delivery", name: "Delivery Partner" });
    }
    fetchOrders();
  }, []);

  useEffect(() => {
    if (urlOrderId) {
      setOrderId(urlOrderId);
    }
  }, [urlOrderId]);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
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
        fetchOrders();
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
      <main className="flex-1 flex flex-col lg:flex-row gap-8 p-4 sm:p-8 max-w-[1400px] mx-auto w-full">
        {/* Left Column: Orders List */}
        <div className="flex-1 space-y-6">
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Active Deliveries</h2>
              <div className="relative w-64">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search Order ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-4">
              {orders
                .filter(order => {
                  const matchesStatus = type === "pickup" ? order.orderStatus === "placed" : order.orderStatus === "shipped";
                  const matchesSearch = order._id.toLowerCase().includes(searchQuery.toLowerCase());
                  return matchesStatus && matchesSearch;
                })
                .map(order => (
                  <div key={order._id} className="bg-slate-50 rounded-2xl p-5 border border-slate-100 hover:border-blue-300 transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="text-xs font-black text-blue-600 uppercase tracking-widest">ID: #{order._id.slice(-8).toUpperCase()}</span>
                        <h3 className="text-lg font-black text-slate-900 mt-1">{order.items[0]?.cropName || "Produce"}</h3>
                        <p className="text-sm font-bold text-slate-500">Qty: {order.items.reduce((acc: number, item: any) => acc + item.quantity, 0)} kg</p>
                      </div>
                      <button
                        onClick={() => setOrderId(order._id)}
                        className="px-4 py-2 bg-white text-slate-700 font-bold rounded-xl border border-slate-200 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all text-sm"
                      >
                        Select
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium text-slate-600 border-t border-slate-200 pt-3">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase">From (Farmer)</p>
                        <p className="font-bold text-slate-800">{order.items[0]?.farmerId?.name || "N/A"}</p>
                        <p>{order.items[0]?.farmerId?.mobileNumber || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase">To (Consumer)</p>
                        <p className="font-bold text-slate-800">{order.consumerId?.name || "N/A"}</p>
                        <p>{order.consumerId?.mobileNumber || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                ))}
              {orders.filter(order => {
                  const matchesStatus = type === "pickup" ? order.orderStatus === "placed" : order.orderStatus === "shipped";
                  const matchesSearch = order._id.toLowerCase().includes(searchQuery.toLowerCase());
                  return matchesStatus && matchesSearch;
                }).length === 0 && (
                <div className="text-center py-10 text-slate-400 font-bold">
                  No {type === "pickup" ? "pickups" : "deliveries"} found.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Verification Form */}
        <div className="w-full lg:w-96 shrink-0">
          <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-8 relative overflow-hidden sticky top-24">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -ml-20 -mb-20"></div>

            <div className="relative z-10">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-black text-slate-900 mb-1 tracking-tight">Verify Status</h2>
                <p className="text-sm text-slate-500 font-bold">Update order status using secure OTPs.</p>
              </div>

              {/* Type Selector */}
              <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
                <button
                  onClick={() => setType("pickup")}
                  className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                    type === "pickup" 
                      ? "bg-white text-orange-600 shadow-sm" 
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <Package size={14} />
                  Pickup
                </button>
                <button
                  onClick={() => setType("delivery")}
                  className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                    type === "delivery" 
                      ? "bg-white text-green-600 shadow-sm" 
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <CheckCircle size={14} />
                  Delivery
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Order ID</label>
                  <input
                    type="text"
                    placeholder="Enter 24-char ID"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-all font-bold text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                    {type === "pickup" ? "Farmer OTP" : "Consumer OTP"}
                  </label>
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-all font-bold tracking-[0.2em] text-center text-xl focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3.5 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95 flex justify-center items-center gap-2 ${
                    type === "pickup" 
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-orange-500/30" 
                      : "bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 shadow-green-600/30"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <>
                      Verify {type === "pickup" ? "Pickup" : "Delivery"}
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>

              <div className={`mt-6 text-center p-4 rounded-xl border transition-all ${
                type === "pickup" 
                  ? "bg-orange-50 border-orange-100 text-orange-800" 
                  : "bg-green-50 border-green-100 text-green-800"
              }`}>
                <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                  {type === "pickup" 
                    ? "Ask the farmer for the Pickup OTP. This will mark the order as SHIPPED."
                    : "Ask the consumer for the Delivery OTP. This will mark the order as DELIVERED."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function DeliveryPortal() {
  return (
    <Suspense fallback={
      <div className="p-8 text-center flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full"></div>
      </div>
    }>
      <DeliveryPortalContent />
    </Suspense>
  );
}
