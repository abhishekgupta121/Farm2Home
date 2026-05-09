"use client";

import { X } from "lucide-react";
import FilterSidebar from "./FilterSidebar";

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialFilters: any;
  onFilterChange: (filters: any) => void;
}

export default function FilterDrawer({ isOpen, onClose, initialFilters, onFilterChange }: FilterDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex lg:hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Drawer */}
      <div className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-slate-50 py-4 pb-12 shadow-2xl">
        <div className="flex items-center justify-between px-4 mb-4">
          <h2 className="text-lg font-black text-slate-900">Filters</h2>
          <button
            type="button"
            className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md p-2 text-slate-400 hover:text-slate-500"
            onClick={onClose}
          >
            <span className="sr-only">Close menu</span>
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {/* Reusing the Sidebar content but without its container styling */}
        <div className="px-4">
          <FilterSidebar initialFilters={initialFilters} onFilterChange={onFilterChange} />
        </div>
      </div>
    </div>
  );
}
