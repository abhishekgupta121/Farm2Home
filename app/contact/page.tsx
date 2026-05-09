"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export default function ContactPage() {
    const { t } = useLanguage();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        fullName: "",
        phoneNumber: "",
        message: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(false);

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Something went wrong");
            }

            setSuccess(true);
            setFormData({ fullName: "", phoneNumber: "", message: "" });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
            {/* Dynamic Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/farm_background.png"
                    alt="Background"
                    fill
                    className="object-cover opacity-15"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-green-50/90 via-white/80 to-orange-50/90 backdrop-blur-md"></div>
            </div>

            {/* Decorative Background Blobs */}
            <div className="absolute top-10 left-10 w-96 h-96 bg-green-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float pointer-events-none"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float-reverse pointer-events-none"></div>

            <div className="relative z-10 max-w-5xl mx-auto">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-green-700 mb-8"
                >
                    <ArrowLeft size={16} />
                    {t("backToHome")}
                </Link>

                <div className="text-center mb-16">
                    <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl mb-4">
                        {t("getInTouch")}
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        {t("contactSubtitle")}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white/70 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-white/50">

                    {/* Contact Info */}
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">{t("contactInfo")}</h2>

                        <div className="space-y-4 mt-8">
                            <div className="group flex items-start gap-5 p-5 rounded-2xl bg-white/40 hover:bg-white/80 transition-all duration-300 border border-white/60 hover:border-green-200 hover:shadow-lg hover:-translate-y-1">
                                <div className="bg-green-100/80 text-green-700 p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300 group-hover:bg-gradient-to-br group-hover:from-green-500 group-hover:to-green-600 group-hover:text-white shadow-sm">
                                    <Phone size={26} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 text-lg">{t("phoneSupport")}</h3>
                                    <p className="text-slate-500 mt-1 text-sm">{t("phoneHours")}</p>
                                    <p className="text-green-700 font-bold mt-2 tracking-wide">+91 9424766159</p>
                                </div>
                            </div>

                            <div className="group flex items-start gap-5 p-5 rounded-2xl bg-white/40 hover:bg-white/80 transition-all duration-300 border border-white/60 hover:border-green-200 hover:shadow-lg hover:-translate-y-1">
                                <div className="bg-green-100/80 text-green-700 p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300 group-hover:bg-gradient-to-br group-hover:from-green-500 group-hover:to-green-600 group-hover:text-white shadow-sm">
                                    <Mail size={26} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 text-lg">{t("emailUs")}</h3>
                                    <p className="text-slate-500 mt-1 text-sm">{t("emailResponseTime")}</p>
                                    <p className="text-green-700 font-bold mt-2 tracking-wide">support@farm2home.in</p>
                                </div>
                            </div>

                            <div className="group flex items-start gap-5 p-5 rounded-2xl bg-white/40 hover:bg-white/80 transition-all duration-300 border border-white/60 hover:border-green-200 hover:shadow-lg hover:-translate-y-1">
                                <div className="bg-green-100/80 text-green-700 p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300 group-hover:bg-gradient-to-br group-hover:from-green-500 group-hover:to-green-600 group-hover:text-white shadow-sm">
                                    <MapPin size={26} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 text-lg">{t("headOffice")}</h3>
                                    <p className="text-slate-500 mt-1 text-sm leading-relaxed">
                                        {t("officeAddress1")}<br />
                                        {t("officeAddress2")}<br />
                                        {t("officeCountry")}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div>
                        {success ? (
                            <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-green-50/50 rounded-3xl border border-green-100">
                                <div className="bg-green-100 text-green-600 p-4 rounded-full mb-4">
                                    <CheckCircle size={48} />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-2">{t("messageSent")}</h2>
                                <p className="text-slate-600 mb-8">{t("messageSuccess")}</p>
                                <button 
                                    onClick={() => setSuccess(false)}
                                    className="text-green-700 font-bold hover:underline"
                                >
                                    {t("sendAnother")}
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {error && (
                                    <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-medium">
                                        {error}
                                    </div>
                                )}
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">{t("fullName")}</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        required
                                        placeholder="Rahul Kumar"
                                        className="w-full bg-white/60 text-slate-800 border border-white focus:bg-white rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-400 transition-all placeholder:text-slate-400 shadow-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">{t("phoneNumber")}</label>
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        required
                                        placeholder="+91 98765 43210"
                                        className="w-full bg-white/60 text-slate-800 border border-white focus:bg-white rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-400 transition-all placeholder:text-slate-400 shadow-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">{t("message")}</label>
                                    <textarea
                                        rows={4}
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        placeholder={t("messagePlaceholder")}
                                        className="w-full bg-white/60 text-slate-800 border border-white focus:bg-white rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-400 transition-all placeholder:text-slate-400 shadow-sm resize-none"
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="group w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 disabled:from-slate-400 disabled:to-slate-300 text-white font-bold py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-green-500/30 hover:shadow-green-500/50 hover:-translate-y-1"
                                >
                                    {loading ? (
                                        <Loader2 size={20} className="animate-spin" />
                                    ) : (
                                        <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    )}
                                    <span>{loading ? t("sending") : t("sendMessage")}</span>
                                </button>
                            </form>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
