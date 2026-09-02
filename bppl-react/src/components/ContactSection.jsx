import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { OWNER_EMAIL, OWNER_PHONE, OWNER_PHONE_RAW, OFFICE_PHONE, sendContactEmail } from '../services/emailService';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'General Product Inquiry',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert('Please provide your name and phone number.');
      return;
    }

    setSending(true);
    setSendError(null);
    try {
      await sendContactEmail(formData);

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });

      setSubmitted(true);
    } catch (err) {
      setSendError(err.message);
    } finally {
      setSending(false);
    }
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`Hello BPPL, I am contacting you regarding ${formData.subject}. My name is ${formData.name || 'Customer'}.`);
    window.open(`https://wa.me/${OWNER_PHONE_RAW}?text=${text}`, '_blank');
  };

  return (
    <section id="contact" className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-bold text-blue-950 uppercase tracking-wider block mb-1">
            Contact Information
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Get in Touch & Book Appointment
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Reach out directly for wholesale orders, technical consultancy, or dealership requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

          {/* Left Column: Contact Cards (5 cols) */}
          <div className="lg:col-span-5 space-y-4">

            <div className="p-5 rounded-lg bg-white border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-950 uppercase">
                <MapPin className="w-4 h-4 text-blue-950" />
                <span>Registered Office</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                M-32/B, 4 TH FLOOR, ABUL FAZAL ENCLAVE PART-1,<br />
                SOUTH DELHI-110025, INDIA
              </p>
            </div>

            <div className="p-5 rounded-lg bg-white border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-950 uppercase">
                <Phone className="w-4 h-4 text-blue-950" />
                <span>Phone Numbers</span>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Sales & Appointment:</span>
                  <a href={`tel:${OWNER_PHONE.replace(/\s+/g, '')}`} className="font-semibold text-blue-950 hover:underline">
                    {OWNER_PHONE}
                  </a>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Office Desk:</span>
                  <a href={`tel:${OFFICE_PHONE}`} className="text-slate-700 hover:underline">
                    {OFFICE_PHONE}
                  </a>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-lg bg-white border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-950 uppercase">
                <Mail className="w-4 h-4 text-blue-950" />
                <span>Email Addresses</span>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Direct Inquiries:</span>
                  <a href={`mailto:${OWNER_EMAIL}`} className="font-semibold text-blue-950 hover:underline">
                    {OWNER_EMAIL}
                  </a>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Corporate:</span>
                  <a href="mailto:sale@bharatpetchem.com" className="text-slate-700 hover:underline">
                    sale@bharatpetchem.com
                  </a>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-white border border-slate-200 flex items-center gap-3 text-xs text-slate-600">
              <Clock className="w-4 h-4 text-blue-950 flex-shrink-0" />
              <span>24 hours online support for our customers.</span>
            </div>

          </div>

          {/* Right Column: Clean Form (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-lg bg-white border border-slate-200 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Send an Online Message
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Inquiry is submitted directly to <strong className="text-blue-950">{OWNER_EMAIL}</strong>
            </p>

            {submitted && (
              <div className="mb-5 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                <span>Your inquiry has been emailed to us. We'll get back to you shortly.</span>
              </div>
            )}

            {sendError && (
              <div className="mb-5 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
                {sendError} — please try again, or reach us directly.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:border-blue-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 7982845484"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:border-blue-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="name@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:border-blue-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Inquiry Topic</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-800 focus:bg-white focus:border-blue-900 focus:outline-none cursor-pointer"
                  >
                    <option value="Agro-Chemical Order Inquiry">Agro-Chemical Order (Bispyribac / Pesticides)</option>
                    <option value="Industrial Chemicals Supply">Industrial Chemicals (Anti-Scalants / Defoamers)</option>
                    <option value="Technical Advisory Consultation">Technical & Process Engineering Consultation</option>
                    <option value="General Inquiry">General Business Inquiry</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Message</label>
                <textarea
                  rows={4}
                  placeholder="Your requirement details..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-3 text-slate-900 focus:bg-white focus:border-blue-900 focus:outline-none resize-none"
                />
              </div>

              <div className="pt-1 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={sending}
                  className="flex-1 py-2.5 px-5 bg-blue-950 hover:bg-blue-900 text-white font-semibold rounded text-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{sending ? 'Sending...' : 'Send Email'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleWhatsApp}
                  className="py-2.5 px-5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded text-xs border border-slate-200 transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp</span>
                </button>
              </div>
            </form>
          </div>

        </div>

      </div>
    </section>
  );
}
