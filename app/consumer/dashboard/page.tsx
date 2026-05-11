"use client";

import { useEffect, useState, Suspense, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LogOut, ShoppingCart, MapPin, Search, Filter, ShoppingBag, Leaf, Tractor, Tag, X, RefreshCw, Clock, User as UserIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useCart } from "@/lib/CartContext";
import FilterSidebar from "@/app/components/FilterSidebar";
import FilterDrawer from "@/app/components/FilterDrawer";
import FilterChips from "@/app/components/FilterChips";
import ProductSkeleton from "@/app/components/ProductSkeleton";
import toast from "react-hot-toast";
import { translations } from "@/lib/translations";

const formatAddress = (addr: any, pinCode: string, fallback: string) => {
  if (!addr) return fallback || pinCode;
  if (typeof addr === 'string') return `${addr}${pinCode ? ` - ${pinCode}` : ""}`;
  const parts = [addr.addressLine1, addr.addressLine2, addr.city, addr.state].filter(Boolean);
  let formatted = parts.length > 0 ? parts.join(", ") : fallback;
  if (pinCode && !formatted.includes(pinCode)) {
    formatted += ` - ${pinCode}`;
  }
  return formatted;
};

function ProductCard({ crop, addToCart }: { crop: any; addToCart: (id: string, qty: number) => void }) {
  const minQty = Math.min(["vegetable", "fruit"].includes(crop.category) ? 5 : 20, crop.availableQuantityKg);
  const [quantity, setQuantity] = useState<number | string>(minQty);
  const [added, setAdded] = useState(false);

  const pulseImages: { [key: string]: string } = {
    moong: "https://5.imimg.com/data5/SELLER/Default/2025/9/543231555/LO/GS/HR/45333637/30kg-moong-daal-1000x1000.jpeg",
    masoor: "https://5.imimg.com/data5/SELLER/Default/2023/3/294545924/WG/XA/HG/40169047/malka-masoor-dal-1000x1000.jpg",
    toor: "https://5.imimg.com/data5/SELLER/Default/2022/7/CH/AJ/EW/124695288/yellow-thur-dhall-500x500.png",
    default: "https://goqii.com/blog/wp-content/uploads/Why-Pulses-Are-Good-For-You-1024x683.jpg"
  };

  const handleAdd = () => {
    const finalQty = typeof quantity === 'number' ? quantity : minQty;
    if (finalQty < minQty) return;
    addToCart(crop._id, finalQty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleQtyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '') {
      setQuantity('');
      return;
    }
    const num = parseInt(val);
    if (!isNaN(num)) {
      setQuantity(Math.min(num, crop.availableQuantityKg));
    }
  };

  const handleQtyBlur = () => {
    if (quantity === '' || (typeof quantity === 'number' && quantity < minQty)) {
      setQuantity(minQty);
    }
  };

  return (
    <div className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 overflow-hidden flex flex-col">
      <div className="h-56 bg-slate-100 relative overflow-hidden shrink-0">
        {crop.category === 'pulses' ? (
          <img 
            src={pulseImages[crop.subCategory] || pulseImages.default} 
            alt={crop.cropName} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
          />
        ) : crop.imageUrl ? (
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
        
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg ${
            crop.listingType === 'ugly-sell' ? 'bg-orange-500 text-white' :
            crop.listingType === 'pre-list' ? 'bg-blue-500 text-white' :
            'bg-green-600 text-white'
          }`}>
            {crop.listingType}
          </span>
          {crop.isOrganic && (
            <span className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg bg-green-100 text-green-700 border border-green-200">
              Organic
            </span>
          )}
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
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

        <div className="bg-slate-50 rounded-2xl p-4 my-6 space-y-3 flex-1 border border-slate-100">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500 font-bold">Farmer</span>
            <span className="text-slate-900 font-black flex items-center gap-1">
              {crop.farmerName}
              {crop.isVerifiedFarmer && (
                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              )}
            </span>
          </div>
          <div className="flex flex-col text-sm">
            <span className="text-slate-500 font-bold mb-1">Full Address</span>
            <span className="text-slate-900 font-bold capitalize leading-tight">{formatAddress(crop.farmerId?.address, crop.pinCode, crop.location)}</span>
          </div>
          <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-200">
            <span className="text-slate-500 font-bold">Listed On</span>
            <span className="text-slate-900 font-black">{new Date(crop.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-200">
            <span className="text-slate-500 font-bold">Availability</span>
            {crop.availableQuantityKg > 0 ? (
              <span className="text-green-600 font-black">{crop.availableQuantityKg} kg</span>
            ) : (
              <span className="text-red-500 font-black">Out of Stock</span>
            )}
          </div>
        </div>



        {crop.availableQuantityKg > 0 ? (
          <div className="flex gap-3 mt-auto">
            <div className="relative flex flex-col justify-center shrink-0 w-24">
              <div className="relative flex items-center w-full mb-1">
                <input 
                  type="number" 
                  min={minQty} 
                  max={crop.availableQuantityKg}
                  value={quantity}
                  onChange={handleQtyChange}
                  onBlur={handleQtyBlur}
                  className="w-full h-full py-4 pl-4 pr-8 bg-slate-50 border border-slate-200 rounded-2xl font-black text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all placeholder:text-slate-400"
                  placeholder="Qty"
                />
                <span className="absolute right-3 text-[10px] font-black text-slate-400 uppercase pointer-events-none">kg</span>
              </div>
              <div className="text-[10px] font-bold text-orange-500 text-center leading-tight">
                Min: {minQty} kg<br/>Max: {crop.availableQuantityKg} kg
              </div>
            </div>
            <button 
              onClick={handleAdd}
              disabled={quantity === '' || Number(quantity) < minQty}
              className={`flex-1 py-4 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg active:scale-95 group-hover:shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed ${added ? 'bg-green-600 hover:bg-green-700 shadow-green-500/20' : 'bg-slate-900 hover:bg-orange-600'}`}
            >
              {added ? "Added ✓" : "Add to Cart"}
            </button>
          </div>
        ) : (
          <button disabled className="w-full mt-auto py-4 bg-slate-100 text-slate-400 rounded-2xl font-black text-sm uppercase tracking-widest cursor-not-allowed">
            Out of Stock
          </button>
        )}
      </div>
    </div>
  );
}

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToCart, totalItems } = useCart();

  const [user, setUser] = useState<any>(null);
  const [crops, setCrops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<'en' | 'hi'>('en');

  useEffect(() => {
    const savedLang = localStorage.getItem("lang") as 'en' | 'hi';
    if (savedLang) {
      setLang(savedLang);
    }
  }, []);
  const [totalProducts, setTotalProducts] = useState(0);
  const [orders, setOrders] = useState<any[]>([]);
  
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [showOrders, setShowOrders] = useState(false);

  // Parse filters from URL
  const currentFilters = {
    category: searchParams.get("category") ? searchParams.get("category")?.split(",") : [],
    subCategory: searchParams.get("subCategory") ? searchParams.get("subCategory")?.split(",") : [],
    listingType: searchParams.get("listingType") ? searchParams.get("listingType")?.split(",") : [],
    location: searchParams.get("location") || "",
    search: searchParams.get("search") || "",
    sort: searchParams.get("sort") || "newest",
    page: parseInt(searchParams.get("page") || "1"),
  };

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
    } else {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== "consumer") {
        router.push("/");
      } else {
        setUser(parsedUser);
        // Fetch crops based on url params OR default to user pinCode if no location specified
        fetchCrops(parsedUser.pinCode);
        // Refresh wallet balance from DB
        refreshWallet(parsedUser._id);
        // Fetch order history
        fetchOrders(parsedUser._id);
      }
    }
  }, [searchParams]); // Re-fetch when URL changes

  const refreshWallet = async (userId: string) => {
    try {
      const res = await axios.get(`/api/user/wallet?userId=${userId}`);
      const balance = res.data.walletBalance;
      setUser((prev: any) => {
        const updated = { ...prev, walletBalance: balance };
        localStorage.setItem("user", JSON.stringify(updated));
        return updated;
      });
    } catch (err) {
      console.error("Failed to refresh wallet:", err);
    }
  };

  const fetchCrops = async (defaultPin: string) => {
    setLoading(true);
    try {
      // Build API query string based on URL filters
      const params = new URLSearchParams(searchParams.toString());
      if (!params.has("location")) {
        // Only filter by pinCode if it's a valid 6-digit value
        if (defaultPin && defaultPin !== "undefined" && /^\d{6}$/.test(defaultPin)) {
          params.set("location", defaultPin);
        }
      }
      
      const res = await axios.get(`/api/crops?${params.toString()}`);
      setCrops(res.data.crops);
      setTotalProducts(res.data.pagination?.total || 0);
    } catch (err) {
      console.error("Failed to fetch crops:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async (userId: string) => {
    try {
      const res = await fetch(`/api/orders?consumerId=${userId}&t=${Date.now()}`);
      const data = await res.json();
      if (res.ok) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  };

  const handleRateFarmer = async (order: any) => {
    const rating = prompt("Enter rating (1-5):");
    const comment = prompt("Enter comment:");
    
    if (!rating || !comment) return;
    
    const ratingNum = parseInt(rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      toast.error("Invalid rating. Must be 1-5");
      return;
    }

    try {
      const firstItem = order.items && order.items.length > 0 ? order.items[0] : null;
      if (!firstItem) {
        toast.error("Cannot rate this order, no items found.");
        return;
      }

      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId: firstItem.productId?._id || firstItem.productId,
          consumerId: user._id,
          farmerId: firstItem.farmerId?._id || firstItem.farmerId,
          rating: ratingNum,
          comment,
        }),
      });

      if (res.ok) {
        toast.success("Review submitted successfully!");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to submit review");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");
    router.push("/");
  };

  // Update URL based on filter changes
  const applyFilters = useCallback((newFilters: any) => {
    const params = new URLSearchParams();
    
    if (newFilters.category?.length > 0) params.set("category", newFilters.category.join(","));
    if (newFilters.subCategory?.length > 0) params.set("subCategory", newFilters.subCategory.join(","));
    if (newFilters.listingType?.length > 0) params.set("listingType", newFilters.listingType.join(","));
    if (newFilters.location) params.set("location", newFilters.location);
    if (newFilters.search) params.set("search", newFilters.search);
    if (newFilters.sort && newFilters.sort !== "newest") params.set("sort", newFilters.sort);
    
    // Always reset to page 1 when filters change
    params.set("page", "1");

    router.push(`/consumer/dashboard?${params.toString()}`, { scroll: false });
  }, [router]);

  // Handler from chips or clear all
  const removeFilter = (key: string, value?: string) => {
    const newFilters = { ...currentFilters };
    if (key === "category" && value) {
      newFilters.category = (newFilters.category || []).filter((c: string) => c !== value);
    } else if (key === "subCategory" && value) {
      newFilters.subCategory = (newFilters.subCategory || []).filter((c: string) => c !== value);
    } else if (key === "listingType" && value) {
      newFilters.listingType = (newFilters.listingType || []).filter((t: string) => t !== value);
    } else {
      (newFilters as any)[key] = "";
    }
    applyFilters(newFilters);
  };

  const clearAllFilters = () => {
    router.push(`/consumer/dashboard`, { scroll: false });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = { ...currentFilters, search: e.target.value };
    applyFilters(newFilters);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFilters = { ...currentFilters, sort: e.target.value };
    applyFilters(newFilters);
  };

  if (!user) return null; // Prevent flash

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-orange-100 selection:text-orange-900 pb-20">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 px-4 sm:px-8 py-4">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-orange-100 p-3 rounded-2xl text-orange-600 shadow-sm hidden sm:block">
                <ShoppingCart size={28} />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Marketplace</h1>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs font-bold uppercase tracking-widest">
                    <MapPin size={12} className="text-orange-500" />
                    {user.pinCode}
                  </div>
                  <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                  <span className="text-xs font-black text-slate-900 uppercase tracking-widest">{user.name}</span>
                </div>
              </div>
            </div>
            {/* Mobile Filter Toggle */}
            <button 
              className="md:hidden p-2 text-slate-600 bg-slate-100 rounded-lg"
              onClick={() => setMobileFiltersOpen(true)}
            >
              <Filter size={20} />
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative w-full max-w-2xl mx-auto md:mx-0 group">
            {/* Animated glow ring */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-400 to-amber-400 rounded-2xl opacity-0 group-focus-within:opacity-100 blur transition-all duration-300" />
            <div className="relative flex items-center bg-white rounded-2xl shadow-sm border border-slate-200 group-focus-within:border-transparent transition-all duration-300 overflow-hidden">
              {/* Search icon */}
              <div className="flex items-center justify-center pl-4 pr-2 shrink-0">
                <Search 
                  size={20} 
                  className="text-slate-400 group-focus-within:text-orange-500 transition-colors duration-200" 
                />
              </div>
              {/* Input */}
              <input 
                type="text"
                id="marketplace-search"
                placeholder="Search crops, farmers, categories..."
                value={currentFilters.search}
                onChange={handleSearchChange}
                className="flex-1 bg-transparent py-3.5 pr-3 text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none text-sm"
              />
              {/* Clear button — only shows when there's text */}
              {currentFilters.search && (
                <button
                  onClick={() => applyFilters({ ...currentFilters, search: "" })}
                  className="flex items-center justify-center w-7 h-7 mr-2 rounded-full bg-slate-100 hover:bg-red-100 hover:text-red-500 text-slate-400 transition-all shrink-0"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
              {/* Search submit button */}
              <button className="m-1.5 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-200 shadow-md shadow-orange-500/20 active:scale-95 shrink-0">
                Search
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto justify-end">
            <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl text-white shadow-lg shadow-indigo-500/20">
              <div className="p-2 bg-white/20 rounded-xl">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-70 leading-none mb-1">{translations[lang].cd_digitalWallet}</p>
                <p className="text-sm font-black leading-none">₹{user.walletBalance || 0}</p>
              </div>
            </div>

            <button 
              onClick={() => setShowOrders(true)}
              className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-black text-[10px] uppercase tracking-widest hover:border-orange-500 hover:text-orange-500 transition-all shadow-sm active:scale-95"
            >
              <ShoppingBag size={18} className="text-orange-500" />
              {translations[lang].cd_myOrders}
            </button>

            <Link href="/cart" className="relative p-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-orange-50 hover:text-orange-600 transition-colors">
              <ShoppingBag size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">{totalItems}</span>
              )}
            </Link>

            {/* Language Toggle */}
            <div className="flex gap-1 bg-white border border-slate-200 rounded-lg p-1 text-xs font-bold shadow-sm">
              <button 
                onClick={() => { setLang('en'); localStorage.setItem('lang', 'en'); }} 
                className={`px-3 py-1.5 rounded-md transition-all ${lang === 'en' ? 'bg-orange-500 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                English
              </button>
              <button 
                onClick={() => { setLang('hi'); localStorage.setItem('lang', 'hi'); }} 
                className={`px-3 py-1.5 rounded-md transition-all ${lang === 'hi' ? 'bg-orange-500 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                हिंदी
              </button>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 sm:px-6 py-3 bg-red-50 text-red-600 hover:bg-red-100 font-bold rounded-2xl transition-all active:scale-95"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="p-4 sm:p-8 max-w-[1400px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Desktop Sidebar Filter */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-28">
              <FilterSidebar 
                initialFilters={currentFilters} 
                onFilterChange={applyFilters} 
              />
            </div>
          </aside>

          {/* Mobile Drawer Filter */}
          <FilterDrawer 
            isOpen={mobileFiltersOpen} 
            onClose={() => setMobileFiltersOpen(false)} 
            initialFilters={currentFilters}
            onFilterChange={(f) => {
              applyFilters(f);
              // Do not automatically close to allow multiple selections, user can close manually
            }}
          />

          {/* Main Product Area */}
          <div className="flex-1 min-w-0">
            
            {/* Top Bar (Chips & Sort) */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">{translations[lang].cd_products}</h2>
                <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mt-1">{translations[lang].cd_showingResults.replace('{totalProducts}', totalProducts.toString())}</p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <span className="text-sm font-bold text-slate-500 whitespace-nowrap">{translations[lang].cd_sortBy}</span>
                <select 
                  value={currentFilters.sort}
                  onChange={handleSortChange}
                  className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-slate-700 focus:outline-none focus:border-orange-500 cursor-pointer w-full sm:w-auto"
                >
                  <option value="newest">{translations[lang].cd_newest}</option>
                  <option value="price_asc">{translations[lang].cd_priceAsc}</option>
                  <option value="price_desc">{translations[lang].cd_priceDesc}</option>
                  <option value="popular">{translations[lang].cd_popular}</option>
                </select>
              </div>
            </div>

            {/* Active Filter Chips */}
            <FilterChips 
              filters={currentFilters} 
              onRemove={removeFilter} 
              onClearAll={clearAllFilters} 
            />

            {/* Products Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => <ProductSkeleton key={i} />)}
              </div>
            ) : crops.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-[2.5rem] border border-dashed border-slate-200 shadow-sm mt-8">
                <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search size={48} className="text-slate-300" />
                </div>
                <h4 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">{translations[lang].cd_noProducts}</h4>
                <p className="text-slate-500 font-medium max-w-md mx-auto">{translations[lang].cd_noProductsDesc}</p>
                <button 
                  onClick={clearAllFilters}
                  className="mt-8 px-8 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20"
                >
                  {translations[lang].cd_clearAllFilters}
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {crops.map((crop) => (
                    <ProductCard key={crop._id} crop={crop} addToCart={addToCart} />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalProducts > 12 && (
                  <div className="mt-12 flex items-center justify-center gap-4">
                    <button 
                      onClick={() => applyFilters({ ...currentFilters, page: currentFilters.page - 1 })}
                      disabled={currentFilters.page <= 1}
                      className="px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 disabled:opacity-50 transition-colors shadow-sm"
                    >
                      Previous
                    </button>
                    <span className="font-bold text-slate-500">Page {currentFilters.page}</span>
                    <button 
                      onClick={() => applyFilters({ ...currentFilters, page: currentFilters.page + 1 })}
                      disabled={currentFilters.page * 12 >= totalProducts}
                      className="px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 disabled:opacity-50 transition-colors shadow-sm"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}

          </div>
        </div>
      </main>

      {/* My Orders Modal */}
      {showOrders && (
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-slate-900/40 backdrop-blur-sm p-4 sm:p-8 flex items-center justify-center">
          <div className="bg-slate-50 w-full max-w-5xl rounded-[3rem] shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col border border-white animate-in zoom-in duration-300">
            {/* Modal Header */}
            <div className="bg-white px-8 py-6 border-b border-slate-200 flex justify-between items-center sticky top-0 z-10">
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                  <ShoppingBag className="text-orange-500" size={32} />
                  {translations[lang].cd_orderHistory}
                </h2>
                <p className="text-slate-500 font-bold">{translations[lang].cd_orderHistoryDesc}</p>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => user && fetchOrders(user._id)}
                  className="p-3 bg-slate-50 text-slate-400 hover:text-orange-500 hover:bg-orange-50 rounded-2xl transition-all"
                  title="Refresh Orders"
                >
                  <RefreshCw size={20} />
                </button>
                <button 
                  onClick={() => setShowOrders(false)}
                  className="p-3 bg-slate-900 text-white hover:bg-orange-600 rounded-2xl transition-all shadow-lg active:scale-95"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {orders.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-slate-200">
                  <ShoppingBag className="mx-auto text-slate-200 mb-6" size={80} />
                  <h3 className="text-2xl font-black text-slate-900 mb-2">{translations[lang].cd_noOrders}</h3>
                  <p className="text-slate-500 font-bold max-w-xs mx-auto">{translations[lang].cd_noOrdersDesc}</p>
                </div>
              ) : (
                orders.map((order) => (
                  <div key={order._id} className="p-8 rounded-[2.5rem] bg-white border border-slate-200 shadow-sm hover:border-orange-200 hover:shadow-xl transition-all group overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100 group-hover:bg-orange-500 transition-colors"></div>
                    
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="px-3 py-1 bg-slate-900 text-white rounded-lg text-[10px] font-black tracking-widest uppercase">
                            {translations[lang].cd_orderId}{order._id.slice(-8).toUpperCase()}
                          </span>
                          <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                            order.orderStatus === 'placed' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                            order.orderStatus === 'delivered' ? 'bg-green-50 text-green-600 border-green-100' :
                            order.orderStatus === 'cancelled' ? 'bg-red-50 text-red-600 border-red-100' :
                            'bg-slate-100 text-slate-600 border-slate-200'
                          }`}>
                            {order.orderStatus}
                          </span>
                          <span className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase flex items-center gap-1 ${
                            order.orderStatus === 'shipped' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'bg-slate-50 text-slate-500 border border-slate-200 opacity-70'
                          }`}>
                            Delivery OTP: <span className={`${order.orderStatus === 'shipped' ? 'text-indigo-900' : 'text-slate-700'} text-sm tracking-[0.2em]`}>{order.consumerOtp || "654321"}</span>
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400 text-xs font-bold">
                          <Clock size={14} />
                          {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      
                      <div className="text-left lg:text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Payment</p>
                        <p className="text-3xl font-black text-slate-900 tracking-tighter">₹{order.totalAmount}</p>
                        <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${order.paymentStatus === 'paid' ? 'text-amber-500' : 'text-green-600'}`}>
                          {order.paymentStatus === 'paid' ? '● Held in Escrow' : '● Released to Farmer'}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {order.items.map((item: any, idx: number) => (
                        <div key={idx} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 bg-slate-50 border border-slate-100 rounded-3xl gap-4">
                          <div className="flex items-center gap-5">
                            <div className="w-14 h-14 bg-white border border-slate-200 rounded-2xl flex items-center justify-center font-black text-orange-600 shadow-sm">
                              {item.quantity}kg
                            </div>
                            <div>
                              <p className="font-black text-slate-900 text-base">{item.cropName}</p>
                              <p className="text-xs font-bold text-slate-500">₹{item.pricePerKg}/kg • Subtotal: ₹{item.total}</p>
                            </div>
                          </div>
                          <div className="sm:text-right flex items-center gap-4 border-l-2 border-slate-200 pl-6 h-full">
                            <div>
                              <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">Farmer & Farm House</p>
                              <p className="text-sm font-black text-slate-900">{item.farmerId?.farmName || item.farmerId?.name || "Premium Farm"}</p>
                              <p className="text-[10px] font-bold text-slate-500">Contact: {item.farmerId?.mobileNumber || "N/A"}</p>
                            </div>
                            <UserIcon className="text-slate-200 hidden sm:block" size={24} />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 flex gap-4">
                      {order.orderStatus === 'placed' && (
                        <button 
                          onClick={async () => {
                            if (confirm("Are you sure you want to cancel this order and get a refund?")) {
                              try {
                                const res = await fetch(`/api/orders/${order._id}/refund`, { method: "POST" });
                                const data = await res.json();
                                if (res.ok) {
                                  toast.success("Refund processed successfully!");
                                  fetchOrders(user._id);
                                  refreshWallet(user._id);
                                } else {
                                  toast.error(data.error);
                                }
                              } catch (err) {
                                toast.error("Refund failed");
                              }
                            }
                          }}
                          className="flex-1 py-4 bg-red-50 text-red-600 hover:bg-red-100 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95"
                        >
                          Cancel & Refund
                        </button>
                      )}
                      <button 
                        onClick={() => handleRateFarmer(order)}
                        disabled={order.orderStatus !== 'delivered'}
                        className="flex-1 py-4 bg-slate-900 text-white hover:bg-orange-600 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        Rate Farmer
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {/* Modal Footer */}
            <div className="bg-white px-8 py-6 border-t border-slate-200 flex justify-between items-center">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Showing {orders.length} transactions</p>
              <button 
                onClick={() => setShowOrders(false)}
                className="px-8 py-3 bg-slate-100 text-slate-600 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-slate-200 transition-all"
              >
                Close History
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ConsumerDashboard() {
  return (
    <Suspense fallback={
      <div className="p-8 text-center flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full"></div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
