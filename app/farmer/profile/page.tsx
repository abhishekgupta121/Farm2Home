"use client";

import { useEffect, useState } from "react";
import { User, Star, ShieldAlert, Award, PackageCheck, TrendingUp } from "lucide-react";
import FarmerNavbar from "@/app/components/FarmerNavbar";

export default function FarmerProfilePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      // Demo user if none exists
      setUser({ name: "Raju Farmer", farmName: "Green Valley Farms", mobileNumber: "9876543210" });
    } else {
      setUser(JSON.parse(userData));
    }
  }, []);

  if (!user) return <div className="p-8 text-center flex items-center justify-center min-h-screen"><div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full"></div></div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <FarmerNavbar />
      <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Profile Header */}
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200 flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-50 rounded-full blur-3xl -mr-20 -mt-20"></div>
          
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0 z-10">
            <User size={48} />
          </div>
          
          <div className="text-center md:text-left z-10 flex-1">
            <h1 className="text-3xl font-extrabold text-slate-900">{user.name}</h1>
            <p className="text-lg text-slate-600 font-medium mb-4">{user.farmName}</p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-50 text-yellow-700 text-sm font-bold border border-yellow-100">
                <Star size={16} fill="currentColor" /> 4.8 / 5.0 Rating
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-sm font-bold border border-blue-100">
                <Award size={16} /> Verified Seller
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-4">
              <PackageCheck size={24} />
            </div>
            <p className="text-slate-500 font-semibold mb-1">Total Crops Sold</p>
            <h3 className="text-3xl font-black text-slate-900">4,520 <span className="text-base font-medium text-slate-500">kg</span></h3>
          </div>
          
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
              <TrendingUp size={24} />
            </div>
            <p className="text-slate-500 font-semibold mb-1">Successful Orders</p>
            <h3 className="text-3xl font-black text-slate-900">128</h3>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-4">
              <Star size={24} />
            </div>
            <p className="text-slate-500 font-semibold mb-1">Total Reviews</p>
            <h3 className="text-3xl font-black text-slate-900">95</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Reviews Section */}
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Star className="text-yellow-500" fill="currentColor" size={24} />
              Recent Reviews
            </h2>
            <div className="space-y-6">
              {[
                { name: "Rahul S.", rating: 5, text: "Excellent quality tomatoes, delivered exactly on time. Will buy again!" },
                { name: "Meena K.", rating: 4, text: "Good quality wheat, packaging could be slightly better." },
                { name: "Amit V.", rating: 5, text: "Very fresh produce. Highly recommended farmer." }
              ].map((review, i) => (
                <div key={i} className="border-b border-slate-100 last:border-0 pb-6 last:pb-0">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-slate-800">{review.name}</span>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} size={14} fill={j < review.rating ? "currentColor" : "none"} className={j >= review.rating ? "text-slate-200" : ""} />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm">{review.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Rating & Penalty System Overview */}
          <div className="bg-red-50/50 rounded-[2rem] p-8 shadow-sm border border-red-100">
            <h2 className="text-xl font-bold text-red-900 mb-6 flex items-center gap-2">
              <ShieldAlert className="text-red-500" size={24} />
              Rating & Penalty System
            </h2>
            <div className="prose prose-sm text-red-800/80">
              <p className="font-medium text-red-900 mb-4">
                To maintain trust in the Farm2Home marketplace, we enforce strict guidelines on order fulfillment.
              </p>
              
              <div className="bg-white/60 rounded-xl p-4 border border-red-100 space-y-3 mb-4">
                <h4 className="font-bold text-red-900 m-0">Delivery Delays</h4>
                <p className="m-0 text-sm">
                  If you delay an order beyond the promised delivery date:
                </p>
                <ul className="list-disc pl-4 space-y-1 text-sm font-semibold m-0">
                  <li>Your overall farmer rating will be penalized.</li>
                  <li>The consumer will automatically receive a full refund.</li>
                  <li>Frequent delays may result in temporary account suspension.</li>
                </ul>
              </div>

              <div className="bg-white/60 rounded-xl p-4 border border-red-100 space-y-3">
                <h4 className="font-bold text-red-900 m-0">Quality Disputes</h4>
                <p className="m-0 text-sm">
                  If the delivered crop quality does not match the listing (except for items explicitly sold under "Ugly Sell"), consumers can raise a dispute leading to potential refunds and rating deductions.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
      </div>
    </div>
  );
}
