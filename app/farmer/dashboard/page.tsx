"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Tractor } from "lucide-react";

export default function FarmerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
    } else {
      setUser(JSON.parse(userData));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  if (!user) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-3 rounded-full text-green-600">
              <Tractor size={28} />
            </div>
            <h1 className="text-3xl font-bold text-slate-800">Farmer Dashboard</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 font-bold rounded-xl transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Welcome back, {user.name}!</h2>
          <p className="text-slate-600 mb-2"><strong>Farm Name:</strong> {user.farmName || "N/A"}</p>
          <p className="text-slate-600 mb-2"><strong>Mobile:</strong> {user.mobileNumber}</p>
          <p className="text-slate-600 mb-2"><strong>Role:</strong> {user.role}</p>
        </div>
      </div>
    </div>
  );
}
