import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Menu, 
  X, 
  ChevronRight 
} from 'lucide-react';
import { OWNER_EMAIL, OWNER_PHONE } from '../services/emailService';
import { BPPL_LOGO_BASE64 } from '../services/logoBase64';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  selectedProduct,
  onBackToCatalog
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'services', label: 'Services' },
    { id: 'technical', label: 'Technical' },
    { id: 'products', label: 'Products' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (id) => {
    if (selectedProduct && onBackToCatalog) {
      onBackToCatalog();
    }
    setActiveTab(id);
    setMobileMenuOpen(false);
    
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Clean Top Contact Strip */}
      <div className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>M-32/B, Abul Fazal Enclave-1, South Delhi-110025</span>
            </span>
            <a 
              href={`mailto:${OWNER_EMAIL}`} 
              className="flex items-center gap-1.5 hover:text-blue-900 transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{OWNER_EMAIL}</span>
            </a>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-slate-400">BHARAT PETCHEM PVT. LTD.</span>
            <a 
              href={`tel:${OWNER_PHONE.replace(/\s+/g, '')}`} 
              className="flex items-center gap-1.5 text-slate-800 font-semibold hover:text-blue-900 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-blue-900" />
              <span>{OWNER_PHONE}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Clean Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between">
          {/* Minimalist Logo */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <img 
              src={BPPL_LOGO_BASE64} 
              alt="BPPL Logo" 
              className="h-10 w-auto object-contain"
            />
            <div className="flex flex-col">
              <span className="font-bold text-base sm:text-lg tracking-tight text-slate-900 group-hover:text-blue-900 transition-colors">
                BHARAT PETCHEM
              </span>
              <span className="text-[10px] text-slate-400 tracking-wider uppercase font-medium">
                Agro-Chemicals & Industrial Solutions
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => {
              const isActive = activeTab === item.id && !selectedProduct;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`text-sm font-medium transition-colors relative py-1 ${
                    isActive 
                      ? 'text-blue-900 font-semibold' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-900 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Direct CTA */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => handleNavClick('products')}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-950 hover:bg-blue-900 rounded transition-colors"
            >
              Browse Catalog
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
            >
              Contact Us
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-slate-900"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-4 py-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded text-sm font-medium ${
                activeTab === item.id
                  ? 'bg-blue-50 text-blue-950 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>{item.label}</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          ))}
          <div className="pt-3 border-t border-slate-100 flex gap-2">
            <button
              onClick={() => handleNavClick('products')}
              className="flex-1 py-2 text-xs font-semibold text-white bg-blue-950 rounded text-center"
            >
              Products
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className="flex-1 py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded text-center"
            >
              Contact Us
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
