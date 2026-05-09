"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, ArrowLeft, ArrowUpRight, ArrowDownRight } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

const MOCK_DATA: Record<string, { month: string; price: number }[]> = {
  wheat: [
    { month: "Jan", price: 2150 }, { month: "Feb", price: 2120 }, { month: "Mar", price: 2080 },
    { month: "Apr", price: 2100 }, { month: "May", price: 2200 }, { month: "Jun", price: 2250 },
    { month: "Jul", price: 2300 }, { month: "Aug", price: 2280 }, { month: "Sep", price: 2350 },
    { month: "Oct", price: 2400 }, { month: "Nov", price: 2380 }, { month: "Dec", price: 2450 },
  ],
  rice: [
    { month: "Jan", price: 3200 }, { month: "Feb", price: 3250 }, { month: "Mar", price: 3300 },
    { month: "Apr", price: 3280 }, { month: "May", price: 3350 }, { month: "Jun", price: 3400 },
    { month: "Jul", price: 3500 }, { month: "Aug", price: 3450 }, { month: "Sep", price: 3600 },
    { month: "Oct", price: 3650 }, { month: "Nov", price: 3700 }, { month: "Dec", price: 3800 },
  ],
  potato: [
    { month: "Jan", price: 1200 }, { month: "Feb", price: 1100 }, { month: "Mar", price: 1050 },
    { month: "Apr", price: 1150 }, { month: "May", price: 1250 }, { month: "Jun", price: 1350 },
    { month: "Jul", price: 1450 }, { month: "Aug", price: 1550 }, { month: "Sep", price: 1600 },
    { month: "Oct", price: 1750 }, { month: "Nov", price: 1800 }, { month: "Dec", price: 1900 },
  ],
  tomato: [
    { month: "Jan", price: 2500 }, { month: "Feb", price: 2300 }, { month: "Mar", price: 1800 },
    { month: "Apr", price: 1500 }, { month: "May", price: 1200 }, { month: "Jun", price: 3500 },
    { month: "Jul", price: 4200 }, { month: "Aug", price: 5000 }, { month: "Sep", price: 3800 },
    { month: "Oct", price: 2800 }, { month: "Nov", price: 2200 }, { month: "Dec", price: 2000 },
  ],
  onion: [
    { month: "Jan", price: 1800 }, { month: "Feb", price: 1600 }, { month: "Mar", price: 1400 },
    { month: "Apr", price: 1500 }, { month: "May", price: 1700 }, { month: "Jun", price: 2200 },
    { month: "Jul", price: 2800 }, { month: "Aug", price: 3500 }, { month: "Sep", price: 4200 },
    { month: "Oct", price: 4800 }, { month: "Nov", price: 3200 }, { month: "Dec", price: 2400 },
  ],
};

const getCrops = (t: any) => [
  { id: "wheat", name: t("cropWheat") },
  { id: "rice", name: t("cropRice") },
  { id: "potato", name: t("cropPotato") },
  { id: "tomato", name: t("cropTomato") },
  { id: "onion", name: t("cropOnion") },
];

export default function MarketPricesPage() {
  const [selectedCrop, setSelectedCrop] = useState("wheat");
  const { t } = useLanguage();

  const crops = getCrops(t);
  const data = MOCK_DATA[selectedCrop];

  // Calculate trends
  const currentPrice = data[data.length - 1].price;
  const previousPrice = data[data.length - 2].price;
  const priceChange = currentPrice - previousPrice;
  const percentChange = ((priceChange / previousPrice) * 100).toFixed(2);
  const isPositive = priceChange >= 0;

  return (
    <div 
      className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-cover bg-center bg-fixed relative z-0"
      style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1920&auto=format&fit=crop")' }}
    >
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] -z-10"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white transition-colors mb-10 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-white/20"
        >
          <ArrowLeft size={16} />
          {t("backToHome")}
        </Link>

        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/20 border border-green-500/30 text-green-300 text-sm font-bold shadow-sm">
              <TrendingUp size={16} />
              <span>Live Analytics</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              {t("marketPricesDashboard")}
            </h1>
            <p className="text-lg text-white/80 max-w-2xl font-medium">
              {t("trackHistoricalPrices")}
            </p>
          </div>

          <div className="relative shrink-0">
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="appearance-none bg-white/80 backdrop-blur-lg border border-slate-200 text-slate-800 text-lg font-bold px-6 py-4 pr-12 rounded-2xl shadow-lg hover:shadow-xl transition-all focus:outline-none focus:ring-4 focus:ring-green-500/20 cursor-pointer w-full lg:w-64"
            >
              {crops.map((crop) => (
                <option key={crop.id} value={crop.id}>
                  {crop.name}
                </option>
              ))}
            </select>
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <svg width="16" height="10" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 2L8 8L14 2" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Stats Row with Glassmorphism */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-sm border border-slate-200/60 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/20 to-transparent rounded-full -mr-10 -mt-10 blur-2xl"></div>
            <p className="text-slate-500 font-semibold mb-2">{t("currentPricePerQuintal")}</p>
            <div className="flex items-end gap-4">
              <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">₹{currentPrice}</h3>
              <div className={`flex items-center px-2.5 py-1 rounded-lg text-sm font-bold mb-1.5 ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {isPositive ? <ArrowUpRight size={16} className="mr-1"/> : <ArrowDownRight size={16} className="mr-1"/>}
                {Math.abs(Number(percentChange))}%
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-sm border border-slate-200/60 relative overflow-hidden hover:shadow-md transition-shadow">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-transparent rounded-full -mr-10 -mt-10 blur-2xl"></div>
            <p className="text-slate-500 font-semibold mb-2">{t("lowestPriceYear")}</p>
            <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              ₹{Math.min(...data.map(d => d.price))}
            </h3>
          </div>
          
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-sm border border-slate-200/60 relative overflow-hidden hover:shadow-md transition-shadow">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400/20 to-transparent rounded-full -mr-10 -mt-10 blur-2xl"></div>
            <p className="text-slate-500 font-semibold mb-2">{t("highestPriceYear")}</p>
            <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              ₹{Math.max(...data.map(d => d.price))}
            </h3>
          </div>
        </div>

        {/* Interactive Chart Section */}
        <div className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-6 md:p-10 shadow-lg shadow-slate-200/50 border border-slate-200">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-slate-800">{t("priceTrend12Months")}</h3>
          </div>
          
          <div className="w-full h-[450px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, bottom: 20, left: -20 }}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontWeight: 600, fontSize: 13 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontWeight: 600, fontSize: 13 }}
                  dx={-10}
                  tickFormatter={(value) => `₹${value}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                    padding: '16px',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(8px)'
                  }}
                  formatter={(value: number) => [`₹${value}`, t("price")]}
                  labelStyle={{ color: '#64748b', fontWeight: 700, marginBottom: '8px', fontSize: '16px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="price" 
                  name={t("marketPrice")}
                  stroke="#16a34a" 
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorPrice)"
                  activeDot={{ r: 8, stroke: '#fff', strokeWidth: 4, fill: '#16a34a', style: { filter: 'drop-shadow(0px 4px 6px rgba(22, 163, 74, 0.4))' } }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
