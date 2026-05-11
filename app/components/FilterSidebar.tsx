"use client";

import { useState, useEffect } from "react";
import { Search, MapPin, ChevronDown, ChevronUp } from "lucide-react";

interface FilterSidebarProps {
  initialFilters: any;
  onFilterChange: (filters: any) => void;
}

export default function FilterSidebar({ initialFilters, onFilterChange }: FilterSidebarProps) {
  const [filters, setFilters] = useState({
    category: [] as string[],
    subCategory: [] as string[],
    listingType: [] as string[],
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
      
      // Also clear subcategories if category is unchecked
      let newSubCategory = prev.subCategory || [];
      if (isSelected && subCategories[cat]) {
        newSubCategory = newSubCategory.filter((s: string) => !subCategories[cat].includes(s));
      }
      
      return { ...prev, category: newCategory, subCategory: newSubCategory };
    });
  };

  const handleSubCategoryChange = (sub: string) => {
    setFilters((prev: any) => {
      const isSelected = (prev.subCategory || []).includes(sub);
      const newSubCategory = isSelected
        ? prev.subCategory.filter((s: string) => s !== sub)
        : [...(prev.subCategory || []), sub];
      return { ...prev, subCategory: newSubCategory };
    });
  };

  const categories = ["vegetable", "fruit", "pulses"];
  
  const subCategories: { [key: string]: string[] } = {
    vegetable: ["Potato", "Onion", "Garlic", "Tomato"],
    pulses: ["Moong Dal", "Masoor Dal", "Toor Dal"],
    fruit: ["Mango", "Apple"],
  };

  return (
    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-black text-lg text-slate-900">Filters</h3>
      </div>

      {/* Categories & Subcategories */}
      <div className="mb-8">
        <h4 className="font-bold text-slate-900 mb-3 text-sm uppercase tracking-widest">Categories</h4>
        <div className="space-y-3">
          {categories.map((cat) => {
            const isCatSelected = filters.category?.includes(cat);
            return (
              <div key={cat} className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center w-5 h-5 rounded border border-slate-300 group-hover:border-orange-500 transition-colors">
                    <input 
                      type="checkbox" 
                      className="peer sr-only"
                      checked={isCatSelected || false}
                      onChange={() => handleCategoryChange(cat)}
                    />
                    <div className="absolute inset-0 bg-orange-500 scale-0 peer-checked:scale-100 transition-transform rounded flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </div>
                  </div>
                  <span className="text-slate-600 font-bold capitalize group-hover:text-slate-900 transition-colors flex-1">{cat}</span>
                  {subCategories[cat] && (
                    <span className="text-slate-400 group-hover:text-slate-600 transition-colors">
                      {isCatSelected ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </span>
                  )}
                </label>

                {/* Subcategories */}
                {isCatSelected && subCategories[cat] && (
                  <div className="ml-8 space-y-2 border-l-2 border-slate-100 pl-4 mt-2">
                    {subCategories[cat].map((sub) => (
                      <label key={sub} className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative flex items-center justify-center w-4 h-4 rounded border border-slate-300 group-hover:border-orange-500 transition-colors">
                          <input 
                            type="checkbox" 
                            className="peer sr-only"
                            checked={filters.subCategory?.includes(sub) || false}
                            onChange={() => handleSubCategoryChange(sub)}
                          />
                          <div className="absolute inset-0 bg-orange-400 scale-0 peer-checked:scale-100 transition-transform rounded flex items-center justify-center">
                            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                          </div>
                        </div>
                        <span className="text-slate-500 text-sm font-medium group-hover:text-slate-900 transition-colors">{sub}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Listing Type */}
      <div className="mb-8">
        <h4 className="font-bold text-slate-900 mb-3 text-sm uppercase tracking-widest">Listing Type</h4>
        <div className="space-y-2">
          {[
            { id: "standard", label: "Standard" },
            { id: "pre-list", label: "Pre-listed" },
            { id: "ugly-sell", label: "Ugly Buy" }
          ].map((type) => (
            <label key={type.id} className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center w-5 h-5 rounded border border-slate-300 group-hover:border-orange-500 transition-colors">
                <input 
                   type="checkbox" 
                   className="peer sr-only"
                   checked={filters.listingType?.includes(type.id) || false}
                   onChange={() => {
                     setFilters((prev: any) => {
                       const isSelected = (prev.listingType || []).includes(type.id);
                       const newType = isSelected
                         ? prev.listingType.filter((t: string) => t !== type.id)
                         : [...(prev.listingType || []), type.id];
                       return { ...prev, listingType: newType };
                     });
                   }}
                />
                <div className="absolute inset-0 bg-orange-500 scale-0 peer-checked:scale-100 transition-transform rounded flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
              </div>
              <span className="text-slate-600 font-medium group-hover:text-slate-900 transition-colors">{type.label}</span>
            </label>
          ))}
        </div>
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
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-orange-500 transition-colors font-medium text-slate-900 placeholder-slate-400"
          />
        </div>
      </div>
    </div>
  );
}
