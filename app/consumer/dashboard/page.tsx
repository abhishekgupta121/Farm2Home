"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, ShoppingCart, MapPin, Search, Filter, ShoppingBag, Leaf, Tractor, Tag } from "lucide-react";
import Image from "next/image";

export default function ConsumerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [crops, setCrops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
    } else {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      fetchNearbyCrops(parsedUser.pinCode);
    }
  }, [router]);

  const fetchNearbyCrops = async (pinCode: string) => {
    try {
      const res = await fetch(`/api/crops?pinCode=${pinCode}`);
      const data = await res.json();
      if (res.ok) {
        setCrops(data.crops);
      }
    } catch (err) {
      console.error("Failed to fetch crops:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");
    router.push("/");
  };

  const filteredCrops = crops.filter(crop => 
    crop.cropName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    crop.farmerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!user || loading) return <div className="p-8 text-center flex items-center justify-center min-h-screen bg-slate-50"><div className="animate-spin w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full"></div></div>;

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-orange-100 selection:text-orange-900">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-orange-100 p-3 rounded-2xl text-orange-600 shadow-sm">
              <ShoppingCart size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Marketplace</h1>
              <div className="flex items-center gap-1.5 text-slate-500 text-xs font-bold uppercase tracking-widest">
                <MapPin size={12} className="text-orange-500" />
                {user.pinCode} • Nearby You
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search crops, farmers..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-400 transition-all font-medium"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-orange-50 hover:text-orange-600 transition-colors">
              <ShoppingBag size={22} />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-orange-500 rounded-full border-2 border-white"></span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 hover:bg-red-100 font-bold rounded-2xl transition-all active:scale-95"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="p-4 sm:p-8 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-[2.5rem] p-8 sm:p-12 text-white relative overflow-hidden shadow-xl shadow-orange-500/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="relative z-10">
            <h2 className="text-4xl font-black mb-4 tracking-tight">Fresh from farms to your table, {user.name.split(' ')[0]}!</h2>
            <p className="text-orange-50 font-medium text-lg max-w-xl opacity-90">
              Supporting local farmers in <span className="font-bold underline decoration-white/30 underline-offset-4">{user.pinCode}</span>. Quality produce at fair prices.
            </p>
          </div>
          <div className="absolute bottom-8 right-12 hidden lg:block animate-float">
            <div className="bg-white/20 backdrop-blur-md p-4 rounded-3xl border border-white/30 flex items-center gap-4">
              <div className="bg-white text-orange-600 p-3 rounded-2xl shadow-lg">
                <Leaf size={24} />
              </div>
              <div className="pr-4">
                <div className="text-xs font-black uppercase tracking-widest opacity-70">Nearby Farmers</div>
                <div className="text-2xl font-black">{crops.length} Active</div>
              </div>
            </div>
          </div>
        </div>

        {/* Crops Grid */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Nearby Listings</h3>
            <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mt-1">Available in {user.pinCode}</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
            <Filter size={18} />
            Filter
          </button>
        </div>

        {filteredCrops.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[2.5rem] border border-dashed border-slate-200 shadow-sm">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search size={40} className="text-slate-300" />
            </div>
            <h4 className="text-xl font-bold text-slate-800 mb-2">No crops found nearby</h4>
            <p className="text-slate-500 font-medium">Check back later or try a different search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCrops.map((crop) => (
              <div key={crop._id} className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 overflow-hidden">
                {/* Visual Representation of Crop */}
                <div className="h-48 bg-slate-100 relative overflow-hidden">
                  {crop.imageUrl ? (
                    <img 
                      src={crop.imageUrl} 
                      alt={crop.cropName} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                  ) : (
                    <>
                      <div className={`absolute inset-0 opacity-20 bg-gradient-to-br ${
                        crop.category === 'vegetable' ? 'from-green-500 to-emerald-700' :
                        crop.category === 'fruit' ? 'from-red-500 to-orange-600' :
                        'from-yellow-500 to-amber-700'
                      }`}></div>
                      <div className="absolute inset-0 flex items-center justify-center text-slate-300 group-hover:scale-110 transition-transform duration-700">
                        {crop.category === 'vegetable' ? <Leaf size={64} /> : 
                         crop.listingType === 'ugly-sell' ? <Tag size={64} /> : <Tractor size={64} />}
                      </div>
                    </>
                  )}
                  
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg ${
                      crop.listingType === 'ugly-sell' ? 'bg-orange-500 text-white' :
                      crop.listingType === 'pre-list' ? 'bg-blue-500 text-white' :
                      'bg-green-600 text-white'
                    }`}>
                      {crop.listingType}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-xl font-black text-slate-900 tracking-tight">{crop.cropName}</h4>
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{crop.category}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-slate-900 leading-none">₹{crop.pricePerKg}</div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">per kg</div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4 my-6 space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 font-bold">Farmer</span>
                      <span className="text-slate-900 font-black">{crop.farmerName}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 font-bold">Quantity</span>
                      <span className="text-slate-900 font-black">{crop.availableQuantityKg} kg</span>
                    </div>
                  </div>

                  <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg active:scale-95 group-hover:shadow-orange-500/20">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
