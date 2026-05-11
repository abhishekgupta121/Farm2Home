"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, Image as ImageIcon, CheckCircle2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import FarmerNavbar from "@/app/components/FarmerNavbar";
import { useLanguage } from "@/lib/LanguageContext";

export default function FarmerHomePage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState<any>(null);

  const [formData, setFormData] = useState({
    cropName: "",
    category: "vegetable",
    subCategory: "",
    pricePerKg: "",
    availableQuantityKg: "",
    harvestDate: new Date().toISOString().split('T')[0],
    description: "",
    listingType: "standard",
    imageUrl: "",
    pinCode: ""
  });

  const SAMPLE_IMAGES = [
    { name: "Tomatoes", url: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=400" },
    { name: "Potatoes", url: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&q=80&w=400" },
    { name: "Wheat", url: "https://images.unsplash.com/photo-1501430654243-c934cec2e1c0?auto=format&fit=crop&q=80&w=400" },
    { name: "Pulses", url: "https://goqii.com/blog/wp-content/uploads/Why-Pulses-Are-Good-For-You-1024x683.jpg" },
    { name: "Moong Dal", url: "https://5.imimg.com/data5/SELLER/Default/2025/9/543231555/LO/GS/HR/45333637/30kg-moong-daal-1000x1000.jpeg" },
    { name: "Masoor Dal", url: "https://5.imimg.com/data5/SELLER/Default/2023/3/294545924/WG/XA/HG/40169047/malka-masoor-dal-1000x1000.jpg" },
    { name: "Toor Dal", url: "https://5.imimg.com/data5/SELLER/Default/2022/7/CH/AJ/EW/124695288/yellow-thur-dhall-500x500.png" },
  ];

  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (!userData) {
      router.push("/login");
    } else {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setFormData(prev => ({ ...prev, pinCode: parsedUser.pinCode || "" }));
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const setSampleImage = (url: string, name: string) => {
    setFormData(prev => {
      const updates: any = { imageUrl: url };
      if (name === "Tomatoes") {
        updates.category = "vegetable";
        updates.subCategory = "Tomato";
      } else if (name === "Potatoes") {
        updates.category = "vegetable";
        updates.subCategory = "Potato";
      } else if (name === "Moong Dal") {
        updates.category = "pulses";
        updates.subCategory = "Moong Dal";
      } else if (name === "Masoor Dal") {
        updates.category = "pulses";
        updates.subCategory = "Masoor Dal";
      } else if (name === "Toor Dal") {
        updates.category = "pulses";
        updates.subCategory = "Toor Dal";
      } else if (name === "Pulses") {
        updates.category = "pulses";
        updates.subCategory = "";
      } else if (name === "Wheat") {
        updates.category = "wheat";
        updates.subCategory = "";
      }
      return { ...prev, ...updates };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!formData.imageUrl) {
      setError("Image is mandatory! Please upload a real photo of your crop.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/crops", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          category: ["wheat", "rice"].includes(formData.category) ? "grain" : formData.category,
          cropName: formData.cropName || formData.subCategory || formData.category,
          farmerId: user._id,
          farmerName: user.name,
          farmName: user.farmName,
          farmerMobile: user.mobileNumber,
          pinCode: user.pinCode,
          location: typeof user.address === 'object' ? `${user.address.city}, ${user.address.state}` : user.address,
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
    <div className="min-h-screen bg-slate-50">
      <FarmerNavbar />
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <Link href="/farmer/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-green-600 transition-colors font-bold">
              <ArrowLeft size={20} />
              Back to Dashboard
            </Link>
          </div>

          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
              Upload Fresh Crops
            </h1>
            <p className="text-lg text-slate-600 font-medium">
              List your freshly harvested produce directly to consumers for the best market price.
            </p>
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-8 sm:p-12 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-50 rounded-full blur-3xl -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-50 rounded-full blur-3xl -ml-20 -mb-20"></div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-bold text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
              <div className="grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-2">


                {/* Image Upload */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                    Crop Image (Upload or Select Sample)
                  </label>

                  <div className="flex flex-col md:flex-row gap-6">
                    {/* File Upload Input */}
                    <div className="flex-1">
                      <label className="relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-300 rounded-[2rem] cursor-pointer bg-slate-50 hover:bg-slate-100 hover:border-green-400 transition-all group overflow-hidden">
                        {formData.imageUrl ? (
                          <div className="absolute inset-0">
                            <img src={formData.imageUrl} alt="Uploaded" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="text-white font-bold text-sm">Click to Change</span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <div className="bg-white p-3 rounded-2xl shadow-sm mb-3 group-hover:scale-110 transition-transform">
                              <ImageIcon className="text-green-600" size={24} />
                            </div>
                            <p className="mb-1 text-sm text-slate-600 font-bold">Click to Upload Photo</p>
                            <p className="text-xs text-slate-400">PNG, JPG or JPEG</p>
                          </div>
                        )}
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>

                    {/* Sample Selection */}
                    <div className="flex-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Quick Select Sample Photos</p>
                      <div className="grid grid-cols-2 gap-2">
                        {SAMPLE_IMAGES.map((img) => (
                          <button
                            key={img.url}
                            type="button"
                            onClick={() => setSampleImage(img.url, img.name)}
                            className={`flex items-center gap-2 p-2 rounded-xl text-[10px] font-bold transition-all border ${formData.imageUrl === img.url
                                ? "bg-green-600 text-white border-green-600 shadow-md"
                                : "bg-white text-slate-600 border-slate-100 hover:border-green-500 hover:text-green-600"
                              }`}
                          >
                            <div className="w-6 h-6 rounded-md bg-slate-100 overflow-hidden shrink-0">
                              <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                            </div>
                            {img.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="category" className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                    {t('category')}
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="block w-full rounded-2xl border-slate-200 px-5 py-4 text-slate-900 bg-slate-50 border focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all shadow-sm"
                    required
                  >
                    <option value="vegetable">{t('vegetables')}</option>
                    <option value="fruit">{t('fruits')}</option>
                    <option value="pulses">{t('pulses')}</option>
                    <option value="wheat">Wheat</option>
                    <option value="rice">Rice</option>
                  </select>
                </div>

                {/* Sub-category for Pulses */}
                {formData.category === "pulses" && (
                  <div>
                    <label htmlFor="subCategory" className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                      Sub-category
                    </label>
                    <select
                      id="subCategory"
                      name="subCategory"
                      value={formData.subCategory}
                      onChange={handleChange}
                      className="block w-full rounded-2xl border-slate-200 px-5 py-4 text-slate-900 bg-slate-50 border focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all shadow-sm"
                      required
                    >
                      <option value="">Select Pulse Type</option>
                      <option value="Moong Dal">Moong Dal</option>
                      <option value="Masoor Dal">Masoor Dal</option>
                      <option value="Toor Dal">Toor Dal (Arhar Dal)</option>
                    </select>
                  </div>
                )}

                {/* Sub-category for Vegetables */}
                {formData.category === "vegetable" && (
                  <div>
                    <label htmlFor="subCategory" className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                      Sub-category
                    </label>
                    <select
                      id="subCategory"
                      name="subCategory"
                      value={formData.subCategory}
                      onChange={handleChange}
                      className="block w-full rounded-2xl border-slate-200 px-5 py-4 text-slate-900 bg-slate-50 border focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all shadow-sm"
                      required
                    >
                      <option value="">Select Vegetable Type</option>
                      <option value="Potato">Potato</option>
                      <option value="Onion">Onion</option>
                      <option value="Garlic">Garlic</option>
                      <option value="Tomato">Tomato</option>
                    </select>
                  </div>
                )}

                {/* Sub-category for Fruits */}
                {formData.category === "fruit" && (
                  <div>
                    <label htmlFor="subCategory" className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                      Sub-category
                    </label>
                    <select
                      id="subCategory"
                      name="subCategory"
                      value={formData.subCategory}
                      onChange={handleChange}
                      className="block w-full rounded-2xl border-slate-200 px-5 py-4 text-slate-900 bg-slate-50 border focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all shadow-sm"
                      required
                    >
                      <option value="">Select Fruit Type</option>
                      <option value="Mango">Mango</option>
                      <option value="Apple">Apple</option>
                    </select>
                  </div>
                )}



                {/* Pincode */}
                <div>
                  <label htmlFor="pinCode" className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                    Pincode
                  </label>
                  <input
                    type="text"
                    id="pinCode"
                    name="pinCode"
                    value={formData.pinCode}
                    onChange={handleChange}
                    className="block w-full rounded-2xl border-slate-200 px-5 py-4 text-slate-900 bg-slate-50 border focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all shadow-sm"
                    placeholder="e.g. 462001"
                    pattern="[0-9]{6}"
                    title="Please provide a valid 6-digit PIN code"
                    required
                  />
                </div>

                {/* Price */}
                <div>
                  <label htmlFor="pricePerKg" className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                    Price (₹ per kg)
                  </label>
                  <div className="relative rounded-2xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                      <span className="text-slate-400 font-bold">₹</span>
                    </div>
                    <input
                      type="number"
                      id="pricePerKg"
                      name="pricePerKg"
                      value={formData.pricePerKg}
                      onChange={handleChange}
                      className="block w-full pl-10 rounded-2xl border-slate-200 px-5 py-4 text-slate-900 bg-slate-50 border focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all shadow-sm"
                      placeholder="0.00"
                      min="1"
                      required
                    />
                  </div>
                </div>

                {/* Quantity */}
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
                    className="block w-full rounded-2xl border-slate-200 px-5 py-4 text-slate-900 bg-slate-50 border focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all shadow-sm"
                    placeholder="e.g. 50"
                    min={["vegetable", "fruit"].includes(formData.category) ? 5 : 20}
                    required
                  />
                </div>

                {/* Harvest Date */}
                <div className="sm:col-span-2">
                  <label htmlFor="harvestDate" className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                    Harvest Date
                  </label>
                  <input
                    type="date"
                    id="harvestDate"
                    name="harvestDate"
                    value={formData.harvestDate}
                    onChange={handleChange}
                    className="block w-full rounded-2xl border-slate-200 px-5 py-4 text-slate-900 bg-slate-50 border focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all shadow-sm"
                    required
                  />
                </div>

                {/* Description */}
                <div className="sm:col-span-2">
                  <label htmlFor="description" className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    className="block w-full rounded-2xl border-slate-200 px-5 py-4 text-slate-900 bg-slate-50 border focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all shadow-sm"
                    placeholder="Tell buyers about your crop..."
                  ></textarea>
                </div>
              </div>

              {/* Farmer Product Listing Disclaimer */}
              <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 space-y-4 my-8 shadow-sm">
                <div className="flex items-center gap-2 text-amber-800 font-bold text-lg">
                  <span className="text-2xl">📢</span>
                  <h3>Farmer Product Listing Disclaimer</h3>
                </div>
                <p className="text-slate-700 text-sm">
                  By listing your product on the platform, you agree to the following terms:
                </p>
                <ul className="list-disc list-inside text-slate-600 text-sm space-y-2">
                  <li>The product delivered must <strong>exactly match</strong> the details and images uploaded by you at the time of listing.</li>
                  <li>The quality category selected must be accurate:
                    <ul className="ml-6 mt-1 list-none space-y-1 text-slate-500 text-xs">
                      <li>🔹 <strong>Standard</strong> – Good quality as per market standards</li>
                      <li>🔹 <strong>Ugly</strong> – Visually imperfect but usable produce</li>
                      <li>🔹 <strong>Pre-List</strong> – Product not yet harvested but expected</li>
                    </ul>
                  </li>
                </ul>
                <div className="bg-white rounded-2xl p-4 border border-amber-100">
                  <p className="text-slate-700 text-sm">
                    If an admin representative visits your location for verification and finds that:
                  </p>
                  <ul className="list-disc list-inside text-slate-600 text-sm ml-2 mt-1">
                    <li>The product does not match the uploaded images/details, or</li>
                    <li>The quality category is misrepresented</li>
                  </ul>
                  <p className="text-red-600 font-bold text-sm mt-2 flex items-center gap-1">
                    👉 You will be required to pay the admin visit charges.
                  </p>
                </div>
                <div className="bg-green-50 rounded-2xl p-4 border border-green-100 flex items-center gap-2">
                  <span className="text-green-600">✅</span>
                  <p className="text-green-800 text-sm font-medium">
                    If the product is found to be accurate and matches the listing: <strong>No visit charges will be applied (Free verification)</strong>
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting || isSuccess}
                  className="w-full flex justify-center items-center gap-3 py-5 px-8 border border-transparent rounded-2xl shadow-xl text-lg font-black text-white bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 focus:outline-none focus:ring-4 focus:ring-green-500/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-1 active:scale-95"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                      {t('uploading')}
                    </span>
                  ) : isSuccess ? (
                    <span className="flex items-center gap-2">
                      <CheckCircle2 size={24} /> {t('published')}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <UploadCloud size={24} /> {t('submitListing')}
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
