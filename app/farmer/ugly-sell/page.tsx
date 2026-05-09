"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, Image as ImageIcon, CheckCircle2, AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import FarmerNavbar from "@/app/components/FarmerNavbar";

export default function UglySellPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState<any>(null);

  const [formData, setFormData] = useState({
    cropName: "",
    category: "vegetable",
    pricePerKg: "",
    availableQuantityKg: "",
    harvestDate: new Date().toISOString().split('T')[0],
    description: "Slightly imperfect but perfectly edible produce.",
    listingType: "ugly-sell",
    imageUrl: ""
  });

  const SAMPLE_IMAGES = [
    { name: "Bruised Apples", url: "https://images.unsplash.com/photo-1576673442511-7e39b7ca8944?auto=format&fit=crop&q=80&w=400" },
    { name: "Imperfect Veggies", url: "https://images.unsplash.com/photo-1566385101042-1a000c1268c4?auto=format&fit=crop&q=80&w=400" },
    { name: "Overripe Bananas", url: "https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&q=80&w=400" },
    { name: "Odd Carrots", url: "https://images.unsplash.com/photo-1590865107675-40c4dee6388e?auto=format&fit=crop&q=80&w=400" },
  ];

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
    } else {
      setUser(JSON.parse(userData));
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const setSampleImage = (url: string) => {
    setFormData(prev => ({ ...prev, imageUrl: url }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/crops", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          farmerId: user._id,
          farmerName: user.name,
          farmName: user.farmName,
          farmerMobile: user.mobileNumber,
          pinCode: user.pinCode,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to upload crop");

      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/farmer/dashboard");
      }, 1500);
    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-orange-50/30">
      <FarmerNavbar />
      <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link href="/farmer/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-orange-600 transition-colors font-bold">
            <ArrowLeft size={20} />
            Back to Dashboard
          </Link>
        </div>

        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-700 font-bold text-sm mb-4">
            <AlertTriangle size={16} />
            Zero Waste Initiative
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Ugly Sell
          </h1>
          <p className="text-lg text-slate-600 font-medium">
            List your lower-quality, imperfect, or leftover crops at a discounted price to reduce food waste.
          </p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-orange-100 p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-50 rounded-full blur-3xl -ml-20 -mb-20"></div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-bold text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
            <div className="grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="cropName" className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                  Crop Name
                </label>
                <input
                  type="text"
                  id="cropName"
                  name="cropName"
                  value={formData.cropName}
                  onChange={handleChange}
                  className="block w-full rounded-2xl border-orange-100 px-5 py-4 text-slate-900 bg-slate-50 border focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all shadow-sm"
                  placeholder="e.g. Slightly Bruised Organic Apples"
                  required
                />
              </div>

              {/* Image URL */}
              <div className="sm:col-span-2">
                <label htmlFor="imageUrl" className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                  Crop Image URL
                </label>
                <input
                  type="url"
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className="block w-full rounded-2xl border-orange-100 px-5 py-4 text-slate-900 bg-slate-50 border focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all shadow-sm placeholder:text-slate-400"
                  placeholder="https://example.com/crop-image.jpg"
                />
                
                {/* Quick Select Images */}
                <div className="mt-4">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">Quick Select Sample Images</p>
                  <div className="flex flex-wrap gap-3">
                    {SAMPLE_IMAGES.map((img) => (
                      <button
                        key={img.url}
                        type="button"
                        onClick={() => setSampleImage(img.url)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                          formData.imageUrl === img.url 
                          ? "bg-orange-600 text-white border-orange-600 shadow-lg shadow-orange-500/20" 
                          : "bg-white text-slate-600 border-slate-200 hover:border-orange-500 hover:text-orange-600"
                        }`}
                      >
                        <div className="w-6 h-6 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                          <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                        </div>
                        {img.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preview */}
                {formData.imageUrl && (
                  <div className="mt-4 rounded-2xl overflow-hidden border border-orange-100 h-40 relative group">
                    <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="block w-full rounded-2xl border-orange-100 px-5 py-4 text-slate-900 bg-slate-50 border focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all shadow-sm"
                  required
                >
                  <option value="vegetable">Vegetable</option>
                  <option value="fruit">Fruit</option>
                  <option value="grain">Grain</option>
                  <option value="spice">Spice</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="pricePerKg" className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                  Discounted Price (₹/kg)
                </label>
                <input
                  type="number"
                  id="pricePerKg"
                  name="pricePerKg"
                  value={formData.pricePerKg}
                  onChange={handleChange}
                  className="block w-full rounded-2xl border-orange-100 px-5 py-4 text-slate-900 bg-slate-50 border focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all shadow-sm"
                  placeholder="0.00"
                  min="1"
                  required
                />
              </div>

              <div>
                <label htmlFor="availableQuantityKg" className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                  Quantity (kg)
                </label>
                <input
                  type="number"
                  id="availableQuantityKg"
                  name="availableQuantityKg"
                  value={formData.availableQuantityKg}
                  onChange={handleChange}
                  className="block w-full rounded-2xl border-orange-100 px-5 py-4 text-slate-900 bg-slate-50 border focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all shadow-sm"
                  placeholder="e.g. 25"
                  min="1"
                  required
                />
              </div>

              <div>
                <label htmlFor="harvestDate" className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                  Harvest Date
                </label>
                <input
                  type="date"
                  id="harvestDate"
                  name="harvestDate"
                  value={formData.harvestDate}
                  onChange={handleChange}
                  className="block w-full rounded-2xl border-orange-100 px-5 py-4 text-slate-900 bg-slate-50 border focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all shadow-sm"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="description" className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                  Reason for Discount / Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  className="block w-full rounded-2xl border-orange-100 px-5 py-4 text-slate-900 bg-slate-50 border focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all shadow-sm"
                  placeholder="Why is this produce discounted? (e.g. slight bruising, overstock...)"
                ></textarea>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting || isSuccess}
                className="w-full flex justify-center items-center gap-3 py-5 px-8 border border-transparent rounded-2xl shadow-xl text-lg font-black text-white bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-500/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-1 active:scale-95 shadow-orange-500/30"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Publishing...
                  </span>
                ) : isSuccess ? (
                  <span className="flex items-center gap-2">
                    <CheckCircle2 size={24} /> Ugly Sell Published!
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <UploadCloud size={24} /> Publish Discounted Listing
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      </div>
    </div>
  );
}
