"use client";

import { useState, useEffect } from "react";
import { Search, MapPin } from "lucide-react";

interface FilterSidebarProps {
  initialFilters: any;
  onFilterChange: (filters: any) => void;
}

export default function FilterSidebar({ initialFilters, onFilterChange }: FilterSidebarProps) {
  const [filters, setFilters] = useState({
    category: [] as string[],
    minPrice: "",
    maxPrice: "",
    organic: false,
    verified: false,
    inStock: false,
    location: "",
    search: "",
    ...initialFilters,
  });

  // Debounce logic for search and location inputs to avoid rapid API calls
  useEffect(() => {
    const handler = setTimeout(() => {
      onFilterChange(filters);
    }, 500);
    return () => clearTimeout(handler);
  }, [filters]);

  const handleCategoryChange = (cat: string) => {
    setFilters((prev: any) => {
      const isSelected = prev.category.includes(cat);
      const newCategory = isSelected
        ? prev.category.filter((c: string) => c !== cat)
        : [...prev.category, cat];
      return { ...prev, category: newCategory };
    });
  };

  const handleCheckboxChange = (field: string) => {
    setFilters((prev: any) => ({ ...prev, [field]: !prev[field] }));
  };

  const categories = ["vegetable", "fruit", "grain", "spice", "other"];

  return (
    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-black text-lg text-slate-900">Filters</h3>
      </div>

      {/* Categories */}
      <div className="mb-8">
        <h4 className="font-bold text-slate-900 mb-3 text-sm uppercase tracking-widest">Categories</h4>
        <div className="space-y-2">
          {categories.map((cat) => (
            <label key={cat} className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center w-5 h-5 rounded border border-slate-300 group-hover:border-orange-500 transition-colors">
                <input 
                  type="checkbox" 
                  className="peer sr-only"
                  checked={filters.category?.includes(cat) || false}
                  onChange={() => handleCategoryChange(cat)}
                />
                <div className="absolute inset-0 bg-orange-500 scale-0 peer-checked:scale-100 transition-transform rounded flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
              </div>
              <span className="text-slate-600 font-medium capitalize group-hover:text-slate-900 transition-colors">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-8">
        <h4 className="font-bold text-slate-900 mb-3 text-sm uppercase tracking-widest">Price Range (₹)</h4>
        <div className="flex items-center gap-3">
          <input 
            type="number" 
            placeholder="Min" 
            value={filters.minPrice}
            onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-500 transition-colors"
          />
          <span className="text-slate-400">-</span>
          <input 
            type="number" 
            placeholder="Max" 
            value={filters.maxPrice}
            onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-500 transition-colors"
          />
        </div>
      </div>

      {/* Toggles */}
      <div className="mb-8 space-y-4">
        <h4 className="font-bold text-slate-900 mb-3 text-sm uppercase tracking-widest">Preferences</h4>
        
        <label className="flex items-center justify-between cursor-pointer group">
          <span className="text-slate-600 font-medium group-hover:text-slate-900 transition-colors">Organic Only</span>
          <div className="relative inline-flex items-center">
            <input type="checkbox" className="sr-only peer" checked={filters.organic || false} onChange={() => handleCheckboxChange("organic")} />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
          </div>
        </label>

        <label className="flex items-center justify-between cursor-pointer group">
          <span className="text-slate-600 font-medium group-hover:text-slate-900 transition-colors">Verified Farmers</span>
          <div className="relative inline-flex items-center">
            <input type="checkbox" className="sr-only peer" checked={filters.verified || false} onChange={() => handleCheckboxChange("verified")} />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
          </div>
        </label>

        <label className="flex items-center justify-between cursor-pointer group">
          <span className="text-slate-600 font-medium group-hover:text-slate-900 transition-colors">In Stock Only</span>
          <div className="relative inline-flex items-center">
            <input type="checkbox" className="sr-only peer" checked={filters.inStock || false} onChange={() => handleCheckboxChange("inStock")} />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
          </div>
        </label>
      </div>

      {/* Location */}
      <div>
        <h4 className="font-bold text-slate-900 mb-3 text-sm uppercase tracking-widest">Location</h4>
        <div className="relative">
          <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="City, State or Pin" 
            value={filters.location}
            onChange={(e) => setFilters({...filters, location: e.target.value})}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-orange-500 transition-colors font-medium"
          />
        </div>
      </div>
    </div>
  );
}
