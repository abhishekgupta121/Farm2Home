"use client";

import React from 'react';
import { 
  Users, 
  Sprout, 
  ShoppingBag, 
  ShieldCheck, 
  Truck, 
  TrendingUp, 
  MessageSquare, 
  Languages 
} from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
  <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
    <div className="w-12 h-12 bg-green-100 text-green-700 rounded-lg flex items-center justify-center mb-4">
      <Icon size={24} />
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
    <p className="text-slate-600 leading-relaxed">{description}</p>
  </div>
);

export default function FeaturesPage() {
  const { t, language, setLanguage } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-green-700"
        >
          <ArrowLeft size={16} />
          {t("backToHome")}
        </Link>
      </div>

      {/* Header */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl mb-4">
          {t("featuresPageTitle")}
        </h1>
        <p className="text-lg text-slate-600">
          {t("featuresPageSubtitle")}
        </p>
      </div>

      {/* Main Feature Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Auth & Identity */}
        <FeatureCard 
          icon={Users}
          title={t("smartOnboarding")}
          description={t("smartOnboardingDesc")}
        />

        {/* Farmer Specific */}
        <FeatureCard 
          icon={Sprout}
          title={t("farmerListings")}
          description={t("farmerListingsDesc")}
        />

        {/* Consumer Specific */}
        <FeatureCard 
          icon={ShoppingBag}
          title={t("proximityBuying")}
          description={t("proximityBuyingDesc")}
        />

        {/* Logistics & Payment */}
        <FeatureCard 
          icon={Truck}
          title={t("secureFulfillment")}
          description={t("secureFulfillmentDesc")}
        />

        {/* Market Intel */}
        <FeatureCard 
          icon={TrendingUp}
          title={t("realTimeAnalytics")}
          description={t("realTimeAnalyticsDesc")}
        />

        {/* Communication */}
        <FeatureCard 
          icon={MessageSquare}
          title={t("directComm")}
          description={t("directCommDesc")}
        />
      </div>

      {/* Special Sections */}
      <div className="max-w-7xl mx-auto mt-20">
        <div className="bg-green-700 rounded-3xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-2/3 mb-8 md:mb-0">
            <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
              <ShieldCheck /> {t("trustGuarantee")}
            </h2>
            <ul className="space-y-3 opacity-90">
              <li>• {t("trustGuarantee1")}</li>
              <li>• {t("trustGuarantee2")}</li>
              <li>• {t("trustGuarantee3")}</li>
            </ul>
          </div>
          <button className="bg-white text-green-700 px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-100 transition-colors">
            {t("joinMovement")}
          </button>
        </div>
      </div>

      {/* Language Switcher Overlay */}
      <div className="fixed bottom-6 right-6 z-50">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as "en" | "hi")}
          className="bg-white shadow-xl border border-slate-200 px-4 py-2 rounded-full flex items-center gap-2 font-medium hover:bg-slate-50 transition-all focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="en">English</option>
          <option value="hi">हिंदी</option>
        </select>
      </div>
    </div>
  );
}