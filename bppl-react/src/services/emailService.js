// Order and Email handling for BPPL
export const OWNER_EMAIL = "noornesa@bharatpetchem.com";
export const SALES_EMAIL = "sale@bharatpetchem.com";
export const OWNER_PHONE = "+91 7982845484";
export const OWNER_PHONE_RAW = "917982845484";
export const OFFICE_PHONE = "+91-120-4293862";

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

export const generateOrderQuotationText = (orderData) => {
  const { product, quantity, customer, calculatedTotal } = orderData;
  
  return `========================================
BHARAT PETCHEM PVT. LTD. (BPPL)
PRODUCT ORDER & QUOTATION INQUIRY
========================================

PRODUCT DETAILS:
- Item: ${product.title} (S.No #${product.id})
- Description: ${product.description || product.title}
- Active Ingredient: ${product.activeIngredient || product.description || 'N/A'}
- Category: ${product.category || 'Agro-Chemical'}
- Packaging: ${product.packaging || product.qty || 'Standard Commercial Pack'}
- Dosage: ${product.dosage || 'As recommended by agricultural specialist'}
- Unit Price: ${formatCurrency(product.unitPrice)} per ${product.unit}
- Quantity: ${quantity} ${product.unit}
----------------------------------------
ESTIMATED TOTAL: ${formatCurrency(calculatedTotal)}
----------------------------------------

CUSTOMER & DELIVERY DETAILS:
- Full Name: ${customer.name || 'N/A'}
- Phone / WhatsApp: ${customer.phone || 'N/A'}
- Email: ${customer.email || 'N/A'}
- Company / Farm Name: ${customer.company || 'N/A'}
- Delivery Address: ${customer.address || 'N/A'}
- Pincode: ${customer.pincode || 'N/A'}
- Special Requirements: ${customer.notes || 'None'}

========================================
BHARAT PETCHEM PVT. LTD.
M-32/B, 4th Floor, Abul Fazal Enclave Part-1, South Delhi-110025
Phone: ${OWNER_PHONE} | Office: ${OFFICE_PHONE}
Email: ${OWNER_EMAIL} | ${SALES_EMAIL}
========================================`;
};

export const generateContactMessageText = (formData) => {
  return `BHARAT PETCHEM PVT. LTD. - INQUIRY

Name: ${formData.name}
Phone: ${formData.phone}
Email: ${formData.email || 'N/A'}
Inquiry Type: ${formData.subject}

Message:
${formData.message || 'No additional message.'}

Sent from BPPL Web Portal`;
};

// Sends the order inquiry through our own backend (Zoho SMTP) — actually
// delivered server-side, not dependent on the visitor having a mail client.
export const sendOrderEmail = async (orderData) => {
  const { product, quantity, customer } = orderData;
  const res = await fetch('/api/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'order',
      subject: `[BPPL Order] ${quantity} ${product.unit} of ${product.title} - ${customer.name || 'Customer'}`,
      text: generateOrderQuotationText(orderData),
      replyTo: customer.email || undefined
    })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Failed to send order (${res.status})`);
  }
  return res.json();
};

// Sends a contact-form inquiry through our own backend (Zoho SMTP).
export const sendContactEmail = async (formData) => {
  const res = await fetch('/api/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'contact',
      subject: `[BPPL Web Inquiry] ${formData.subject} - ${formData.name}`,
      text: generateContactMessageText(formData),
      replyTo: formData.email || undefined
    })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Failed to send message (${res.status})`);
  }
  return res.json();
};

// Open WhatsApp (still client-side — no backend needed for this one)
export const sendOrderViaWhatsApp = (orderData) => {
  const invoiceText = generateOrderQuotationText(orderData);
  const encodedText = encodeURIComponent(invoiceText);
  const waUrl = `https://wa.me/${OWNER_PHONE_RAW}?text=${encodedText}`;
  window.open(waUrl, '_blank');
};
