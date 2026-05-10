"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Tractor, Package, Bell, ShoppingBag, ArrowRight, Trash2, Plus, Leaf, TrendingUp, DollarSign, Star, Edit, Pause, Play, RefreshCw, AlertTriangle, CheckCircle, XCircle, Truck, MapPin, Clock } from "lucide-react";
import Link from "next/link";
import FarmerNavbar from "@/app/components/FarmerNavbar";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Real data fetched from database
export default function FarmerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
    } else {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      fetchData(parsedUser._id);
    }
  }, [router]);

  const fetchData = async (farmerId: string) => {
    setLoading(true);
    await Promise.all([
      fetchListings(farmerId),
      fetchOrders(farmerId),
      fetchReviews(farmerId),
      fetchDeliveries(farmerId),
      refreshWallet(farmerId)
    ]);
    setLoading(false);
  };

  const fetchOrders = async (farmerId: string) => {
    try {
      const res = await fetch(`/api/orders?farmerId=${farmerId}`);
      const data = await res.json();
      if (res.ok) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
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

  const fetchReviews = async (farmerId: string) => {
    try {
      const res = await fetch(`/api/reviews?farmerId=${farmerId}`);
      const data = await res.json();
      if (res.ok) {
        setReviews(data.reviews);
      }
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    }
  };

  const fetchDeliveries = async (farmerId: string) => {
    try {
      const res = await fetch(`/api/delivery?farmerId=${farmerId}`);
      const data = await res.json();
      if (res.ok) setDeliveries(data.deliveries);
    } catch (err) {
      console.error("Failed to fetch deliveries:", err);
    }
  };

  const handleUpdateDeliveryStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/delivery/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, note: `Status updated to ${status} by farmer.` }),
      });
      if (res.ok) fetchDeliveries(user._id);
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const fetchListings = async (farmerId: string) => {
    try {
      const res = await fetch(`/api/crops?farmerId=${farmerId}`);
      const data = await res.json();
      if (res.ok) {
        setListings(data.crops);
      }
    } catch (err) {
      console.error("Failed to fetch listings:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;
    
    try {
      const res = await fetch(`/api/crops/${id}`, { method: "DELETE" });
      if (res.ok) {
        setListings(prev => prev.filter(l => l._id !== id));
      }
    } catch (err) {
      alert("Failed to delete listing");
    }
  };

  const handleStatusUpdate = async (id: string, currentStatus: string) => {
    if (currentStatus === "pending") {
      alert("This listing is pending approval and cannot be activated yet.");
      return;
    }
    const newStatus = currentStatus === "active" ? "paused" : "active";
    try {
      const res = await fetch(`/api/crops/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setListings(prev => prev.map(l => l._id === id ? { ...l, status: newStatus } : l));
      }
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleRestock = async (id: string) => {
    const quantity = prompt("Enter additional quantity in kg:");
    if (!quantity || isNaN(Number(quantity))) return;

    try {
      const crop = listings.find(l => l._id === id);
      const newQuantity = (crop.availableQuantityKg || 0) + Number(quantity);
      
      const res = await fetch(`/api/crops/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ availableQuantityKg: newQuantity }),
      });
      if (res.ok) {
        setListings(prev => prev.map(l => l._id === id ? { ...l, availableQuantityKg: newQuantity } : l));
      }
    } catch (err) {
      alert("Failed to restock");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");
    router.push("/");
  };

  if (!user || loading) return <div className="p-8 text-center flex items-center justify-center min-h-screen"><div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full"></div></div>;

  // Generate suggestions based on sales
  const generatedAlerts: any[] = [];

  listings.forEach(l => {
    const sold = orders.filter((o: any) => o.items?.some((item: any) => item.productId?._id === l._id)).reduce((acc: number, o: any) => {
        const item = o.items.find((i: any) => i.productId?._id === l._id);
        return acc + (item?.quantity || 0);
    }, 0);
    if (sold > 30) {
      generatedAlerts.push({
        id: `suggest_${l._id}`,
        message: `Suggestion: ${l.cropName} is selling fast (${sold}kg sold). Consider listing more!`,
        icon: "trending",
        bgColor: "bg-green-50 border-green-100",
      });
    }
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <FarmerNavbar />
      
      {/* Live Market Ticker */}
      <div className="bg-slate-100 py-2 border-b border-slate-200 overflow-hidden">
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
          .marquee-content {
            display: inline-flex;
            animation: marquee 20s linear infinite;
          }
        `}</style>
        <div className="marquee-content text-sm font-bold text-slate-700">
          <span className="mx-4">🍅 Tomatoes: ₹40/kg <span className="text-green-500">↑</span></span>
          <span className="mx-4">🥔 Potatoes: ₹25/kg <span className="text-red-500">↓</span></span>
          <span className="mx-4">🌾 Wheat: ₹30/kg <span className="text-green-500">↑</span></span>
          <span className="mx-4">🥣 Moong Dal: ₹110/kg <span className="text-green-500">↑</span></span>
          <span className="mx-4">🥣 Masoor Dal: ₹90/kg <span className="text-slate-500">-</span></span>
        </div>
      </div>

      <div className="p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-4 rounded-2xl text-green-600">
              <Tractor size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome, {user.name}</h1>
              <p className="text-slate-500 font-medium">{user.farmName || "Farmer Dashboard"}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 hover:bg-red-100 font-bold rounded-2xl transition-all active:scale-95"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        {/* Top Summary Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col gap-1 hover:border-green-300 transition-colors cursor-pointer">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Listings</span>
            <span className="text-3xl font-black text-slate-900">{listings.filter(l => l.status === 'active').length}</span>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col gap-1 hover:border-orange-300 transition-colors cursor-pointer">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Orders</span>
            <span className="text-3xl font-black text-slate-900">{orders.length}</span>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col gap-1 hover:border-blue-300 transition-colors cursor-pointer">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Wallet Balance</span>
            <span className="text-3xl font-black text-blue-600">₹{user.walletBalance || 0}</span>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col gap-1 hover:border-yellow-300 transition-colors cursor-pointer">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Avg Rating</span>
            <span className="text-3xl font-black text-yellow-500 flex items-center gap-1">
              {reviews.length > 0 
                ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
                : "N/A"} 
              <Star size={24} fill="currentColor" />
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Dashboard Area (Listings & Orders) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Active Deliveries Section */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Truck size={22} className="text-blue-500" />
                  Active Deliveries
                </h3>
                <span className="bg-blue-100 text-blue-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                  {deliveries.filter(d => d.status !== 'delivered').length} In Progress
                </span>
              </div>
              <div className="p-6">
                {deliveries.length === 0 ? (
                  <div className="text-center py-8">
                    <Package size={48} className="text-slate-200 mx-auto mb-3" />
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No active deliveries</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {deliveries.filter(d => d.status !== 'delivered').slice(0, 3).map((delivery) => (
                      <div key={delivery._id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/30 flex flex-col sm:flex-row justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100">
                            <Package size={24} className="text-slate-400" />
                          </div>
                          <div>
                            <p className="font-black text-slate-900">{delivery.cropId?.cropName || "Unknown Crop"}</p>
                            <p className="text-xs font-bold text-slate-500">Customer: {delivery.consumerId?.name}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                delivery.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                delivery.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                                delivery.status === 'in_transit' ? 'bg-purple-100 text-purple-700' :
                                'bg-green-100 text-green-700'
                              }`}>
                                {delivery.status.replace('_', ' ')}
                              </span>
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{delivery.method.replace('_', ' ')}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {delivery.status === 'pending' && (
                            <button onClick={() => handleUpdateDeliveryStatus(delivery._id, 'confirmed')} className="px-4 py-2 bg-green-600 text-white text-[10px] font-black uppercase rounded-xl hover:bg-green-700 transition-all">Confirm</button>
                          )}
                          {delivery.status === 'confirmed' && (
                            <button onClick={() => handleUpdateDeliveryStatus(delivery._id, 'in_transit')} className="px-4 py-2 bg-blue-600 text-white text-[10px] font-black uppercase rounded-xl hover:bg-blue-700 transition-all">Ship</button>
                          )}
                          {delivery.status === 'in_transit' && (
                            <button onClick={() => handleUpdateDeliveryStatus(delivery._id, 'delivered')} className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase rounded-xl hover:bg-slate-800 transition-all">Mark Delivered</button>
                          )}
                        </div>
                      </div>
                    ))}
                    {deliveries.length > 3 && (
                      <button className="w-full py-3 text-slate-400 font-bold text-xs uppercase tracking-[0.2em] hover:text-slate-600 transition-colors">View all deliveries</button>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-4">
              <Link href="/farmer" className="bg-green-600 hover:bg-green-700 text-white rounded-2xl p-6 flex flex-col items-center justify-center gap-2 transition-all hover:-translate-y-1 shadow-lg shadow-green-600/20 active:scale-95">
                <Plus size={28} />
                <span className="font-bold text-sm">Upload Crop</span>
              </Link>
              <Link href="/farmer/ugly-sell" className="bg-orange-500 hover:bg-orange-600 text-white rounded-2xl p-6 flex flex-col items-center justify-center gap-2 transition-all hover:-translate-y-1 shadow-lg shadow-orange-500/20 active:scale-95">
                <Package size={28} />
                <span className="font-bold text-sm">Ugly Sell</span>
              </Link>
              <Link href="/farmer/pre-list" className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl p-6 flex flex-col items-center justify-center gap-2 transition-all hover:-translate-y-1 shadow-lg shadow-blue-600/20 active:scale-95">
                <Package size={28} />
                <span className="font-bold text-sm">Pre-list</span>
              </Link>
            </div>

            {/* Active Listings */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                  <Package className="text-green-600" size={28} />
                  Your Listings
                </h2>
                <Link href="/farmer" className="text-green-600 text-sm font-black uppercase tracking-widest hover:underline">Add New</Link>
              </div>
              
              {listings.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                  <Package size={48} className="mx-auto text-slate-300 mb-4" />
                  <p className="text-slate-500 font-bold">No listings yet. Start selling today!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {listings.map((listing) => {
                    const sold = orders.filter(o => o.items?.some((i: any) => i.productId?._id === listing._id)).reduce((acc, o) => {
                        const item = o.items.find((i: any) => i.productId?._id === listing._id);
                        return acc + (item?.quantity || 0);
                    }, 0);
                    const total = listing.availableQuantityKg + sold;
                    const stockPercentage = total > 0 ? (listing.availableQuantityKg / total) * 100 : 0;
                    
                    return (
                      <div key={listing._id} className="bg-slate-50 rounded-2xl p-5 border border-slate-100 hover:border-green-300 transition-all group flex flex-col md:flex-row items-center gap-6">
                        {/* Image */}
                        <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                          {listing.imageUrl ? (
                            <img src={listing.imageUrl} alt={listing.cropName} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300 bg-white">
                              <Leaf size={32} />
                            </div>
                          )}
                        </div>
                        
                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-bold text-lg text-slate-900 flex items-center gap-2">
                                {listing.cropName}
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                  listing.listingType === 'ugly-sell' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                  listing.listingType === 'pre-list' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                  'bg-green-50 text-green-700 border-green-100'
                                }`}>
                                  {listing.listingType}
                                </span>
                              </div>
                              <div className="text-xs text-slate-500 uppercase tracking-widest font-bold">{listing.category}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-black text-xl text-slate-900">₹{listing.pricePerKg}/kg</div>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                listing.status === 'paused' ? 'bg-slate-100 text-slate-600 border-slate-200' :
                                listing.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                listing.status === 'rejected' ? 'bg-red-50 text-red-600 border-red-100' :
                                'bg-green-50 text-green-700 border-green-100'
                              }`}>
                                {listing.status}
                              </span>
                            </div>
                          </div>
                          
                          {/* Stock Progress */}
                          <div className="mt-3">
                            <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                              <span>Available: {listing.availableQuantityKg}kg</span>
                              <span>Sold: {sold}kg</span>
                            </div>
                            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${
                                  stockPercentage < 20 ? 'bg-red-500' :
                                  stockPercentage < 50 ? 'bg-orange-500' :
                                  'bg-green-500'
                                }`}
                                style={{ width: `${stockPercentage}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex md:flex-col justify-end gap-2">
                          <button 
                            onClick={() => {
                              if (listing.status !== 'pending') {
                                handleStatusUpdate(listing._id, listing.status);
                              }
                            }}
                            className={`p-3 rounded-xl transition-all border ${
                              listing.status === 'pending'
                                ? 'text-slate-300 border-slate-100 cursor-not-allowed bg-slate-50'
                                : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50 border-slate-200 hover:border-blue-200 bg-white'
                            }`}
                            title={listing.status === 'active' ? 'Pause' : listing.status === 'pending' ? 'Pending Approval' : 'Activate'}
                            disabled={listing.status === 'pending'}
                          >
                            {listing.status === 'active' ? <Pause size={18} /> : <Play size={18} />}
                          </button>
                          <button 
                            onClick={() => handleRestock(listing._id)}
                            className="p-3 text-slate-500 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all border border-slate-200 hover:border-green-200 bg-white"
                            title="Restock"
                          >
                            <RefreshCw size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(listing._id)}
                            className="p-3 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-slate-200 hover:border-red-200 bg-white"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Logistics & Delivery Settings */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
              <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                <MapPin className="text-orange-500" size={24} />
                Logistics Settings
              </h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div>
                    <p className="font-black text-slate-800">Home Delivery</p>
                    <p className="text-xs text-slate-500 font-bold">Offer doorstep delivery to customers</p>
                  </div>
                  <div className="w-12 h-6 bg-green-500 rounded-full relative cursor-pointer shadow-inner">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-md"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div>
                    <p className="font-black text-slate-800">Farm Pickup</p>
                    <p className="text-xs text-slate-500 font-bold">Allow customers to collect from farm</p>
                  </div>
                  <div className="w-12 h-6 bg-green-500 rounded-full relative cursor-pointer shadow-inner">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-md"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Delivery Radius (km)</label>
                  <input type="number" defaultValue="25" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 font-bold text-slate-800 focus:outline-none focus:border-green-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Estimated Prep Time (days)</label>
                  <input type="number" defaultValue="2" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 font-bold text-slate-800 focus:outline-none focus:border-green-500" />
                </div>
                <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg active:scale-95">
                  Save Logistics
                </button>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                  <ShoppingBag className="text-blue-600" size={28} />
                  Recent Orders
                </h2>
                <button className="text-blue-600 text-sm font-black uppercase tracking-widest hover:underline">View All</button>
              </div>
              <div className="space-y-4">
                {orders.length === 0 ? (
                    <p className="text-slate-500 font-medium text-center py-4">No orders yet.</p>
                ) : (
                    orders.map((order: any) => (
                    <div key={order._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 rounded-3xl bg-slate-50 border border-slate-100 gap-4 group hover:border-blue-200 transition-all">
                        <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{order._id.substring(0, 8)}</span>
                            <span className="text-slate-300">|</span>
                            <span className="text-sm font-bold text-slate-900">{order.consumerId?.name || "Consumer"}</span>
                        </div>
                        <div className="space-y-1">
                            {order.items?.map((item: any, idx: number) => (
                                <p key={idx} className="text-slate-700 font-medium">{item.quantity}kg of <span className="font-bold text-slate-900">{item.cropName}</span></p>
                            ))}
                        </div>
                        <p className="text-xs text-slate-400 font-bold mt-1">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                        <span className={`text-xs font-black uppercase tracking-widest px-4 py-2 rounded-xl ${
                            order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' :
                            order.paymentStatus === 'transferred_to_farmer' ? 'bg-blue-100 text-blue-700' :
                            'bg-slate-200 text-slate-600'
                        }`}>
                            {order.paymentStatus.replace(/_/g, ' ')}
                        </span>
                        </div>
                    </div>
                    ))
                )}
              </div>
            </div>

          </div>

          {/* Right Sidebar (Notifications & Profile Snapshot) */}
          <div className="space-y-6">
            
            {/* Alerts System */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="relative">
                  <Bell className="text-slate-900" size={28} />
                  {generatedAlerts.length > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500 border-2 border-white shadow-sm"></span>
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Smart Alerts</h2>
              </div>
              
              <div className="space-y-4">
                {generatedAlerts.map((alert) => (
                  <div key={alert.id} className={`p-5 rounded-3xl border transition-all cursor-pointer flex gap-3 items-start ${alert.bgColor} hover:brightness-95`}>
                    {alert.icon === "alert" ? <AlertTriangle className="text-amber-600 shrink-0" size={20} /> :
                     alert.icon === "order" ? <ShoppingBag className="text-blue-600 shrink-0" size={20} /> :
                     <TrendingUp className="text-green-600 shrink-0" size={20} />}
                    <div>
                      <p className={`text-sm leading-relaxed font-bold text-slate-900`}>
                        {alert.message}
                      </p>
                    </div>
                  </div>
                ))}
                {generatedAlerts.length === 0 && (
                  <p className="text-slate-500 font-medium text-center py-4">No alerts. All good!</p>
                )}
              </div>
            </div>

            {/* Farm Performance Section */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 p-8">
              <h2 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">Farm Performance</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-sm font-bold uppercase tracking-widest">Total Orders</span>
                  <span className="font-black text-slate-900">{orders.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-sm font-bold uppercase tracking-widest">Wallet Balance</span>
                  <span className="font-black text-blue-600">₹{user.walletBalance || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-sm font-bold uppercase tracking-widest">Quantity Sold</span>
                  <span className="font-black text-slate-900">{orders.reduce((acc, o) => acc + o.items.reduce((sum: number, i: any) => sum + i.quantity, 0), 0)} kg</span>
                </div>
              </div>
              
              <Link href="/farmer/profile" className="block w-full text-center mt-6 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-sm transition-all active:scale-95">
                View Business Profile
              </Link>
            </div>

            {/* Recent Reviews Section */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 p-8">
              <h2 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">Recent Reviews</h2>
              
              <div className="space-y-4">
                {reviews.slice(0, 3).map((review: any) => (
                  <div key={review._id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-slate-900">{review.consumerId?.name || "Anonymous"}</span>
                      <span className="text-yellow-500 flex items-center gap-1 font-black">
                        {review.rating} <Star size={16} fill="currentColor" />
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 font-medium">{review.comment}</p>
                    <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-widest">
                      On {review.listingId?.cropName || "Crop"}
                    </p>
                  </div>
                ))}
                {reviews.length === 0 && (
                  <p className="text-slate-500 font-medium text-center py-4">No reviews yet.</p>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>
      </div>
    </div>
  );
}
