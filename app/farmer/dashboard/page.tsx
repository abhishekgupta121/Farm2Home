"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Tractor, Package, Bell, ShoppingBag, ArrowRight, Trash2, Plus, Leaf } from "lucide-react";
import Link from "next/link";
import FarmerNavbar from "@/app/components/FarmerNavbar";

// Mock data for notifications and orders (until we implement them)
const MOCK_NOTIFICATIONS = [
  { id: 1, text: "New order placed for Organic Tomatoes (50kg)", time: "10 mins ago", unread: true },
  { id: 2, text: "Payment of ₹4,500 received for Wheat", time: "2 hours ago", unread: false },
];

const MOCK_ORDERS = [
  { id: "#1029", item: "Organic Tomatoes", qty: "50kg", buyer: "Ramesh K.", status: "Pending Delivery" },
  { id: "#1028", item: "Wheat", qty: "100kg", buyer: "Suresh P.", status: "Delivered" },
];

export default function FarmerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
    } else {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      fetchListings(parsedUser._id);
    }
  }, [router]);

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

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");
    router.push("/");
  };

  if (!user || loading) return <div className="p-8 text-center flex items-center justify-center min-h-screen"><div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full"></div></div>;

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Dashboard Area (Listings & Orders) */}
          <div className="lg:col-span-2 space-y-6">
            
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
                  Your Active Listings
                </h2>
                <Link href="/farmer" className="text-green-600 text-sm font-black uppercase tracking-widest hover:underline">Add New</Link>
              </div>
              
              {listings.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                  <Package size={48} className="mx-auto text-slate-300 mb-4" />
                  <p className="text-slate-500 font-bold">No listings yet. Start selling today!</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 text-xs font-black uppercase tracking-widest">
                        <th className="pb-4 pl-2">Crop Details</th>
                        <th className="pb-4 text-center">Type</th>
                        <th className="pb-4 text-center">Price</th>
                        <th className="pb-4 text-right pr-2">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {listings.map((listing) => (
                        <tr key={listing._id} className="group hover:bg-slate-50/50 transition-colors">
                          <td className="py-5 pl-2">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-100">
                                {listing.imageUrl ? (
                                  <img src={listing.imageUrl} alt={listing.cropName} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                                    <Leaf size={20} />
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="font-bold text-slate-900">{listing.cropName}</div>
                                <div className="text-xs text-slate-500 uppercase tracking-tighter font-bold">{listing.category} • {listing.availableQuantityKg}kg</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-5 text-center">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                              listing.listingType === 'ugly-sell' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                              listing.listingType === 'pre-list' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                              'bg-green-50 text-green-700 border-green-100'
                            }`}>
                              {listing.listingType}
                            </span>
                          </td>
                          <td className="py-5 text-center font-black text-slate-900">₹{listing.pricePerKg}/kg</td>
                          <td className="py-5 text-right pr-2">
                            <button 
                              onClick={() => handleDelete(listing._id)}
                              className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Incoming Orders */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                  <ShoppingBag className="text-blue-600" size={28} />
                  Recent Orders
                </h2>
                <button className="text-blue-600 text-sm font-black uppercase tracking-widest hover:underline">View All</button>
              </div>
              <div className="space-y-4">
                {MOCK_ORDERS.map((order) => (
                  <div key={order.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 rounded-3xl bg-slate-50 border border-slate-100 gap-4 group hover:border-blue-200 transition-all">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{order.id}</span>
                        <span className="text-slate-300">|</span>
                        <span className="text-sm font-bold text-slate-900">{order.buyer}</span>
                      </div>
                      <p className="text-slate-700 font-medium">{order.qty} of <span className="font-bold text-slate-900">{order.item}</span></p>
                    </div>
                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                      <span className={`text-xs font-black uppercase tracking-widest px-4 py-2 rounded-xl ${
                        order.status === 'Pending Delivery' ? 'bg-orange-100 text-orange-700' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {order.status}
                      </span>
                      {order.status === 'Pending Delivery' && (
                        <button className="p-3 bg-white rounded-xl shadow-sm border border-slate-200 text-slate-700 hover:text-green-600 hover:border-green-300 transition-all active:scale-90">
                          <ArrowRight size={20} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Sidebar (Notifications & Profile Snapshot) */}
          <div className="space-y-6">
            
            {/* Notifications */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="relative">
                  <Bell className="text-slate-900" size={28} />
                  <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white shadow-sm"></span>
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Alerts</h2>
              </div>
              
              <div className="space-y-4">
                {MOCK_NOTIFICATIONS.map((notif) => (
                  <div key={notif.id} className={`p-5 rounded-3xl border transition-all cursor-pointer ${notif.unread ? 'bg-blue-50/50 border-blue-100 hover:bg-blue-50' : 'bg-white border-slate-100 hover:bg-slate-50'}`}>
                    <p className={`text-sm leading-relaxed ${notif.unread ? 'font-bold text-slate-900' : 'text-slate-600 font-medium'}`}>
                      {notif.text}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-3 font-black uppercase tracking-widest">{notif.time}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Profile Snapshot */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] shadow-xl p-8 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-40 h-40 bg-green-500/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-green-500/20 transition-all duration-700"></div>
              <h3 className="text-xl font-black mb-6 tracking-tight">Farm Performance</h3>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm font-bold uppercase tracking-widest">Rating</span>
                  <span className="font-black text-yellow-400 flex items-center gap-1">★ 4.8</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm font-bold uppercase tracking-widest">Total Sales</span>
                  <span className="font-black text-2xl">₹1.2L</span>
                </div>
              </div>
              <Link href="/farmer/profile" className="block w-full text-center py-4 bg-white/10 hover:bg-white/20 rounded-2xl font-black text-sm transition-all backdrop-blur-md border border-white/10 hover:border-white/20 active:scale-95">
                View Business Profile
              </Link>
            </div>

          </div>
        </div>

      </div>
      </div>
    </div>
  );
}
