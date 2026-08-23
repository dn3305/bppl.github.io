import React from 'react';
import { ArrowRight, CheckCircle2, FlaskConical, Shield, Award, Users } from 'lucide-react';

export default function HeroSection({ onExploreProducts, onContactClick }) {
  const coreFeatures = [
    { title: 'Agro Chemicals', desc: 'Pesticides, Insecticides & Selective Herbicides for maximum crop protection.' },
    { title: 'Industrial Chemicals', desc: 'Specialty Anti-Scalants, Corrosion Inhibitors & persistent Defoamers.' },
    { title: 'Technical Advisory', desc: 'Process simulation, plant commissioning & Flow Assurance engineering.' },
    { title: 'Materials & Parts', desc: 'Stainless steel, alloy sheets, pipe fittings and industrial implements.' }
  ];

  return (
    <section className="bg-white border-b border-slate-200">
      {/* Clean Split Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 lg:pt-16 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Content (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-block px-3 py-1 bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded">
              BHARAT PETCHEM PVT. LTD.
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight tracking-tight">
              Agro Chemicals & Process Engineering Solutions
            </h1>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl">
              Comprising specialist Chemical, Petroleum, Environmental, Safety, and Agriculture Engineers delivering certified agrochemicals, industrial water treatment, and technical consultancy.
            </p>

            {/* Clean Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onExploreProducts}
                className="px-6 py-3 bg-blue-950 hover:bg-blue-900 text-white text-sm font-semibold rounded transition-colors flex items-center gap-2"
              >
                <span>View Products</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onContactClick}
                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold rounded border border-slate-200 transition-colors"
              >
                Request Quotation
              </button>
            </div>

            {/* Clean Trust Indicators */}
            <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center gap-6 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-950" /> ISO Certified Standards
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-950" /> Delhi Headquartered
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-950" /> PAN-India Delivery
              </span>
            </div>
          </div>

          {/* Right Hero Image Card (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-lg overflow-hidden border border-slate-200 shadow-sm bg-slate-50">
              <img 
                src="/images/2.jpg" 
                alt="Industrial & Petrochemical Facility" 
                onError={(e) => { e.target.src = '/products/mg2.jpeg'; }}
                className="w-full h-80 sm:h-96 object-cover"
              />
              <div className="p-5 bg-white border-t border-slate-100 space-y-1">
                <span className="text-xs font-semibold text-blue-950 uppercase tracking-wider block">
                  Quality Guaranteed
                </span>
                <p className="text-xs text-slate-600">
                  Formulated and verified by our in-house engineering and laboratory team.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* 4 Feature Columns Below Hero */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16 pt-12 border-t border-slate-200">
          {coreFeatures.map((feat, idx) => (
            <div key={idx} className="p-5 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors bg-white">
              <div className="text-xs font-bold text-blue-950 uppercase tracking-wider mb-1">
                0{idx + 1}. {feat.title}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
