"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import FarmerNavbar from "@/app/components/FarmerNavbar";

export default function FarmerOrdersPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
    } else {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      fetchOrders(parsedUser._id);
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
    } finally {
      setLoading(false);
    }
  };

  if (!user || loading) {
    return (
      <div className="p-8 text-center flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <FarmerNavbar />
      
      <div className="p-4 sm:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
                <ShoppingBag className="text-blue-600" size={32} />
                My Orders
              </h2>
            </div>
            
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag size={32} className="text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No orders yet</h3>
                <p className="text-slate-500">When customers place orders for your crops, they will appear here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order: any) => (
                  <div key={order._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 rounded-3xl bg-slate-50 border border-slate-100 gap-4 group hover:border-blue-200 transition-all">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-3 py-1 bg-slate-900 text-white rounded-lg text-[10px] font-black tracking-widest uppercase">
                          ORDER #{order._id}
                        </span>
                        <span className="text-slate-300">|</span>
                        <span className="text-sm font-bold text-slate-900">{order.consumerId?.name || "Test Consumer"}</span>
                      </div>
                      <p className="text-slate-700 font-medium">{order.quantity}kg of <span className="font-bold text-slate-900">{order.listingId?.cropName || "Unknown Crop"}</span> — <span className="text-green-600 font-bold">₹{order.totalPrice}</span></p>
                      <p className="text-xs text-slate-400 font-bold mt-1">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="bg-orange-50 border border-orange-100 px-4 py-2 rounded-xl text-center">
                        <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-0.5">Pickup OTP</p>
                        <p className="font-black text-orange-700 tracking-[0.2em]">{order.farmerOtp || "123456"}</p>
                      </div>
                      <span className={`text-xs font-black uppercase tracking-widest px-4 py-2 rounded-xl ${
                        order.orderStatus === 'placed' ? 'bg-orange-100 text-orange-700' :
                        order.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-700' :
                        order.orderStatus === 'delivered' ? 'bg-green-100 text-green-700' :
                        'bg-slate-200 text-slate-600'
                      }`}>
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
