"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, ShieldCheck, CheckCircle, XCircle, Clock, Search, Filter, ShoppingBag, Leaf, Tractor, Tag, X, Truck, Package } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import { translations } from "@/lib/translations";
import { useLanguage } from "@/lib/LanguageContext";

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [pendingCrops, setPendingCrops] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"crops" | "orders">("crops");
  const { t, language: lang, setLanguage } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const userData = sessionStorage.getItem("user");
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
      fetchDeliveries(),
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
          sessionStorage.setItem("user", JSON.stringify(updated));
          return updated;
        });
      }
    } catch (err) {
      console.error("Wallet refresh failed", err);
    }
  };

  const fetchDeliveries = async () => {
    try {
      const res = await fetch(`/api/delivery?admin=true`);
      const data = await res.json();
      if (res.ok) setDeliveries(data.deliveries);
    } catch (err) {
      console.error("Failed to fetch deliveries", err);
    }
  };

  const handleUpdateDeliveryStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/delivery/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, note: `Admin updated status to ${status}.` }),
      });
      if (res.ok) fetchDeliveries();
    } catch (err) {
      alert("Failed to update delivery status");
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

  const handleRefund = async (orderId: string) => {
    if (!confirm("Are you sure you want to refund this order to the consumer? This will return funds and cancel the order.")) return;
    try {
      const res = await fetch(`/api/orders/${orderId}/refund`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Order refunded and cancelled!");
        setOrders(prev => prev.map(o => o._id === orderId ? { ...o, paymentStatus: "refunded", orderStatus: "cancelled" } : o));
        if (user) refreshWallet(user._id);
      } else {
        toast.error(data.error || "Failed to refund order");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    router.push("/");
  };

  const formatAddress = (addr: any) => {
    if (!addr) return "N/A";
    if (typeof addr === 'string') return addr;
    const parts = [addr.addressLine1, addr.city, addr.state].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "N/A";
  };

  const filteredCrops = pendingCrops.filter(crop => 
    crop.farmerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredOrders = orders.filter(order => 
    order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.consumerId?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDeliveries = deliveries.filter(d => 
    d._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.cropId?.cropName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.farmerId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.consumerId?.name?.toLowerCase().includes(searchQuery.toLowerCase())
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
              <span className="text-lg font-black tracking-tight block">{t('ad_adminConsole')}</span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('ad_escrowSub')}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl text-white border border-blue-400/30">
              <div className="p-2 bg-white/20 rounded-xl">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-70 leading-none mb-1">{t('ad_escrowWallet')}</p>
                <p className="text-sm font-black leading-none">₹{user.walletBalance || 0}</p>
              </div>
            </div>

            {/* Language Toggle */}
            <div className="flex gap-1 bg-slate-800 border border-slate-700 rounded-lg p-1 text-xs font-bold shadow-sm">
              <button 
                onClick={() => setLanguage('en')} 
                className={`px-3 py-1.5 rounded-md transition-all ${lang === 'en' ? 'bg-blue-500 text-white' : 'text-slate-400 hover:bg-slate-700'}`}
              >
                English
              </button>
              <button 
                onClick={() => setLanguage('hi')} 
                className={`px-3 py-1.5 rounded-md transition-all ${lang === 'hi' ? 'bg-blue-500 text-white' : 'text-slate-400 hover:bg-slate-700'}`}
              >
                हिंदी
              </button>
              <button 
                onClick={() => setLanguage('bn')} 
                className={`px-3 py-1.5 rounded-md transition-all ${lang === 'bn' ? 'bg-blue-500 text-white' : 'text-slate-400 hover:bg-slate-700'}`}
              >
                বাংলা
              </button>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-red-500 hover:text-white font-bold rounded-xl transition-all active:scale-95 text-sm"
            >
              <LogOut size={16} />
              {t('ad_logout')}
            </button>
          </div>
        </div>
      </nav>

      {/* Tab Switcher */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-[1400px] mx-auto flex overflow-x-auto no-scrollbar">
          <button 
            onClick={() => setActiveTab("crops")}
            className={`px-8 py-4 font-black text-sm uppercase tracking-widest transition-all border-b-4 flex-shrink-0 ${activeTab === "crops" ? "border-blue-500 text-blue-600" : "border-transparent text-slate-400 hover:text-slate-600"}`}
          >
            {t('ad_pendingCrops')} ({pendingCrops.length})
          </button>
          <button 
            onClick={() => setActiveTab("orders")}
            className={`px-8 py-4 font-black text-sm uppercase tracking-widest transition-all border-b-4 flex-shrink-0 ${activeTab === "orders" ? "border-blue-500 text-blue-600" : "border-transparent text-slate-400 hover:text-slate-600"}`}
          >
            {t('ad_orderManagement')} ({orders.length})
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-8 max-w-[1400px] mx-auto space-y-8">
        {/* Summary Stats & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('ad_pendingDelivery')}</p>
              <h3 className="text-2xl font-black text-slate-900">{orders.filter(o => o.orderStatus === 'placed').length} {t('ad_ordersCount')}</h3>
            </div>
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('ad_completedPaid')}</p>
              <h3 className="text-2xl font-black text-green-600">{orders.filter(o => o.paymentStatus === 'transferred_to_farmer').length} {t('ad_ordersCount')}</h3>
            </div>
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('ad_refundedCancelled')}</p>
              <h3 className="text-2xl font-black text-red-500">{orders.filter(o => o.orderStatus === 'cancelled').length} {t('ad_ordersCount')}</h3>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
          <div className="relative w-full">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder={
                activeTab === "crops" ? t('ad_searchCropsPlaceholder') : 
                activeTab === "orders" ? t('ad_searchOrdersPlaceholder') :
                t('searchDeliveries')
              } 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        {activeTab === "crops" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCrops.length === 0 ? (
              <div className="col-span-full text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
                <ShieldCheck size={64} className="mx-auto text-slate-300 mb-6" />
                <h3 className="text-2xl font-black text-slate-900 mb-2">{t('allCaughtUp')}</h3>
                <p className="text-slate-500 font-medium">{t('noPendingListings')}</p>
              </div>
            ) : (
              filteredCrops.map((crop) => (
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
                      <p className="text-sm font-bold text-slate-500">{t('ad_farmerPrefix')}{crop.farmerName}</p>
                      <span className="inline-block mt-2 px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-[10px] font-black uppercase tracking-widest border border-blue-100">
                        {crop.listingType}
                      </span>
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 mb-6 space-y-2 text-sm font-medium">
                    <div className="flex justify-between">
                      <span className="text-slate-500">{t('ad_price')}</span>
                      <span className="text-slate-900 font-black">₹{crop.pricePerKg}/kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">{t('ad_stock')}</span>
                      <span className="text-slate-900 font-black">{crop.availableQuantityKg} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-bold">Pincode</span>
                      <span className="text-slate-900 font-black">{crop.pinCode}</span>
                    </div>
                  </div>
                  <div className="mt-auto flex gap-3">
                    <button onClick={() => handleStatusUpdate(crop._id, "active")} className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 text-sm flex justify-center items-center gap-2">
                      <CheckCircle size={18} /> {t('ad_approve')}
                    </button>
                    <button onClick={() => handleStatusUpdate(crop._id, "rejected")} className="flex-1 py-3 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 text-sm flex justify-center items-center gap-2">
                      <XCircle size={18} /> {t('ad_reject')}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : activeTab === "orders" ? (
          <div className="space-y-6">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
                <Package size={64} className="mx-auto text-slate-300 mb-6" />
                <h3 className="text-2xl font-black text-slate-900 mb-2">{t('noOrdersFound')}</h3>
                <p className="text-slate-500 font-medium">{t('noOrderRecordsFound')}</p>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div key={order._id} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200 hover:border-blue-400 transition-all overflow-hidden relative group">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-200 group-hover:bg-blue-500 transition-colors"></div>
                  
                  <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
                    <div className="flex-1 space-y-6">
                      <div className="flex flex-wrap items-center gap-4">
                        <span className="px-4 py-1 bg-slate-900 text-white rounded-full text-[10px] font-black tracking-widest">
                          ID: {order._id}
                        </span>
                        <span className={`px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border ${
                          order.orderStatus === 'placed' ? 'bg-orange-50 text-orange-600 border-orange-200' : 
                          order.orderStatus === 'shipped' ? 'bg-blue-50 text-blue-600 border-blue-200' : 
                          order.orderStatus === 'delivered' ? 'bg-green-50 text-green-600 border-green-200' :
                          'bg-slate-100 text-slate-500 border-slate-200'
                        }`}>
                          {t('ad_statusPrefix')}{order.orderStatus}
                        </span>
                        <span className={`px-4 py-1 rounded-full text-[10px] font-black tracking-widest border ${
                          order.paymentStatus === 'paid' ? 'bg-amber-50 text-amber-600 border-amber-200' : 
                          order.paymentStatus === 'refunded' ? 'bg-red-50 text-red-600 border-red-200' :
                          'bg-green-50 text-green-600 border-green-200'
                        }`}>
                          {order.paymentStatus === 'paid' ? t('ad_holdingEscrow') : 
                           order.paymentStatus === 'refunded' ? t('refundedToConsumer') : 
                           t('ad_transferredToFarmer')}
                        </span>
                        <div className="flex items-center gap-2 text-slate-400 text-xs font-bold">
                          <Clock size={14} />
                          {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{t('ad_consumerDetails')}</p>
                          <h4 className="text-lg font-black text-slate-900 mb-1">{order.consumerId?.name}</h4>
                          <p className="text-sm font-bold text-slate-600 mb-2">{order.consumerId?.mobileNumber}</p>
                          <p className="text-xs font-medium text-slate-500 leading-relaxed">
                            {formatAddress(order.consumerId?.address)} <br/>
                            <span className="font-black text-slate-400">PIN: {order.consumerId?.pinCode}</span>
                          </p>
                        </div>

                        <div className="bg-blue-50/50 rounded-2xl p-5 border border-blue-100/50">
                          <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-3">{t('ad_orderSummary')}</p>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-bold text-slate-600">{t('ad_totalItems')}</span>
                              <span className="text-sm font-black text-slate-900">{order.items.length} {t('ad_varieties')}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-bold text-slate-600">{t('ad_totalWeight')}</span>
                              <span className="text-sm font-black text-slate-900">{order.items.reduce((acc: number, item: any) => acc + item.quantity, 0)} kg</span>
                            </div>
                            <div className="pt-2 border-t border-blue-100 flex justify-between items-center mt-2">
                              <span className="text-sm font-black text-blue-700">{t('ad_totalPayout')}</span>
                              <span className="text-2xl font-black text-blue-900">₹{order.totalAmount}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{t('ad_itemizedBreakdown')}</p>
                        <div className="space-y-3">
                          {order.items.map((item: any, idx: number) => (
                            <div key={idx} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-white border border-slate-100 rounded-2xl gap-4">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-black text-xs">
                                  {item.quantity}kg
                                </div>
                                <div>
                                  <p className="font-black text-slate-900 text-sm">{item.cropName}</p>
                                  <p className="text-[10px] font-bold text-slate-500">₹{item.pricePerKg}/kg • Total: ₹{item.total}</p>
                                </div>
                              </div>
                              <div className="text-left sm:text-right border-l sm:border-l-0 sm:border-r border-slate-100 pl-4 sm:pl-0 sm:pr-4">
                                <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{t('farmerRole')}</p>
                                <p className="text-xs font-black text-slate-900">{item.farmerId?.name || "N/A"}</p>
                                <p className="text-[10px] font-bold text-slate-700">Contact: {item.farmerId?.mobileNumber || "N/A"}</p>
                                <p className="text-[10px] font-medium text-slate-500">{formatAddress(item.farmerId?.address)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="w-full lg:w-64 shrink-0 space-y-4">
                      {order.paymentStatus === "paid" ? (
                        <div className="bg-amber-50 rounded-3xl p-6 border border-amber-100 text-center">
                          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ShoppingBag size={24} />
                          </div>
                          <h5 className="font-black text-slate-900 mb-2">{t('pendingRelease')}</h5>
                          <p className="text-xs font-medium text-slate-500 mb-6">{t('fundsHeldEscrow')}</p>
                          <button 
                            onClick={() => handleReleasePayment(order._id)}
                            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-600/30 active:scale-95"
                          >
                            {t('release')} ₹{order.totalAmount}
                          </button>
                          <button 
                            onClick={() => handleRefund(order._id)}
                            className="w-full mt-3 py-3 bg-red-50 text-red-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-100 transition-all active:scale-95"
                          >
                            {t('refundAndCancel')}
                          </button>
                        </div>
                      ) : order.paymentStatus === "refunded" ? (
                        <div className="bg-red-50 rounded-3xl p-6 border border-red-100 text-center">
                          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <X size={24} />
                          </div>
                          <h5 className="font-black text-red-800 mb-1">{t('orderRefunded')}</h5>
                          <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest">{t('amountReturned')}</p>
                        </div>
                      ) : (
                        <div className="bg-green-50 rounded-3xl p-6 border border-green-100 text-center">
                          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle size={24} />
                          </div>
                          <h5 className="font-black text-green-800 mb-1">{t('ad_transferredToFarmer')}</h5>
                          <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest">{t('transactionComplete')}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : null}
      </div>

    </div>
  );
}
