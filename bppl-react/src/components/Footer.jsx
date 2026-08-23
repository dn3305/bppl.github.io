import React from 'react';
import { MapPin, Phone, Mail, ChevronRight, ArrowUp, Lock } from 'lucide-react';
import { OWNER_EMAIL, OWNER_PHONE, OFFICE_PHONE } from '../services/emailService';
import { BPPL_LOGO_BASE64 } from '../services/logoBase64';

export default function Footer({ onNavClick, onOpenAdmin }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-slate-800">
          
          {/* Brand Col (5 cols) */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <img 
                src={BPPL_LOGO_BASE64} 
                alt="BPPL Logo" 
                className="h-8 w-auto object-contain"
              />
              <span className="font-bold text-white text-sm tracking-tight">
                BHARAT PETCHEM PVT. LTD.
              </span>
            </div>

            <p className="text-slate-400 leading-relaxed text-xs max-w-sm">
              Specialist Chemical, Petroleum & Agriculture Engineers delivering certified crop protection chemistry, industrial water treatment solutions, and process engineering consultancy.
            </p>

            <div className="text-[11px] text-slate-300">
              M-32/B, 4th Floor, Abul Fazal Enclave Part-1, South Delhi-110025
            </div>
          </div>

          {/* Quick Links (3 cols) */}
          <div className="md:col-span-3 space-y-2.5">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-1.5 text-xs">
              {[
                { id: 'home', label: 'Home' },
                { id: 'about', label: 'About Us' },
                { id: 'services', label: 'Services' },
                { id: 'technical', label: 'Technical Advisory' },
                { id: 'products', label: 'Products & Formulations' },
                { id: 'contact', label: 'Contact Us' },
              ].map(link => (
                <li key={link.id}>
                  <button
                    onClick={() => onNavClick(link.id)}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
              {/* Discreet Admin Link below Contact Us */}
              <li className="pt-2">
                <button
                  onClick={onOpenAdmin}
                  className="text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1 text-[11px]"
                  title="Admin Portal"
                >
                  <Lock className="w-3 h-3" />
                  <span>Admin</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Contact (4 cols) */}
          <div className="md:col-span-4 space-y-2.5">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider">
              Direct Contact
            </h4>
            <div className="space-y-1.5 text-xs text-slate-300">
              <div>Phone: <a href={`tel:${OWNER_PHONE.replace(/\s+/g, '')}`} className="text-white hover:underline">{OWNER_PHONE}</a></div>
              <div>Office: <span className="text-slate-400">{OFFICE_PHONE}</span></div>
              <div>Email: <a href={`mailto:${OWNER_EMAIL}`} className="text-white hover:underline">{OWNER_EMAIL}</a></div>
              <div>Sales: <span className="text-slate-400">sale@bharatpetchem.com</span></div>
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <div>
            © {new Date().getFullYear()} BHARAT PETCHEM PVT. LTD. All rights reserved. Registered in Delhi.
          </div>
          <button
            onClick={scrollToTop}
            className="text-slate-400 hover:text-white transition-colors flex items-center gap-1"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
}
