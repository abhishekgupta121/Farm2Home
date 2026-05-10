"use client";

import { useEffect, useState } from "react";
import { User, Star, ShieldAlert, Award, PackageCheck, TrendingUp, Leaf, Tractor, Camera } from "lucide-react";
import FarmerNavbar from "@/app/components/FarmerNavbar";

export default function FarmerProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      // Demo user if none exists
      const demoUser = { _id: "demo_farmer", name: "Raju Farmer", farmName: "Green Valley Farms", mobileNumber: "9876543210" };
      setUser(demoUser);
      fetchOrders(demoUser._id);
      fetchReviews(demoUser._id);
    } else {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      if (parsedUser.galleryImages) {
        setGalleryImages(parsedUser.galleryImages);
      }
      fetchOrders(parsedUser._id);
      fetchReviews(parsedUser._id);
    }
  }, []);

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        const updatedUser = { ...user, profileImage: base64 };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      };
      reader.readAsDataURL(file);
    }
  };

  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const [galleryImages, setGalleryImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=500&q=60"
  ]);

  const [harvest, setHarvest] = useState<number>(500); // Default 500kg
  const [experience, setExperience] = useState<number>(10); // Default 10 years
  const [reach, setReach] = useState<number>(120); // Default 120 families
  const [isEditingStats, setIsEditingStats] = useState<boolean>(false);

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        const updatedUser = { ...user, farmBanner: base64 };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        const updatedGallery = [...galleryImages];
        updatedGallery[index] = base64;
        setGalleryImages(updatedGallery);
        
        const updatedUser = { ...user, galleryImages: updatedGallery };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      };
      reader.readAsDataURL(file);
    }
  };

  const translations = {
    en: {
      title: "Quality & Trust Assurance",
      purityTitle: "Chemical-Free Promise",
      purityDesc: "Our crops are grown without any harmful chemicals. Purity is our identity.",
      sourceTitle: "Direct from Source",
      sourceDesc: "No middlemen involved. Packed directly from the farm to you.",
      gradingTitle: "Quality Graded",
      gradingDesc: "Every grain and vegetable is manually checked to ensure only the best quality reaches you.",
      verified: "Verified",
      farmerSince: "Farmer since 2010",
      quality: "100% Quality",
      rating: "Rating",
      organic: "Organic",
      pesticideFree: "Pesticide-Free",
      totalCropsSold: "Total Crops Sold",
      successfulOrders: "Successful Orders",
      totalReviews: "Total Reviews",
      farmGallery: "Farm Gallery",
      recentReviews: "Recent Reviews",
      noReviews: "No reviews yet.",
      change: "Change"
    },
    hi: {
      title: "गुणवत्ता और विश्वास का वादा",
      purityTitle: "केमिकल-मुक्त वादा",
      purityDesc: "हमारी फसलें बिना किसी हानिकारक रसायनों के उगाई जाती हैं। शुद्धता ही हमारी पहचान है।",
      sourceTitle: "सीधे स्रोत से",
      sourceDesc: "कोई बिचौलिया शामिल नहीं है। सीधे खेत से आपके पास पैक किया गया।",
      gradingTitle: "गुणवत्ता ग्रेडिंग",
      gradingDesc: "हर अनाज और सब्जी की मैन्युअल रूप से जांच की जाती है ताकि यह सुनिश्चित हो सके कि केवल सर्वोत्तम गुणवत्ता ही आप तक पहुंचे।",
      verified: "सत्यापित",
      farmerSince: "2010 से किसान",
      quality: "100% गुणवत्ता",
      rating: "रेटिंग",
      organic: "ऑर्गेनिक",
      pesticideFree: "कीटनाशक-मुक्त",
      totalCropsSold: "कुल बेची गई फसल",
      successfulOrders: "सफल ऑर्डर्स",
      totalReviews: "कुल समीक्षाएं",
      farmGallery: "फार्म गैलरी",
      recentReviews: "हालिया समीक्षाएं",
      noReviews: "अभी तक कोई समीक्षा नहीं।",
      change: "बदलें"
    }
  };

  if (!user) return <div className="p-8 text-center flex items-center justify-center min-h-screen"><div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full"></div></div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <FarmerNavbar />
      <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Global Language Toggle */}
        <div className="flex justify-end">
          <div className="flex gap-1 bg-white border border-slate-200 rounded-lg p-1 text-xs font-bold shadow-sm">
            <button 
              onClick={() => setLang('en')} 
              className={`px-3 py-1.5 rounded-md transition-all ${lang === 'en' ? 'bg-green-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              English
            </button>
            <button 
              onClick={() => setLang('hi')} 
              className={`px-3 py-1.5 rounded-md transition-all ${lang === 'hi' ? 'bg-green-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              हिंदी
            </button>
          </div>
        </div>
        
        {/* Profile Header */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
          {/* Banner */}
          <div className="h-48 bg-slate-200 relative group">
            <img 
              src={user.farmBanner || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80"} 
              alt="Farm Banner" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            
            <label htmlFor="banner-upload" className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-sm text-slate-700 text-xs font-bold rounded-lg cursor-pointer shadow-sm border border-slate-200 hover:bg-white transition-all">
              <Camera size={14} className="text-green-600" /> {lang === 'en' ? 'Change Banner' : 'बैनर बदलें'}
            </label>
            <input 
              id="banner-upload" 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleBannerUpload}
            />
          </div>
          
          <div className="p-8 flex flex-col md:flex-row items-center md:items-start gap-6 relative">
            {/* Profile Picture */}
            <div className="relative group -mt-16 z-10">
              <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0 border-4 border-white shadow-lg overflow-hidden">
                {user.profileImage ? (
                  <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User size={48} />
                )}
              </div>
              {/* Permanent Camera Icon */}
              <label htmlFor="profile-upload" className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-md border border-slate-200 text-slate-600 hover:text-green-600 cursor-pointer transition-colors z-20">
                <Camera size={14} />
              </label>
              <label htmlFor="profile-upload" className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer z-10">
                <span className="text-xs font-bold">{translations[lang].change}</span>
              </label>
              <input 
                id="profile-upload" 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageUpload}
              />
            </div>
            
            <div className="text-center md:text-left flex-1">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-extrabold text-slate-900">{user.name}</h1>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500 text-white text-xs font-bold">
                      <Award size={12} /> {translations[lang].verified}
                    </span>
                  </div>
                  <p className="text-lg text-slate-600 font-medium mb-2">{user.farmName}</p>
                </div>
                
                <div className="flex gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-sm font-bold border border-green-100">
                    <Award size={16} /> {translations[lang].farmerSince}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-sm font-bold border border-emerald-100">
                    <Leaf size={16} /> {translations[lang].quality}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-50 text-yellow-700 text-sm font-bold border border-yellow-100">
                  <Star size={16} fill="currentColor" /> {reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : "N/A"} / 5.0 {translations[lang].rating}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-sm font-bold border border-slate-200">
                  # {translations[lang].organic}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-sm font-bold border border-slate-200">
                  # {translations[lang].pesticideFree}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Farmer Growth Dashboard */}
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 m-0">
              <TrendingUp className="text-green-600" size={24} />
              {lang === 'en' ? 'Farmer Growth Dashboard' : 'किसान विकास डैशबोर्ड'}
            </h2>
            <button 
              onClick={() => setIsEditingStats(!isEditingStats)}
              className="px-4 py-2 bg-green-600 text-white text-sm font-bold rounded-lg hover:bg-green-700 transition-colors shadow-sm"
            >
              {isEditingStats ? (lang === 'en' ? 'Save Stats' : 'सेव करें') : (lang === 'en' ? 'Update Stats' : 'अपडेट करें')}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Card 1: Harvest */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <p className="text-slate-500 font-semibold mb-1">
                {isEditingStats ? (lang === 'en' ? 'Apni fasal ki matra bharein (kg)' : 'अपनी फसल की मात्रा भरें (kg)') : (lang === 'en' ? 'Total Yield Available' : 'कुल उपलब्ध उपज')}
              </p>
              {isEditingStats ? (
                <div className="flex items-center gap-2 mt-2">
                  <button onClick={() => setHarvest(Math.max(0, harvest - 50))} className="w-10 h-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center font-bold text-slate-600 hover:bg-slate-50">-</button>
                  <input type="number" value={harvest} onChange={(e) => setHarvest(Number(e.target.value))} className="w-full text-center text-xl font-bold text-slate-900 bg-white border border-slate-200 rounded-lg py-1.5 focus:border-green-500 focus:outline-none" />
                  <button onClick={() => setHarvest(harvest + 50)} className="w-10 h-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center font-bold text-slate-600 hover:bg-slate-50">+</button>
                </div>
              ) : (
                <div>
                  <h3 className="text-3xl font-black text-slate-900">{harvest} <span className="text-base font-medium text-slate-500">kg</span></h3>
                  <div className="w-full bg-slate-200 h-2 rounded-full mt-2 overflow-hidden">
                    <div className="bg-green-500 h-full" style={{ width: `${Math.min(100, (harvest / 1000) * 100)}%` }}></div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Card 2: Legacy */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <p className="text-slate-500 font-semibold mb-1">
                {isEditingStats ? (lang === 'en' ? 'Kitne saalo se kheti kar rahe hain?' : 'कितने सालों से खेती कर रहे हैं?') : (lang === 'en' ? 'Farming Legacy' : 'खेती की विरासत')}
              </p>
              {isEditingStats ? (
                <div className="mt-2">
                  <input type="number" value={experience} onChange={(e) => setExperience(Number(e.target.value))} className="w-full text-center text-xl font-bold text-slate-900 bg-white border border-slate-200 rounded-lg py-1.5 focus:border-green-500 focus:outline-none" />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h3 className="text-3xl font-black text-slate-900">{experience} <span className="text-base font-medium text-slate-500">Years</span></h3>
                  <Award className="text-yellow-500" size={24} fill="currentColor" />
                </div>
              )}
            </div>

            {/* Card 3: Trust */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <p className="text-slate-500 font-semibold mb-1">
                {isEditingStats ? (lang === 'en' ? 'Kitne logo tak maal pahuncha hai?' : 'कितने लोगों तक माल पहुंचा है?') : (lang === 'en' ? 'Happy Families' : 'खुशहाल परिवार')}
              </p>
              {isEditingStats ? (
                <div className="mt-2">
                  <input type="number" value={reach} onChange={(e) => setReach(Number(e.target.value))} className="w-full text-center text-xl font-bold text-slate-900 bg-white border border-slate-200 rounded-lg py-1.5 focus:border-green-500 focus:outline-none" />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h3 className="text-3xl font-black text-slate-900">{reach}+</h3>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Farm Gallery */}
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Tractor className="text-green-600" size={24} />
            {translations[lang].farmGallery}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryImages.map((img, index) => (
              <div key={index} className="h-32 bg-slate-100 rounded-2xl overflow-hidden relative group">
                <img src={img} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                
                {/* Permanent Camera Icon */}
                <label htmlFor={`gallery-upload-${index}`} className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm p-1.5 rounded-full shadow-sm border border-slate-200 text-slate-600 hover:text-green-600 cursor-pointer transition-colors z-20">
                  <Camera size={12} />
                </label>
                
                <label htmlFor={`gallery-upload-${index}`} className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10">
                  <span className="text-xs font-bold">{translations[lang].change}</span>
                </label>
                <input 
                  id={`gallery-upload-${index}`} 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={(e) => handleGalleryUpload(index, e)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Reviews Section */}
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Star className="text-yellow-500" fill="currentColor" size={24} />
              {translations[lang].recentReviews}
            </h2>
            <div className="space-y-6">
              {reviews.length > 0 ? (
                reviews.slice(0, 3).map((review: any) => (
                  <div key={review._id} className="border-b border-slate-100 last:border-0 pb-6 last:pb-0">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-slate-800">{review.consumerId?.name || "Anonymous"}</span>
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, j) => (
                          <Star key={j} size={14} fill={j < review.rating ? "currentColor" : "none"} className={j >= review.rating ? "text-slate-200" : ""} />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-600 text-sm">{review.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 font-medium text-center py-4">{translations[lang].noReviews}</p>
              )}
            </div>
          </div>

          {/* Farmer Assurance Section */}
          <div className="bg-emerald-50/50 rounded-[2rem] p-8 shadow-sm border border-emerald-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-emerald-900 flex items-center gap-2 m-0">
                <Leaf className="text-emerald-500" size={24} />
                {translations[lang].title}
              </h2>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-4 border border-emerald-100 space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="text-emerald-500" size={18} />
                  <h4 className="font-bold text-emerald-900 m-0">{translations[lang].purityTitle}</h4>
                </div>
                <p className="m-0 text-sm text-slate-600">
                  {translations[lang].purityDesc}
                </p>
              </div>

              <div className="bg-white rounded-xl p-4 border border-emerald-100 space-y-2">
                <div className="flex items-center gap-2">
                  <Tractor className="text-emerald-500" size={18} />
                  <h4 className="font-bold text-emerald-900 m-0">{translations[lang].sourceTitle}</h4>
                </div>
                <p className="m-0 text-sm text-slate-600">
                  {translations[lang].sourceDesc}
                </p>
              </div>

              <div className="bg-white rounded-xl p-4 border border-emerald-100 space-y-2">
                <div className="flex items-center gap-2">
                  <PackageCheck className="text-emerald-500" size={18} />
                  <h4 className="font-bold text-emerald-900 m-0">{translations[lang].gradingTitle}</h4>
                </div>
                <p className="m-0 text-sm text-slate-600">
                  {translations[lang].gradingDesc}
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
