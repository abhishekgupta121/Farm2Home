"use client";

import { X } from "lucide-react";

interface FilterChipsProps {
  filters: any;
  onRemove: (key: string, value?: string) => void;
  onClearAll: () => void;
}

export default function FilterChips({ filters, onRemove, onClearAll }: FilterChipsProps) {
  const chips: { key: string; value: string; label: string }[] = [];

  if (filters.category && filters.category.length > 0) {
    const cats = Array.isArray(filters.category) ? filters.category : filters.category.split(",");
    cats.forEach((c: string) => chips.push({ key: "category", value: c, label: c }));
  }
  if (filters.listingType && filters.listingType.length > 0) {
    const types = Array.isArray(filters.listingType) ? filters.listingType : filters.listingType.split(",");
    const labels: any = { "standard": "Standard", "pre-list": "Pre-listed", "ugly-sell": "Ugly Buy" };
    types.forEach((t: string) => chips.push({ key: "listingType", value: t, label: labels[t] || t }));
  }
  if (filters.location) chips.push({ key: "location", value: filters.location, label: `Location: ${filters.location}` });
  if (filters.search) chips.push({ key: "search", value: filters.search, label: `Search: "${filters.search}"` });

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      <span className="text-sm font-bold text-slate-500 mr-2">Active Filters:</span>
      {chips.map((chip, idx) => (
        <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-700 text-xs font-bold rounded-full border border-orange-200">
          <span className="capitalize">{chip.label}</span>
          <button onClick={() => onRemove(chip.key, chip.value)} className="hover:text-orange-900 transition-colors">
            <X size={14} />
          </button>
        </div>
      ))}
      <button 
        onClick={onClearAll}
        className="text-xs font-bold text-slate-500 hover:text-red-500 underline underline-offset-4 ml-2 transition-colors"
      >
        Clear All
      </button>
    </div>
  );
}
