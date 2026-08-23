import React, { useState } from 'react';
import { Eye, ArrowRight, FlaskConical } from 'lucide-react';
import { formatCurrency } from '../services/emailService';

export default function ProductCard({ 
  product, 
  onQuickView, 
  onSelectProduct, 
  onDirectOrder 
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="bg-white rounded-lg border border-slate-200 hover:border-slate-300 transition-all hover:shadow-sm flex flex-col justify-between overflow-hidden group">
      <div>
        {/* Product Image Area */}
        <div 
          onClick={() => onSelectProduct(product)}
          className="relative h-56 bg-slate-50 flex items-center justify-center p-6 cursor-pointer border-b border-slate-100"
        >
          {!imgError ? (
            <img 
              src={product.imagePath} 
              alt={product.title}
              onError={() => setImgError(true)}
              className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-400 gap-1.5">
              <FlaskConical className="w-10 h-10 text-slate-300" />
              <span className="text-xs text-slate-500 font-medium">{product.title}</span>
            </div>
          )}

          {/* S.NO Badge */}
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm border border-slate-200 px-2 py-0.5 rounded text-[10px] font-mono text-slate-600">
            #{product.id}
          </span>
          <span className="absolute top-3 right-3 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-[10px] font-medium text-slate-700">
            {product.category || 'Agro-Chemical'}
          </span>
        </div>

        {/* Content Details */}
        <div className="p-4 space-y-2">
          {product.activeIngredient && (
            <div className="text-[11px] font-semibold text-blue-950 uppercase tracking-wider">
              {product.activeIngredient}
            </div>
          )}

          <h3 
            onClick={() => onSelectProduct(product)}
            className="font-bold text-slate-900 hover:text-blue-900 cursor-pointer transition-colors text-base leading-snug"
          >
            {product.title}
          </h3>

          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          <div className="text-[11px] text-slate-500 pt-1">
            Pack: <span className="text-slate-800 font-medium">{product.packaging || product.qty || 'Standard'}</span>
          </div>
        </div>
      </div>

      {/* Bottom Price & Action Row */}
      <div className="p-4 pt-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-2">
        <div>
          <span className="text-[10px] text-slate-400 uppercase block">Unit Price</span>
          <div className="text-base font-bold text-slate-900">
            {formatCurrency(product.unitPrice)}
            <span className="text-xs font-normal text-slate-500"> / {product.unit}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onQuickView(product)}
            className="px-2.5 py-1.5 rounded bg-white hover:bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200 transition-colors"
            title="Quick View"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onSelectProduct(product)}
            className="px-3 py-1.5 rounded bg-blue-950 hover:bg-blue-900 text-white text-xs font-medium transition-colors flex items-center gap-1"
          >
            <span>Order</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
