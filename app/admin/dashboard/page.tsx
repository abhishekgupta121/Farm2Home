"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, ShieldCheck, CheckCircle, XCircle, Clock } from "lucide-react";
import Image from "next/image";

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [pendingCrops, setPendingCrops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  if (!user || loading) return <div className="p-8 text-center flex items-center justify-center min-h-screen"><div className="animate-spin w-8 h-8 border-4 border-slate-500 border-t-transparent rounded-full"></div></div>;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Admin Navbar */}
      <nav className="bg-slate-900 text-white px-4 sm:px-8 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <ShieldCheck size={28} className="text-blue-400" />
            <span className="text-xl font-black tracking-tight">Admin Console</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 font-bold rounded-xl transition-all"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </nav>

      <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-slate-900">Pending Approvals</h1>
            <p className="text-slate-500 font-medium mt-1">Review new crop listings submitted by farmers.</p>
          </div>
          <div className="bg-amber-100 p-4 rounded-2xl text-amber-600 flex items-center gap-3">
            <Clock size={24} />
            <span className="text-xl font-black">{pendingCrops.length} Pending</span>
          </div>
        </div>

        {pendingCrops.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
            <ShieldCheck size={64} className="mx-auto text-slate-300 mb-6" />
            <h3 className="text-2xl font-black text-slate-900 mb-2">All caught up!</h3>
            <p className="text-slate-500 font-medium">There are no pending listings to review right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingCrops.map((crop) => (
              <div key={crop._id} className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200 flex flex-col">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-20 h-20 bg-slate-100 rounded-2xl overflow-hidden shrink-0">
                    {crop.imageUrl ? (
                      <img src={crop.imageUrl} alt={crop.cropName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <ShieldCheck size={24} />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">{crop.cropName}</h3>
                    <p className="text-sm font-bold text-slate-500">{crop.farmerName}</p>
                    <span className="inline-block mt-2 px-2 py-1 bg-slate-100 rounded-md text-[10px] font-black uppercase tracking-widest text-slate-600">
                      {crop.category} • {crop.availableQuantityKg}kg
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 mb-6 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-bold">Price</span>
                    <span className="text-slate-900 font-black">₹{crop.pricePerKg}/kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-bold">Listing Type</span>
                    <span className="text-slate-900 font-black capitalize">{crop.listingType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-bold">Pincode</span>
                    <span className="text-slate-900 font-black">{crop.pinCode}</span>
                  </div>
                </div>

                <div className="mt-auto flex gap-3">
                  <button 
                    onClick={() => handleStatusUpdate(crop._id, "active")}
                    className="flex-1 flex justify-center items-center gap-2 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-green-500/20 active:scale-95"
                  >
                    <CheckCircle size={18} /> Approve
                  </button>
                  <button 
                    onClick={() => handleStatusUpdate(crop._id, "rejected")}
                    className="flex-1 flex justify-center items-center gap-2 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold transition-all active:scale-95"
                  >
                    <XCircle size={18} /> Reject
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
