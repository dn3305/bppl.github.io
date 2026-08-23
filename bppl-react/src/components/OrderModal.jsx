import React, { useState } from 'react';
import { X, Mail, MessageCircle, Copy, Check, ShoppingCart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  formatCurrency, 
  OWNER_EMAIL, 
  sendOrderViaMailto, 
  sendOrderViaWhatsApp, 
  generateOrderQuotationText 
} from '../services/emailService';

export default function OrderModal({ 
  product, 
  initialQuantity = 1, 
  onClose 
}) {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [copied, setCopied] = useState(false);
  const [orderSent, setOrderSent] = useState(false);

  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    address: '',
    pincode: '',
    notes: ''
  });

  if (!product) return null;

  const calculatedTotal = (product.unitPrice || 0) * quantity;

  const handleCopyQuote = () => {
    const text = generateOrderQuotationText({
      product,
      quantity,
      customer,
      calculatedTotal
    });
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendEmail = (e) => {
    if (e) e.preventDefault();
    if (!customer.name || !customer.phone) {
      alert('Please provide your name and phone number.');
      return;
    }

    sendOrderViaMailto({
      product,
      quantity,
      customer,
      calculatedTotal
    });

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });

    setOrderSent(true);
  };

  const handleWhatsApp = () => {
    if (!customer.name || !customer.phone) {
      alert('Please provide your name and phone number.');
      return;
    }

    sendOrderViaWhatsApp({
      product,
      quantity,
      customer,
      calculatedTotal
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div 
        className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-white rounded-lg border border-slate-200 shadow-xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-5">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            Order & Quotation Request
          </h2>
          <p className="text-xs text-slate-500">
            Inquiry will be sent to <span className="font-semibold text-blue-950">{OWNER_EMAIL}</span>
          </p>
        </div>

        {/* Product Line Item */}
        <div className="p-3.5 rounded bg-slate-50 border border-slate-200 flex items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded bg-white p-1 border border-slate-100 flex items-center justify-center flex-shrink-0">
              <img src={product.imagePath} alt="" className="h-full object-contain" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900">{product.title}</h4>
              <div className="text-xs text-slate-500">
                {formatCurrency(product.unitPrice)} / {product.unit}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-white p-1 rounded border border-slate-200">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-6 h-6 rounded bg-slate-100 text-slate-700 font-bold text-xs"
              >
                -
              </button>
              <span className="w-6 text-center font-bold text-xs text-slate-900">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-6 h-6 rounded bg-slate-100 text-slate-700 font-bold text-xs"
              >
                +
              </button>
            </div>
            <div className="text-right">
              <span className="font-bold text-blue-950 text-sm">{formatCurrency(calculatedTotal)}</span>
            </div>
          </div>
        </div>

        {orderSent && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 text-blue-950 text-xs rounded">
            Your email client has opened with the formatted invoice addressing <strong>{OWNER_EMAIL}</strong>.
          </div>
        )}

        {/* Clean Form */}
        <form onSubmit={handleSendEmail} className="space-y-3 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 mb-1">Your Name *</label>
              <input
                type="text"
                required
                placeholder="Full Name"
                value={customer.name}
                onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:border-blue-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1">Phone / WhatsApp *</label>
              <input
                type="tel"
                required
                placeholder="+91 7982845484"
                value={customer.phone}
                onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:border-blue-900 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 mb-1">Email</label>
              <input
                type="email"
                placeholder="name@domain.com"
                value={customer.email}
                onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:border-blue-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1">Company / Farm Name</label>
              <input
                type="text"
                placeholder="Business Name"
                value={customer.company}
                onChange={(e) => setCustomer({ ...customer, company: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:border-blue-900 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-slate-600 mb-1">Delivery Address</label>
              <input
                type="text"
                placeholder="Address"
                value={customer.address}
                onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:border-blue-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1">Pincode</label>
              <input
                type="text"
                placeholder="Pincode"
                value={customer.pincode}
                onChange={(e) => setCustomer({ ...customer, pincode: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:border-blue-900 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-600 mb-1">Notes</label>
            <textarea
              rows={2}
              placeholder="Additional specifications or requests..."
              value={customer.notes}
              onChange={(e) => setCustomer({ ...customer, notes: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-1.5 text-slate-900 focus:bg-white focus:border-blue-900 focus:outline-none resize-none"
            />
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 bg-blue-950 hover:bg-blue-900 text-white font-semibold rounded transition-colors flex items-center justify-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Send Order to {OWNER_EMAIL}</span>
            </button>
            <button
              type="button"
              onClick={handleWhatsApp}
              className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded border border-slate-200 transition-colors"
            >
              WhatsApp
            </button>
            <button
              type="button"
              onClick={handleCopyQuote}
              className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded border border-slate-200"
              title="Copy Quotation"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-blue-950" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
