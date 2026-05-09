"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Sprout, LogOut, Languages } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { t, language, setLanguage } = useLanguage();

  // For Hackathon Demo: Change this to 'farmer', 'consumer', or null
  const [userRole, setUserRole] = useState<'farmer' | 'consumer' | null>(null);

  useEffect(() => {
    // Sync with localStorage on load
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed.role) setUserRole(parsed.role);
      } catch (e) {}
    } else {
      const savedRole = localStorage.getItem("userRole");
      if (savedRole === 'farmer' || savedRole === 'consumer') {
        setUserRole(savedRole);
      }
    }
  }, []);

  const handleRoleChange = (role: 'farmer' | 'consumer' | null) => {
    setUserRole(role);
    if (role) {
      localStorage.setItem("userRole", role);
    } else {
      localStorage.removeItem("userRole");
      localStorage.removeItem("user");
    }
  };

  // Base links available to everyone
  const baseLinks = [
    { name: t('features'), href: '/features' },
    { name: t('marketPrices'), href: '/market-prices' },
    { name: t('contact'), href: '/contact' },
  ];

  // Dynamic links based on role
  const roleLinks = {
    farmer: [
      { name: 'Ugly Sell', href: '/ugly-sell' },
      { name: 'Pre-list', href: '/pre-list' },
      { name: 'Dashboard', href: '/farmer/dashboard' },
    ],
    consumer: [
      { name: 'Ugly Buy', href: '/ugly-buy' },
      { name: 'Prebook', href: '/prebook' },
      { name: 'My Orders', href: '/consumer/dashboard' },
    ],
  };

  const currentLinks = userRole 
    ? [...baseLinks, ...roleLinks[userRole]] 
    : baseLinks;

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-green-600 p-1.5 rounded-lg">
              <Sprout className="text-white" size={20} />
            </div>
            <span className="text-xl font-bold text-slate-900">
              Farm2<span className="text-green-600">Home</span>
            </span>
          </Link>

          {/* Desktop Links (Dynamic) */}
          <div className="hidden md:flex items-center space-x-6">
            {currentLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === link.href ? 'text-green-600' : 'text-slate-600 hover:text-green-600'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Authentication & Language UI */}
          <div className="hidden md:flex items-center space-x-4">
            
            {/* Language Switcher */}
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg">
              <Languages size={16} className="text-slate-500" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as "en" | "hi")}
                className="bg-transparent text-sm text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="en">EN</option>
                <option value="hi">HI</option>
              </select>
            </div>
            
            {!userRole ? (
              <div className="flex gap-2">
                <button 
                  onClick={() => handleRoleChange('farmer')}
                  className="text-xs bg-orange-100 text-orange-700 px-3 py-1.5 rounded font-medium hover:bg-orange-200 transition"
                >
                  Demo: Farmer
                </button>
                <button 
                  onClick={() => handleRoleChange('consumer')}
                  className="text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded font-medium hover:bg-blue-200 transition"
                >
                  Demo: Consumer
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4 border-l pl-4 border-slate-200">
                <span className="text-xs font-bold uppercase px-2 py-1 bg-green-100 rounded text-green-700">
                  {userRole}
                </span>
                <button 
                  onClick={() => handleRoleChange(null)}
                  className="text-slate-500 hover:text-red-600 transition"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 p-4 space-y-4">
          <div className="space-y-1">
            {currentLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-3 text-base font-medium text-slate-600 hover:bg-green-50 rounded-lg"
              >
                {link.name}
              </Link>
            ))}
          </div>
          
          <div className="border-t border-slate-100 pt-4">
             {/* Mobile Language Switcher */}
             <div className="flex items-center gap-2 mb-4 px-3">
              <Languages size={18} className="text-slate-500" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as "en" | "hi")}
                className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-sm text-slate-700 focus:outline-none"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
              </select>
            </div>

            {!userRole ? (
              <div className="flex flex-col gap-2 px-3">
                <button 
                  onClick={() => { handleRoleChange('farmer'); setIsOpen(false); }}
                  className="text-sm bg-orange-100 text-orange-700 px-4 py-2 rounded font-medium text-left"
                >
                  Login as Farmer (Demo)
                </button>
                <button 
                  onClick={() => { handleRoleChange('consumer'); setIsOpen(false); }}
                  className="text-sm bg-blue-100 text-blue-700 px-4 py-2 rounded font-medium text-left"
                >
                  Login as Consumer (Demo)
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between px-3">
                <span className="text-sm font-bold uppercase px-3 py-1 bg-green-100 rounded text-green-700">
                  {userRole}
                </span>
                <button 
                  onClick={() => { handleRoleChange(null); setIsOpen(false); }}
                  className="text-sm text-red-600 font-medium flex items-center gap-2"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
