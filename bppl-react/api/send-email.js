import nodemailer from 'nodemailer';

// Duplicated from src/services/emailService.js on purpose — this file is a
// standalone Vercel serverless function and should not depend on the Vite
// frontend bundle to build correctly.
const OWNER_EMAIL = 'noornesa@bharatpetchem.com';
const SALES_EMAIL = 'sale@bharatpetchem.com';

// Recipients are fixed server-side per inquiry type — never taken from the
// request body — so this endpoint can't be used as an open mail relay.
const RECIPIENTS = {
  order: [OWNER_EMAIL, SALES_EMAIL],
  contact: [OWNER_EMAIL]
};

let transporter;
function getTransporter() {
  if (!transporter) {
    const port = Number(process.env.ZOHO_SMTP_PORT || 465);
    transporter = nodemailer.createTransport({
      host: process.env.ZOHO_SMTP_HOST || 'smtp.zoho.in',
      port,
      secure: port === 465, // 465 = implicit TLS; anything else (e.g. 587) negotiates STARTTLS
      auth: {
        user: process.env.ZOHO_SMTP_USER,
        pass: process.env.ZOHO_SMTP_PASS
      }
    });
  }
  return transporter;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { type, subject, text, replyTo } = req.body || {};

  const to = RECIPIENTS[type];
  if (!to) {
    return res.status(400).json({ error: 'Invalid or missing "type" (expected "order" or "contact")' });
  }
  if (!subject || typeof subject !== 'string' || !text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Missing subject or text' });
  }
  if (subject.length > 300 || text.length > 20000) {
    return res.status(400).json({ error: 'Payload too large' });
  }

  if (!process.env.ZOHO_SMTP_USER || !process.env.ZOHO_SMTP_PASS) {
    console.error('ZOHO_SMTP_USER / ZOHO_SMTP_PASS are not configured in the environment');
    return res.status(500).json({ error: 'Email is not configured on the server yet.' });
  }

  const cleanSubject = subject.replace(/[\r\n]+/g, ' ').trim();
  const validReplyTo = typeof replyTo === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(replyTo)
    ? replyTo
    : undefined;
  const fromAddress = process.env.ZOHO_SMTP_FROM || process.env.ZOHO_SMTP_USER;

  try {
    await getTransporter().sendMail({
      from: `"BPPL Website" <${fromAddress}>`,
      to,
      replyTo: validReplyTo,
      subject: cleanSubject,
      text
    });
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('send-email failed:', err);
    return res.status(502).json({ error: 'Failed to send email. Please try again or contact us directly.' });
  }
}
