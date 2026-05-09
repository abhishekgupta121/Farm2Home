"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Tractor, CheckCircle, Loader2 } from "lucide-react";

export default function FarmerSignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    farmName: "",
    address: {
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
    },
    pinCode: "",
    mobileNumber: "",
    aadhaarNumber: "",
    password: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [otp, setOtp] = useState("");

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.address.addressLine1.trim()) newErrors.addressLine1 = "Address Line 1 is required";
    if (!formData.address.city.trim()) newErrors.city = "City is required";
    if (!formData.address.state.trim()) newErrors.state = "State is required";
    
    if (!/^\d{6}$/.test(formData.pinCode)) {
      newErrors.pinCode = "PIN code must be exactly 6 digits";
    }
    
    if (!/^\d{10}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = "Mobile number must be exactly 10 digits";
    }
    
    if (!/^\d{12}$/.test(formData.aadhaarNumber)) {
      newErrors.aadhaarNumber = "Aadhaar number must be exactly 12 digits";
    }

    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setStep(2);
    }
  };

  const handleVerifyAndSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (otp !== "123456") {
      setErrorMsg("Invalid OTP. Please use 123456 for testing.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          role: "farmer",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to register");
      }

      // Save user to local storage
      localStorage.setItem("user", JSON.stringify(data.user));
      
      // Redirect to dashboard
      router.push("/farmer/dashboard");
    } catch (err: any) {
      setErrorMsg(err.message);
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ 
      ...formData, 
      address: { ...formData.address, [e.target.name]: e.target.value } 
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 sm:p-8 bg-slate-50 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/farm_background.png"
          alt="Farm Background"
          fill
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-green-50/90 to-emerald-100/80 backdrop-blur-sm"></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
        <div className="bg-green-600 p-6 sm:p-8 text-white flex items-center justify-between">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-green-100 hover:text-white mb-4 text-sm font-medium transition-colors">
              <ArrowLeft size={16} />
              Back to Home
            </Link>
            <h1 className="text-3xl font-extrabold">Farmer Registration</h1>
            <p className="text-green-100 mt-2">Join Farm2Home and connect directly with consumers.</p>
          </div>
          <div className="hidden sm:flex bg-white/20 p-4 rounded-full backdrop-blur-md">
            <Tractor size={48} className="text-white" />
          </div>
        </div>

        <div className="p-6 sm:p-8">
          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">
              {errorMsg}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleSendOtp} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1 ml-1">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full bg-white text-slate-800 border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${errors.name ? 'border-red-500' : 'border-slate-200'}`}
                    placeholder="e.g., Rajesh Kumar"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1 ml-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1 ml-1">Farm Name (Optional)</label>
                  <input
                    type="text"
                    name="farmName"
                    value={formData.farmName}
                    onChange={handleChange}
                    className="w-full bg-white text-slate-800 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                    placeholder="e.g., Green Valley Farms"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-1 ml-1">Address Line 1 *</label>
                  <input
                    type="text"
                    name="addressLine1"
                    value={formData.address.addressLine1}
                    onChange={handleAddressChange}
                    className={`w-full bg-white text-slate-800 border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${errors.addressLine1 ? 'border-red-500' : 'border-slate-200'}`}
                    placeholder="House No, Building, Street Area"
                  />
                  {errors.addressLine1 && <p className="text-red-500 text-xs mt-1 ml-1">{errors.addressLine1}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-1 ml-1">Address Line 2 (Optional)</label>
                  <input
                    type="text"
                    name="addressLine2"
                    value={formData.address.addressLine2}
                    onChange={handleAddressChange}
                    className={`w-full bg-white text-slate-800 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all`}
                    placeholder="Landmark, Sector, Locality"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1 ml-1">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.address.city}
                    onChange={handleAddressChange}
                    className={`w-full bg-white text-slate-800 border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${errors.city ? 'border-red-500' : 'border-slate-200'}`}
                    placeholder="City / Village"
                  />
                  {errors.city && <p className="text-red-500 text-xs mt-1 ml-1">{errors.city}</p>}
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1 ml-1">State *</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.address.state}
                    onChange={handleAddressChange}
                    className={`w-full bg-white text-slate-800 border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${errors.state ? 'border-red-500' : 'border-slate-200'}`}
                    placeholder="State"
                  />
                  {errors.state && <p className="text-red-500 text-xs mt-1 ml-1">{errors.state}</p>}
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1 ml-1">PIN Code *</label>
                  <input
                    type="text"
                    name="pinCode"
                    value={formData.pinCode}
                    onChange={handleChange}
                    maxLength={6}
                    className={`w-full bg-white text-slate-800 border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${errors.pinCode ? 'border-red-500' : 'border-slate-200'}`}
                    placeholder="6 digits"
                  />
                  {errors.pinCode && <p className="text-red-500 text-xs mt-1 ml-1">{errors.pinCode}</p>}
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1 ml-1">Mobile Number *</label>
                  <input
                    type="text"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    maxLength={10}
                    className={`w-full bg-white text-slate-800 border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${errors.mobileNumber ? 'border-red-500' : 'border-slate-200'}`}
                    placeholder="10 digits"
                  />
                  {errors.mobileNumber && <p className="text-red-500 text-xs mt-1 ml-1">{errors.mobileNumber}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-1 ml-1">Aadhaar Number *</label>
                  <input
                    type="text"
                    name="aadhaarNumber"
                    value={formData.aadhaarNumber}
                    onChange={handleChange}
                    maxLength={12}
                    className={`w-full bg-white text-slate-800 border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${errors.aadhaarNumber ? 'border-red-500' : 'border-slate-200'}`}
                    placeholder="12 digit Aadhaar Number"
                  />
                  {errors.aadhaarNumber && <p className="text-red-500 text-xs mt-1 ml-1">{errors.aadhaarNumber}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-1 ml-1">Password *</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full bg-white text-slate-800 border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${errors.password ? 'border-red-500' : 'border-slate-200'}`}
                    placeholder="Minimum 6 characters"
                  />
                  {errors.password && <p className="text-red-500 text-xs mt-1 ml-1">{errors.password}</p>}
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                Continue to Verify Mobile <ArrowLeft size={18} className="rotate-180" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyAndSubmit} className="space-y-6 py-4">
              <div className="text-center mb-8">
                <div className="inline-flex bg-green-100 p-4 rounded-full text-green-600 mb-4">
                  <CheckCircle size={32} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800">Verify Mobile Number</h3>
                <p className="text-slate-500 mt-2">
                  We've sent an OTP to <span className="font-bold text-slate-800">+91 {formData.mobileNumber}</span>
                </p>
                <p className="text-xs text-green-600 mt-1 font-medium bg-green-50 inline-block px-3 py-1 rounded-full">(Mock OTP is 123456)</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 text-center">Enter 6-digit OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  className="w-full text-center tracking-[0.5em] text-2xl font-bold bg-slate-50 text-slate-800 border border-slate-200 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  placeholder="------"
                  required
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-4 rounded-xl transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-2/3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-md flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify & Register"
                  )}
                </button>
              </div>
            </form>
          )}

          <div className="mt-8 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="text-green-600 font-bold hover:underline">
              Log in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
