import React from 'react';
import { FlaskConical, Factory, Cpu, Boxes, ArrowRight } from 'lucide-react';

export default function ServicesSection({ onSelectCategory }) {
  const services = [
    {
      id: 'agro',
      title: 'Agro Chemicals',
      subtitle: 'Pesticides, Insecticides & Herbicides',
      icon: FlaskConical,
      description: 'Manufacture and trading of high-potency crop protection chemistry including Bispyribac Sodium 10% SC, Glyphosate 41% SL, Chlorpyrifos 20% EC, Pretilachlor, and custom bio-fertilizers.',
      category: 'Herbicides'
    },
    {
      id: 'industrial',
      title: 'Industrial Chemicals',
      subtitle: 'Anti-Scalants, Corrosion Inhibitors & Defoamers',
      icon: Factory,
      description: 'Specialty formulations engineered for cooling towers, boiler feed systems, heat exchangers, reverse osmosis installations, and effluent treatment facilities.',
      category: 'Industrial Chemicals'
    },
    {
      id: 'technical',
      title: 'Technical Advisory',
      subtitle: 'Process Simulation & Commissioning',
      icon: Cpu,
      description: 'Consultancy services related to process studies for Oil & Gas, Refineries, Petrochemicals & Fertilizers, including steady-state simulation, flow assurance, and plant commissioning.',
      category: 'Technical'
    },
    {
      id: 'materials',
      title: 'Materials & Equipment',
      subtitle: 'Stainless Steel, Alloys & Auto Parts',
      icon: Boxes,
      description: 'Recommending and trading of industrial equipment materials, stainless steel and aluminum sheets, automobile parts, steel pipes, tubes, and specialized pipe fittings.',
      category: 'Engineering Materials'
    }
  ];

  return (
    <section id="services" className="py-16 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-bold text-blue-950 uppercase tracking-wider block mb-1">
            Our Business Portfolio
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Comprehensive Services & Offerings
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Delivering high-purity chemical manufacturing, industrial solutions, and professional engineering advisory across India.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((item) => {
            const Icon = item.icon;
            return (
              <div 
                key={item.id}
                className="p-6 rounded-lg border border-slate-200 hover:border-slate-300 transition-all bg-slate-50/40 hover:bg-white flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded bg-white border border-slate-200 flex items-center justify-center text-blue-950">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900">{item.title}</h3>
                    <div className="text-xs text-slate-400 mt-0.5">{item.subtitle}</div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100">
                  <button
                    onClick={() => onSelectCategory(item.category)}
                    className="text-xs font-semibold text-blue-950 hover:underline flex items-center gap-1"
                  >
                    <span>View Formulations</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
