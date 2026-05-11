"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Tractor, Package, Bell, ShoppingBag, ArrowRight, Trash2, Plus, Leaf, TrendingUp, DollarSign, Star, Edit, Pause, Play, RefreshCw, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import FarmerNavbar from "@/app/components/FarmerNavbar";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { translations } from "@/lib/translations";

// Real data fetched from database
export default function FarmerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<'en' | 'hi'>('en');

  useEffect(() => {
    const savedLang = localStorage.getItem("lang") as 'en' | 'hi';
    if (savedLang) {
      setLang(savedLang);
    }
  }, []);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
    } else {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== "farmer") {
        router.push("/");
      } else {
        setUser(parsedUser);
        fetchListings(parsedUser._id);
        fetchOrders(parsedUser._id);
        fetchReviews(parsedUser._id);
        refreshWallet(parsedUser._id);
      }
    }
  }, [router]);

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

  const fetchListings = async (farmerId: string) => {
    try {
      const res = await fetch(`/api/crops?farmerId=${farmerId}`);
      const data = await res.json();
      if (res.ok) {
        setListings(data.crops);
      }
    } catch (err) {
      console.error("Failed to fetch listings:", err);
    } finally {
      setLoading(false);
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

  const handleOrderAction = (orderId: string, action: "Accept" | "Reject" | "Delivered") => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        let newStatus = o.status;
        if (action === "Accept") newStatus = "Accepted";
        if (action === "Reject") newStatus = "Rejected";
        if (action === "Delivered") newStatus = "Delivered";
        return { ...o, status: newStatus };
      }
      return o;
    }));
    
    const actionText = action === "Accept" ? "accepted" : action === "Reject" ? "rejected" : "delivered";
    setAlerts(prev => [
      { id: Date.now(), text: `Order ${orderId} was ${actionText}`, type: action === "Reject" ? "warning" : "success", time: "Just now" },
      ...prev
    ]);
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
    const sold = orders.reduce((acc, o) => {
      const matchingItems = o.items ? o.items.filter((item: any) => item.productId?._id === l._id) : [];
      return acc + matchingItems.reduce((sum: number, item: any) => sum + item.quantity, 0);
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
      


      <div className="p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-4 rounded-2xl text-green-600">
              <Tractor size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{translations[lang].fd_welcome}, {user.name}</h1>
              <p className="text-slate-500 font-medium">{user.farmName || "Farmer Dashboard"}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Language Toggle */}
            <div className="flex gap-1 bg-white border border-slate-200 rounded-lg p-1 text-xs font-bold shadow-sm">
              <button 
                onClick={() => { setLang('en'); localStorage.setItem('lang', 'en'); }} 
                className={`px-3 py-1.5 rounded-md transition-all ${lang === 'en' ? 'bg-green-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                English
              </button>
              <button 
                onClick={() => { setLang('hi'); localStorage.setItem('lang', 'hi'); }} 
                className={`px-3 py-1.5 rounded-md transition-all ${lang === 'hi' ? 'bg-green-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                हिंदी
              </button>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 hover:bg-red-100 font-bold rounded-2xl transition-all active:scale-95"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>

        {/* Top Summary Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col gap-1 hover:border-green-300 transition-colors cursor-pointer">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{translations[lang].fd_activeListings}</span>
            <span className="text-3xl font-black text-slate-900">{listings.filter(l => l.status === 'active').length}</span>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col gap-1 hover:border-orange-300 transition-colors cursor-pointer">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{translations[lang].fd_totalOrders}</span>
            <span className="text-3xl font-black text-slate-900">{orders.length}</span>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col gap-1 hover:border-blue-300 transition-colors cursor-pointer">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{translations[lang].fd_walletBalance}</span>
            <span className="text-3xl font-black text-blue-600">₹{user.walletBalance || 0}</span>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col gap-1 hover:border-yellow-300 transition-colors cursor-pointer">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{translations[lang].fd_avgRating}</span>
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
            
            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-4">
              <Link href="/farmer" className="bg-green-600 hover:bg-green-700 text-white rounded-2xl p-6 flex flex-col items-center justify-center gap-2 transition-all hover:-translate-y-1 shadow-lg shadow-green-600/20 active:scale-95">
                <Plus size={28} />
                <span className="font-bold text-sm">{translations[lang].fd_uploadCrop}</span>
              </Link>
              <Link href="/farmer/ugly-sell" className="bg-orange-500 hover:bg-orange-600 text-white rounded-2xl p-6 flex flex-col items-center justify-center gap-2 transition-all hover:-translate-y-1 shadow-lg shadow-orange-500/20 active:scale-95">
                <Package size={28} />
                <span className="font-bold text-sm">{translations[lang].fd_uglySell}</span>
              </Link>
              <Link href="/farmer/pre-list" className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl p-6 flex flex-col items-center justify-center gap-2 transition-all hover:-translate-y-1 shadow-lg shadow-blue-600/20 active:scale-95">
                <Package size={28} />
                <span className="font-bold text-sm">{translations[lang].fd_preList}</span>
              </Link>
            </div>

            {/* Active Listings */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                  <Package className="text-green-600" size={28} />
                  {translations[lang].fd_yourListings}
                </h2>
                <Link href="/farmer" className="text-green-600 text-sm font-black uppercase tracking-widest hover:underline">{translations[lang].fd_addNew}</Link>
              </div>
              
              {listings.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                  <Package size={48} className="mx-auto text-slate-300 mb-4" />
                  <p className="text-slate-500 font-bold">{translations[lang].fd_noListings}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {listings.map((listing) => {
                    const sold = orders.reduce((acc, o) => {
                      const matchingItems = o.items ? o.items.filter((item: any) => item.productId?._id === listing._id) : [];
                      return acc + matchingItems.reduce((sum: number, item: any) => sum + item.quantity, 0);
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
                              <span>{translations[lang].fd_available}: {listing.availableQuantityKg}kg</span>
                              <span>{translations[lang].fd_sold}: {sold}kg</span>
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



          </div>

          {/* Right Sidebar (Notifications & Profile Snapshot) */}
          <div className="space-y-6">
            


            {/* Farm Performance Section */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 p-8">
              <h2 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">{translations[lang].fd_farmPerformance}</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-sm font-bold uppercase tracking-widest">{translations[lang].fd_totalOrders}</span>
                  <span className="font-black text-slate-900">{orders.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-sm font-bold uppercase tracking-widest">{translations[lang].fd_walletBalance}</span>
                  <span className="font-black text-blue-600">₹{user.walletBalance || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-sm font-bold uppercase tracking-widest">{translations[lang].fd_quantitySold}</span>
                  <span className="font-black text-slate-900">
                    {orders.reduce((acc, o) => {
                      const farmerItems = o.items ? o.items.filter((item: any) => item.farmerId?._id === user?._id) : [];
                      return acc + farmerItems.reduce((sum: number, item: any) => sum + item.quantity, 0);
                    }, 0)} kg
                  </span>
                </div>
              </div>
              
              <Link href="/farmer/profile" className="block w-full text-center mt-6 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-sm transition-all active:scale-95">
                {translations[lang].fd_viewProfile}
              </Link>
            </div>

            {/* Recent Reviews Section */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 p-8">
              <h2 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">{translations[lang].fd_recentReviews}</h2>
              
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
                  <p className="text-slate-500 font-medium text-center py-4">{translations[lang].fd_noReviews}</p>
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
