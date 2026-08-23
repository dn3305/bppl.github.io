import React, { useState } from 'react';
import { X, Mail, MessageCircle, ExternalLink } from 'lucide-react';
import { formatCurrency, OWNER_EMAIL, sendOrderViaWhatsApp } from '../services/emailService';

export default function QuickViewModal({ 
  product, 
  onClose, 
  onOpenFullPage, 
  onOpenOrderModal 
}) {
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const calculatedTotal = (product.unitPrice || 0) * quantity;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-lg border border-slate-200 shadow-xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="rounded bg-slate-50 border border-slate-100 p-6 flex items-center justify-center min-h-[220px]">
            <img 
              src={product.imagePath} 
              alt={product.title} 
              className="max-h-60 w-full object-contain"
            />
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-bold text-blue-950 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">
                {product.category || 'Agro-Chemical'}
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-1">
                {product.title}
              </h2>
              {product.activeIngredient && (
                <div className="text-xs text-slate-500 mt-0.5">
                  {product.activeIngredient}
                </div>
              )}
              <p className="text-xs text-slate-600 mt-2 line-clamp-3">
                {product.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Price</span>
                  <div className="text-lg font-bold text-slate-900">
                    {formatCurrency(product.unitPrice)} <span className="text-xs font-normal text-slate-500">/ {product.unit}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-slate-50 p-1 rounded border border-slate-200">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-7 h-7 rounded bg-white hover:bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-bold text-xs text-slate-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-7 h-7 rounded bg-white hover:bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Subtotal:</span>
                <span className="font-bold text-slate-900 text-sm">
                  {formatCurrency(calculatedTotal)}
                </span>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => {
                    onClose();
                    onOpenOrderModal(product, quantity);
                  }}
                  className="flex-1 py-2.5 px-3 bg-blue-950 hover:bg-blue-900 text-white text-xs font-semibold rounded flex items-center justify-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Order Inquiry</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onOpenFullPage(product);
                  }}
                  className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium rounded flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Details</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
