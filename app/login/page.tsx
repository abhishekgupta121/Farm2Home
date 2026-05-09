"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, LogIn, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    mobileNumber: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to login");
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      
      if (data.user.role === "farmer") {
        router.push("/farmer/dashboard");
      } else if (data.user.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/consumer/dashboard");
      }
    } catch (err: any) {
      setErrorMsg(err.message);
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
        <div className="absolute inset-0 bg-gradient-to-br from-green-50/90 via-white/80 to-orange-50/90 backdrop-blur-md"></div>
      </div>

      {/* Decorative Background Blobs */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-green-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float-reverse pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md bg-white/70 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/50 overflow-hidden">
        <div className="p-8 sm:p-10">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-green-600 mb-8 text-sm font-bold transition-colors">
            <ArrowLeft size={16} />
            Back to Home
          </Link>

          <div className="text-center mb-8">
            <div className="inline-flex bg-green-100 p-4 rounded-full text-green-600 mb-4 shadow-sm">
              <LogIn size={32} />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900">Welcome Back</h1>
            <p className="text-slate-500 mt-2 font-medium">Log in to your Farm2Home account</p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-bold text-center shadow-sm">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Mobile Number</label>
              <input
                type="text"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                maxLength={10}
                required
                className="w-full bg-white/60 text-slate-800 border border-white focus:bg-white rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-400 transition-all placeholder:text-slate-400 shadow-sm"
                placeholder="10 digits"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full bg-white/60 text-slate-800 border border-white focus:bg-white rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-400 transition-all placeholder:text-slate-400 shadow-sm"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group w-full mt-8 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 disabled:from-slate-400 disabled:to-slate-300 text-white font-bold py-4 rounded-2xl transition-all duration-300 shadow-lg shadow-green-500/30 hover:shadow-green-500/50 hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Logging in...
                </>
              ) : (
                "Log In"
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-500 font-medium">
            Don't have an account?{" "}
            <div className="mt-2 flex justify-center gap-4">
              <Link href="/signup/farmer" className="text-green-600 font-bold hover:underline">
                Farmer Signup
              </Link>
              <span className="text-slate-300">|</span>
              <Link href="/signup/consumer" className="text-orange-500 font-bold hover:underline">
                Consumer Signup
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}