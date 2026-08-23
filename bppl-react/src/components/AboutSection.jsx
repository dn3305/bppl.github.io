import React from 'react';
import { Target, Eye, ShieldCheck, MapPin } from 'lucide-react';

export default function AboutSection() {
  return (
    <section id="about" className="py-16 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-bold text-blue-950 uppercase tracking-wider block mb-1">
            About BPPL
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Company Profile, Mission & Vision
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Registered office situated in the State of Delhi, operating across national and international markets.
          </p>
        </div>

        {/* 2 Column Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column (7 cols) */}
          <div className="lg:col-span-7 space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <p>
              <strong>BHARAT PETCHEM PVT. LTD.</strong> is comprising of specialist Chemical & Petroleum Engineers, Chemists, Environmental Engineer, Safety Engineers, Agriculture Engineers, Food Technologist and other engineers like Mechanical, Civil, E&I.
            </p>
            <p>
              Our main services include consultancy services related to process studies for Oil & Gas, Refinery, Petrochemical / Chemicals & Fertilizer industries, Research & Development including laboratory testing. We are also recommending & trading of the suitable materials related to industrial equipment, industrial chemicals, agro chemicals, building materials, and specialized industrial supplies.
            </p>
            <p>
              We provide the training for Engineers / professionals with certification for Process facilities design, Simulation, Flow assurance, HSE, Process Facilities, Process Plants Commissioning, Plant operation & Maintenance.
            </p>

            <div className="pt-4 grid grid-cols-3 gap-3 border-t border-slate-100 text-center">
              <div className="p-3 bg-slate-50 rounded border border-slate-100">
                <span className="text-base font-bold text-slate-900 block">100%</span>
                <span className="text-[10px] text-slate-500">Quality Verified</span>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-100">
                <span className="text-base font-bold text-slate-900 block">Delhi</span>
                <span className="text-[10px] text-slate-500">Registered Office</span>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-100">
                <span className="text-base font-bold text-slate-900 block">PAN-India</span>
                <span className="text-[10px] text-slate-500">Supply Network</span>
              </div>
            </div>
          </div>

          {/* Right Column: Mission & Vision (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-950 uppercase tracking-wider">
                <Target className="w-4 h-4 text-blue-950" />
                <span>Our Mission</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Bharat Petchem Pvt. Ltd. has a full-fledged system that aims towards the development of business along the various well recognized national & international standards. We have an excellent infrastructure to compliment advanced technology and marketing expertise.
              </p>
            </div>

            <div className="p-5 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-950 uppercase tracking-wider">
                <Eye className="w-4 h-4 text-blue-950" />
                <span>Our Vision</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                We are whole-heartedly focused on providing the best services to our customers. We believe in customer partnership and aspire to attain customer delight by providing best solutions to their problems.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-blue-950 text-white text-xs space-y-1">
              <span className="font-semibold block">Registered Office Address:</span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                M-32/B, 4 TH FLOOR, ABUL FAZAL ENCLAVE PART-1, SOUTH DELHI-110025
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
