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
  const [loading, setLoading] = useState(true);
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
        fetchPendingCrops();
      }
    }
  }, [router]);

  const fetchPendingCrops = async () => {
    try {
      const res = await fetch(`/api/crops?status=pending`);
      const data = await res.json();
      if (res.ok) {
        setPendingCrops(data.crops);
      }
    } catch (err) {
      console.error("Failed to fetch pending crops:", err);
      toast.error("Failed to load pending crops");
    } finally {
      setLoading(false);
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
      } else {
        toast.error("Failed to update status");
      }
    } catch (err) {
      console.error("Failed to update status", err);
      toast.error("Something went wrong");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  const filteredCrops = pendingCrops.filter(crop => 
    crop.farmerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!user || loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-blue-100 selection:text-blue-900">
      {/* Admin Navbar */}
      <nav className="bg-slate-900 text-white px-4 sm:px-8 py-4 sticky top-0 z-50 shadow-lg shadow-slate-900/10">
        <div className="max-w-[1400px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500/20 p-2 rounded-xl">
              <ShieldCheck size={24} className="text-blue-400" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight block">Admin Console</span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Farm2Home</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-slate-300 hidden sm:block">Hello, {user.name}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 font-bold rounded-xl transition-all active:scale-95 text-sm"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="p-4 sm:p-8 max-w-[1400px] mx-auto space-y-8">
        {/* Header & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-sm border border-slate-200 p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Pending Approvals</h1>
              <p className="text-slate-500 font-medium mt-1">Review and verify new crop listings submitted by farmers.</p>
            </div>
            <div className="bg-amber-50 border border-amber-100 px-6 py-4 rounded-2xl text-amber-600 flex items-center gap-3 shrink-0">
              <Clock size={24} className="animate-pulse" />
              <div>
                <span className="text-2xl font-black block leading-none">{pendingCrops.length}</span>
                <span className="text-xs font-bold uppercase tracking-widest text-amber-500">To Review</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] shadow-lg shadow-blue-600/20 p-8 text-white flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-200">System Status</span>
              <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-ping"></span>
            </div>
            <div>
              <h3 className="text-2xl font-black mb-1">All Systems Live</h3>
              <p className="text-blue-100 text-sm font-medium">Auto-inventory & orders are synced.</p>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by crop or farmer name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500 font-bold">
            <Filter size={16} />
            <span>Showing {filteredCrops.length} of {pendingCrops.length} items</span>
          </div>
        </div>

        {/* Crops Grid */}
        {filteredCrops.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-slate-300 shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldCheck size={40} className="text-slate-300" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">No pending listings</h3>
            <p className="text-slate-500 font-medium max-w-md mx-auto">Either all crops are reviewed or try searching for something else.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCrops.map((crop) => (
              <div key={crop._id} className="group bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-20 h-20 bg-slate-100 rounded-2xl overflow-hidden shrink-0 relative border border-slate-100">
                    {crop.imageUrl ? (
                      <img src={crop.imageUrl} alt={crop.cropName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300 bg-gradient-to-br from-slate-50 to-slate-100">
                        {crop.category === 'vegetable' ? <Leaf size={24} /> : 
                         crop.listingType === 'ugly-sell' ? <Tag size={24} /> : <Tractor size={24} />}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-black text-slate-900 truncate tracking-tight">{crop.cropName}</h3>
                    <p className="text-sm font-bold text-slate-500 truncate">Farmer: {crop.farmerName}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border ${
                        crop.listingType === 'ugly-sell' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                        crop.listingType === 'pre-list' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                        'bg-green-50 text-green-700 border-green-100'
                      }`}>
                        {crop.listingType}
                      </span>
                      {crop.isOrganic && (
                        <span className="px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest bg-green-100 text-green-700 border border-green-200">
                          Organic
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 mb-6 space-y-2 text-sm font-medium">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-bold">Price</span>
                    <span className="text-slate-900 font-black">₹{crop.pricePerKg}/kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-bold">Quantity</span>
                    <span className="text-slate-900 font-black">{crop.availableQuantityKg} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-bold">Location</span>
                    <span className="text-slate-900 font-black truncate max-w-[150px]">{crop.location || crop.pinCode}</span>
                  </div>
                </div>

                <div className="mt-auto flex gap-3">
                  <button 
                    onClick={() => handleStatusUpdate(crop._id, "active")}
                    className="flex-1 flex justify-center items-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95 text-sm"
                  >
                    <CheckCircle size={16} /> Approve
                  </button>
                  <button 
                    onClick={() => handleStatusUpdate(crop._id, "rejected")}
                    className="flex-1 flex justify-center items-center gap-2 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold transition-all active:scale-95 text-sm"
                  >
                    <XCircle size={16} /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
