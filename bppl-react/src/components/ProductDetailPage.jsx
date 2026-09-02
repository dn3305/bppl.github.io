import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Mail,
  MessageCircle,
  ChevronRight,
  ChevronLeft,
  FlaskConical,
  Shield,
  Zap,
  MapPin,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  formatCurrency,
  OWNER_EMAIL,
  SALES_EMAIL,
  OWNER_PHONE,
  sendOrderEmail,
  sendOrderViaWhatsApp
} from '../services/emailService';

export default function ProductDetailPage({
  product,
  allProducts = [],
  onBack,
  onSelectProduct
}) {
  const [quantity, setQuantity] = useState(1);
  const [orderSent, setOrderSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(null);
  // Multi-image gallery
  const [activeImgIdx, setActiveImgIdx] = useState(0);

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

  // Build image list — support multiple base64 or url images
  const imageList = (product.images && product.images.length > 0)
    ? product.images
    : [product.imagePath || '/products/mg2.jpeg'];

  const resolveImg = (src) => {
    if (!src) return '/products/mg2.jpeg';
    if (src.startsWith('data:') || src.startsWith('http') || src.startsWith('/')) return src;
    return `/products/${src}`;
  };

  const calculatedTotal = (product.unitPrice || 0) * quantity;

  const handleSendOrder = async (e) => {
    if (e) e.preventDefault();
    if (!customer.name || !customer.phone) {
      alert('Please provide your Name and Phone Number to submit the order inquiry.');
      return;
    }

    setSending(true);
    setSendError(null);
    try {
      await sendOrderEmail({ product, quantity, customer, calculatedTotal });
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      setOrderSent(true);
    } catch (err) {
      setSendError(err.message);
    } finally {
      setSending(false);
    }
  };

  const handleWhatsAppOrder = () => {
    if (!customer.name || !customer.phone) {
      alert('Please provide your Name and Phone Number.');
      return;
    }
    sendOrderViaWhatsApp({ product, quantity, customer, calculatedTotal });
  };

  const relatedProducts = allProducts
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, 3);

  const features = product.features || [
    { label: 'Quality Verified', sub: product.qualitySub || 'ISO standard formulations', icon: Award },
    { label: 'Fast Dispatch', sub: product.dispatchSub || 'Direct from Delhi depot', icon: Zap },
  ];

  const packaging = product.packaging || product.qty || 'Standard Commercial Pack';
  const dosage = product.dosage || 'As recommended by agricultural specialist';
  const activeIngredient = product.activeIngredient || product.description || '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 bg-white">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8">
        <button
          onClick={onBack}
          className="hover:text-blue-900 flex items-center gap-1 font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Products
        </button>
        <ChevronRight className="w-3 h-3 text-slate-300" />
        <span className="text-slate-400">{product.category || 'Agro-Chemicals'}</span>
        <ChevronRight className="w-3 h-3 text-slate-300" />
        <span className="text-slate-900 font-semibold truncate max-w-xs">{product.title}</span>
      </nav>

      {/* Main Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">

        {/* ─── Left: Image Gallery ────────────────────── */}
        <div className="lg:col-span-5 space-y-3">
          {/* Main Image Viewer */}
          <div className="relative rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center min-h-[340px] overflow-hidden group">
            <img
              src={resolveImg(imageList[activeImgIdx])}
              alt={product.title}
              onError={(e) => { e.target.style.display = 'none'; }}
              className="max-h-80 w-full object-contain transition-all duration-300"
            />

            {/* Gallery Arrows (only if multiple images) */}
            {imageList.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImgIdx(i => (i - 1 + imageList.length) % imageList.length)}
                  className="absolute left-2 p-1.5 rounded-full bg-white/80 border border-slate-200 text-slate-600 hover:text-blue-900 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveImgIdx(i => (i + 1) % imageList.length)}
                  className="absolute right-2 p-1.5 rounded-full bg-white/80 border border-slate-200 text-slate-600 hover:text-blue-900 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Dot indicators */}
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                  {imageList.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImgIdx(i)}
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${i === activeImgIdx ? 'bg-blue-950' : 'bg-slate-300'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Thumbnail Strip */}
          {imageList.length > 1 && (
            <div className="flex gap-2 flex-wrap">
              {imageList.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImgIdx(i)}
                  className={`w-14 h-14 rounded border-2 p-1 bg-white flex items-center justify-center transition-colors ${i === activeImgIdx ? 'border-blue-950' : 'border-slate-200 hover:border-slate-400'
                    }`}
                >
                  <img src={resolveImg(img)} alt="" className="h-full w-full object-contain" onError={(e) => e.target.style.opacity = '0.3'} />
                </button>
              ))}
            </div>
          )}

          {/* Feature Badges */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-100 rounded flex items-start gap-2">
              <Award className="w-4 h-4 text-blue-950 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-900 block">{product.feature1Label || 'Quality Verified'}</span>
                <span className="text-[11px] text-slate-500">{product.feature1Sub || 'ISO standard formulations'}</span>
              </div>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-100 rounded flex items-start gap-2">
              <Zap className="w-4 h-4 text-blue-950 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-900 block">{product.feature2Label || 'Fast Dispatch'}</span>
                <span className="text-[11px] text-slate-500">{product.feature2Sub || 'Direct from Delhi depot'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Right: Product Info + Order Form ───────── */}
        <div className="lg:col-span-7 space-y-6">

          {/* Title & Meta */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-blue-950 uppercase tracking-wider bg-slate-100 px-2.5 py-0.5 rounded">
                {product.category || 'Agro-Chemical'}
              </span>
              <span className="text-xs text-slate-400 font-mono">Item #{product.id}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
              {product.title}
            </h1>

            {activeIngredient && (
              <div className="text-xs font-semibold text-blue-900">
                Active Ingredient: {activeIngredient}
              </div>
            )}

            <p className="text-sm text-slate-600 leading-relaxed pt-0.5">
              {product.description}
            </p>
          </div>

          {/* Pricing & Quantity Box */}
          <div className="p-5 rounded-lg bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] text-slate-500 uppercase block font-medium">Unit Price</span>
                <div className="text-2xl sm:text-3xl font-bold text-slate-900">
                  {formatCurrency(product.unitPrice)}
                  <span className="text-xs font-normal text-slate-500"> / {product.unit}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-slate-600 font-medium">Quantity ({product.unit}):</span>
                <div className="flex items-center gap-2 bg-white p-1 rounded border border-slate-200">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center justify-center text-sm"
                  >-</button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-14 bg-transparent text-center font-bold text-slate-900 text-sm focus:outline-none"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center justify-center text-sm"
                  >+</button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
              <span className="text-xs text-slate-600 font-medium">Total ({quantity} {product.unit}):</span>
              <span className="text-xl font-bold text-blue-950">{formatCurrency(calculatedTotal)}</span>
            </div>
          </div>

          {/* Specifications */}
          <div className="p-4 rounded-lg border border-slate-200 text-xs space-y-2">
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-slate-700">
              <div><span className="text-slate-400">Packaging:</span> {packaging}</div>
              <div><span className="text-slate-400">Unit:</span> {product.unit}</div>
              <div className="col-span-2"><span className="text-slate-400">Dosage:</span> {dosage}</div>
              {activeIngredient && (
                <div className="col-span-2"><span className="text-slate-400">Active Ingredient:</span> {activeIngredient}</div>
              )}
            </div>
          </div>

          {/* ─── Order Form ────────────────────────────── */}
          <div className="p-6 rounded-lg bg-white border border-slate-200 shadow-sm space-y-4">
            {/* Success State */}
            {orderSent ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Order Sent Successfully!</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Your inquiry for <strong>{product.title}</strong> has been sent to our sales team

                  </p>
                  <p className="text-xs text-slate-400 mt-2">We'll get back to you within 24 hours.</p>
                </div>
                <div className="flex gap-3 justify-center pt-2">
                  <button
                    onClick={() => setOrderSent(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded"
                  >
                    Edit / Resend
                  </button>
                  <button
                    onClick={handleWhatsAppOrder}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded flex items-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    Follow up on WhatsApp
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Place Order Inquiry</h3>

                </div>

                {sendError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
                    {sendError} — please try again, or reach us directly.
                  </div>
                )}

                <form onSubmit={handleSendOrder} className="space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-600 mb-1">Your Name *</label>
                      <input type="text" required placeholder="Full Name" value={customer.name}
                        onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:border-blue-900 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-1">Phone / WhatsApp *</label>
                      <input type="tel" required placeholder="+91 7982845484" value={customer.phone}
                        onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:border-blue-900 focus:outline-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-600 mb-1">Email Address</label>
                      <input type="email" placeholder="name@domain.com" value={customer.email}
                        onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:border-blue-900 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-1">Company / Farm Name</label>
                      <input type="text" placeholder="Business Name" value={customer.company}
                        onChange={(e) => setCustomer({ ...customer, company: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:border-blue-900 focus:outline-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-slate-600 mb-1">Delivery Address</label>
                      <input type="text" placeholder="Street / Destination" value={customer.address}
                        onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:border-blue-900 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-1">Pincode</label>
                      <input type="text" placeholder="110025" value={customer.pincode}
                        onChange={(e) => setCustomer({ ...customer, pincode: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:border-blue-900 focus:outline-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-600 mb-1">Special Requirements</label>
                    <textarea rows={2} placeholder="Packaging size, delivery timeline, etc."
                      value={customer.notes}
                      onChange={(e) => setCustomer({ ...customer, notes: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:border-blue-900 focus:outline-none resize-none" />
                  </div>

                  {/* Single Clean Button */}
                  <div className="pt-1 flex flex-col sm:flex-row gap-3">
                    <button
                      type="submit"
                      disabled={sending}
                      className="flex-1 py-3 px-4 bg-blue-950 hover:bg-blue-900 text-white font-semibold text-xs rounded transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Mail className="w-4 h-4" />
                      <span>{sending ? 'Sending...' : 'Send Order'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleWhatsAppOrder}
                      className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded border border-slate-200 transition-colors flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-600" />
                      <span>WhatsApp</span>
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16 pt-10 border-t border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Related Formulations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedProducts.map(rel => (
              <div
                key={rel.id}
                onClick={() => { onSelectProduct(rel); setOrderSent(false); setActiveImgIdx(0); }}
                className="bg-white p-3 rounded border border-slate-200 hover:border-slate-300 cursor-pointer transition-colors flex items-center gap-3"
              >
                <div className="w-12 h-12 rounded bg-slate-50 p-1 flex items-center justify-center flex-shrink-0">
                  <img src={resolveImg(rel.imagePath)} alt="" className="h-full object-contain" onError={(e) => e.target.style.opacity = '0.2'} />
                </div>
                <div className="min-w-0">
                  <h4 className="font-semibold text-xs text-slate-900 truncate">{rel.title}</h4>
                  <span className="text-xs font-bold text-blue-950">₹{rel.unitPrice} / {rel.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
