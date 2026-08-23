import React from 'react';
import { Cpu, CheckCircle2, Phone, Mail } from 'lucide-react';
import { OWNER_EMAIL, OWNER_PHONE } from '../services/emailService';

export default function TechnicalSection({ onOpenContact }) {
  const disciplines = [
    { title: 'Chemical & Petroleum Engineers', desc: 'Process studies, refinery debottlenecking & simulation.' },
    { title: 'Agricultural Engineers', desc: 'Crop protection formulation and field efficacy verification.' },
    { title: 'Safety & Environmental Engineers', desc: 'HSE compliance, HAZOP studies & effluent analysis.' },
    { title: 'Mechanical, Civil & E&I Engineers', desc: 'Piping design, structural analysis & instrumentation.' },
    { title: 'Commissioning Specialists', desc: 'Plant start-up, pre-commissioning & operational manual.' },
    { title: 'Engineer Training & Certifications', desc: 'Professional certification for simulation, HSE & plant operation.' }
  ];

  return (
    <section id="technical" className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-bold text-blue-950 uppercase tracking-wider block">
              Technical Advisory
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-tight">
              Specialist Engineering Consultancy & Process Studies
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Bharat Petchem Pvt. Ltd. integrates veteran Chemical, Petroleum, Environmental, Safety, and Agriculture engineers to provide end-to-end technical advisory, steady-state process simulation, flow assurance, and plant commissioning.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenContact}
                className="px-5 py-2.5 bg-blue-950 hover:bg-blue-900 text-white text-xs font-semibold rounded transition-colors"
              >
                Schedule Consultation
              </button>
              <a
                href={`tel:${OWNER_PHONE.replace(/\s+/g, '')}`}
                className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-800 text-xs font-semibold rounded border border-slate-200 transition-colors"
              >
                Call: {OWNER_PHONE}
              </a>
            </div>
          </div>

          {/* Right Column (7 cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {disciplines.map((item, idx) => (
              <div 
                key={idx}
                className="p-4 rounded bg-white border border-slate-200 space-y-1 shadow-2xs"
              >
                <div className="font-semibold text-xs text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-950 flex-shrink-0" />
                  <span>{item.title}</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed pl-5">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
