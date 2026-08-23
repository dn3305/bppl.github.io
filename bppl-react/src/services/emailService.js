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

// Open mailto: addressed to both emails
export const sendOrderViaMailto = (orderData) => {
  const { product, customer, quantity } = orderData;
  const subject = encodeURIComponent(
    `[BPPL Order] ${quantity} ${product.unit} of ${product.title} - ${customer.name || 'Customer'}`
  );
  const bodyText = encodeURIComponent(generateOrderQuotationText(orderData));
  const to = encodeURIComponent(`${OWNER_EMAIL},${SALES_EMAIL}`);
  const mailtoUrl = `mailto:${to}?subject=${subject}&body=${bodyText}`;
  window.open(mailtoUrl, '_blank');
};

// Open WhatsApp
export const sendOrderViaWhatsApp = (orderData) => {
  const invoiceText = generateOrderQuotationText(orderData);
  const encodedText = encodeURIComponent(invoiceText);
  const waUrl = `https://wa.me/${OWNER_PHONE_RAW}?text=${encodedText}`;
  window.open(waUrl, '_blank');
};
