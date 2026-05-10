"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, ShieldCheck, CheckCircle, XCircle, Clock, Search, Filter, ShoppingBag, Leaf, Tractor, Tag } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [pendingCrops, setPendingCrops] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"crops" | "orders">("crops");
  const [searchQuery, setSearchQuery] = useState("");

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
        fetchData(parsedUser._id);
      }
    }
  }, [router]);

  const fetchData = async (userId: string) => {
    setLoading(true);
    await Promise.all([
      fetchPendingCrops(),
      fetchOrders(),
      refreshWallet(userId)
    ]);
    setLoading(false);
  };

  const refreshWallet = async (userId: string) => {
    try {
      const res = await fetch(`/api/user/wallet?userId=${userId}`);
      const data = await res.json();
      if (res.ok) {
        setUser((prev: any) => {
          const updated = { ...prev, walletBalance: data.walletBalance };
          localStorage.setItem("user", JSON.stringify(updated));
          return updated;
        });
      }
    } catch (err) {
      console.error("Wallet refresh failed", err);
    }
  };

  const fetchPendingCrops = async () => {
    try {
      const res = await fetch(`/api/crops?status=pending`);
      const data = await res.json();
      if (res.ok) {
        setPendingCrops(data.crops);
      }
    } catch (err) {
      console.error("Failed to fetch pending crops:", err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch(`/api/orders?admin=true`);
      const data = await res.json();
      if (res.ok) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  };

  const handleStatusUpdate = async (id: string, status: "active" | "rejected") => {
    try {
      const res = await fetch(`/api/crops/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setPendingCrops(prev => prev.filter(crop => crop._id !== id));
        toast.success(`Crop ${status === 'active' ? 'approved' : 'rejected'} successfully!`);
      }
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleReleasePayment = async (orderId: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/release-payment`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Payment released to farmers!");
        setOrders(prev => prev.map(o => o._id === orderId ? { ...o, paymentStatus: "transferred_to_farmer", orderStatus: "delivered" } : o));
        if (user) refreshWallet(user._id);
      } else {
        toast.error(data.error || "Failed to release payment");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  const filteredCrops = pendingCrops.filter(crop => 
    crop.cropName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    crop.farmerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredOrders = orders.filter(order => 
    order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.consumerId?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!user || loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-blue-100 selection:text-blue-900 pb-20">
      {/* Admin Navbar */}
      <nav className="bg-slate-900 text-white px-4 sm:px-8 py-4 sticky top-0 z-50 shadow-lg shadow-slate-900/10">
        <div className="max-w-[1400px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500/20 p-2 rounded-xl">
              <ShieldCheck size={24} className="text-blue-400" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight block">Admin Console</span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Farm2Home Escrow</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            {/* Admin Wallet */}
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

      <div className="p-4 sm:p-8 max-w-[1400px] mx-auto space-y-8">
        {/* Navigation Tabs */}
        <div className="flex p-1.5 bg-slate-200 w-fit rounded-[1.5rem] shadow-inner">
          <button 
            onClick={() => setActiveTab("crops")}
            className={`px-8 py-3 rounded-[1.2rem] font-black text-sm tracking-widest transition-all ${activeTab === 'crops' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
          >
            PENDING CROPS ({pendingCrops.length})
          </button>
          <button 
            onClick={() => setActiveTab("orders")}
            className={`px-8 py-3 rounded-[1.2rem] font-black text-sm tracking-widest transition-all ${activeTab === 'orders' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
          >
            ORDER MANAGEMENT ({orders.length})
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
          <div className="relative w-full">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder={activeTab === "crops" ? "Search crops or farmers..." : "Search Order ID or Consumer..."} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        {activeTab === "crops" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCrops.map((crop) => (
              <div key={crop._id} className="group bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-20 h-20 bg-slate-100 rounded-2xl overflow-hidden shrink-0 relative border border-slate-100">
                    {crop.imageUrl ? (
                      <img src={crop.imageUrl} alt={crop.cropName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <Leaf size={24} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-black text-slate-900 truncate">{crop.cropName}</h3>
                    <p className="text-sm font-bold text-slate-500">Farmer: {crop.farmerName}</p>
                    <span className="inline-block mt-2 px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-[10px] font-black uppercase tracking-widest border border-blue-100">
                      {crop.listingType}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 mb-6 space-y-2 text-sm font-medium">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Price</span>
                    <span className="text-slate-900 font-black">₹{crop.pricePerKg}/kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Stock</span>
                    <span className="text-slate-900 font-black">{crop.availableQuantityKg} kg</span>
                  </div>
                </div>

                <div className="mt-auto flex gap-3">
                  <button onClick={() => handleStatusUpdate(crop._id, "active")} className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 text-sm">
                    Approve
                  </button>
                  <button onClick={() => handleStatusUpdate(crop._id, "rejected")} className="flex-1 py-3 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 text-sm">
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order._id} className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200 hover:border-blue-300 transition-all">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">#{order._id.slice(-8).toUpperCase()}</span>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        order.paymentStatus === 'paid' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {order.paymentStatus === 'paid' ? 'FUNDS IN ESCROW' : 'RELEASED TO FARMER'}
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-slate-900">Consumer: {order.consumerId?.name || "Unknown"}</h3>
                    <div className="mt-3 flex flex-wrap gap-4 text-sm font-medium text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <ShoppingBag size={14} className="text-blue-500" />
                        <span>{order.items.length} Items</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock size={14} className="text-slate-400" />
                        <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3 w-full lg:w-auto">
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Transaction</p>
                      <p className="text-3xl font-black text-slate-900 leading-none">₹{order.totalAmount}</p>
                    </div>
                    
                    {order.paymentStatus === "paid" ? (
                      <button 
                        onClick={() => handleReleasePayment(order._id)}
                        className="w-full lg:w-auto px-8 py-3 bg-slate-900 text-white rounded-xl font-black text-sm uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl active:scale-95"
                      >
                        Release Payment
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 text-green-600 font-black text-sm">
                        <CheckCircle size={18} />
                        PAYMENT FINALIZED
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Item Details */}
                <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {order.items.map((item: any, idx: number) => (
                    <div key={idx} className="bg-slate-50 rounded-xl p-3 flex justify-between items-center text-xs">
                      <div>
                        <p className="font-black text-slate-900">{item.cropName}</p>
                        <p className="text-slate-500 font-bold">{item.quantity}kg @ ₹{item.pricePerKg}</p>
                      </div>
                      <span className="font-black text-blue-600">₹{item.total}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {filteredOrders.length === 0 && (
              <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-slate-300">
                <ShoppingBag size={48} className="mx-auto text-slate-200 mb-4" />
                <p className="text-slate-500 font-bold uppercase tracking-widest">No matching orders found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
