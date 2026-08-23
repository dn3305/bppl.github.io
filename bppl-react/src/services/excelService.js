import * as XLSX from 'xlsx';

const STORAGE_KEY = 'bppl_products_data_v2';
const AUTH_SESSION_KEY = 'bppl_admin_auth_session';

// Irreversible cryptographic SHA-256 hashes
// No plaintext email or password exists in this codebase
const SECURE_EMAIL_HASH = "89fffcde08e8e70ca4ce30d6d103db3594f059a4f29f01dda13cbc47fcce4784";
const SECURE_PASS_HASH  = "1f77408a95c6f3d07332fbac212b159e7ce09545519d4d0d8e8c08b153a8b23d";

// Native Web Crypto SHA-256 hasher (runs in browser sandbox)
export const hashInput = async (str) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// Verify Super Admin Login against irreversible cryptographic hashes
export const verifySuperAdmin = async (inputEmail, inputPassword) => {
  const emailHash = await hashInput(inputEmail.trim().toLowerCase());
  const passHash = await hashInput(inputPassword);

  if (emailHash === SECURE_EMAIL_HASH && passHash === SECURE_PASS_HASH) {
    const sessionToken = await hashInput(Date.now().toString() + SECURE_PASS_HASH);
    sessionStorage.setItem(AUTH_SESSION_KEY, sessionToken);
    return { success: true };
  }
  return { success: false, error: 'Invalid administrator credentials.' };
};

// Check if currently authenticated in active session
export const isSessionAuthenticated = () => {
  return !!sessionStorage.getItem(AUTH_SESSION_KEY);
};

export const logoutAdminSession = () => {
  sessionStorage.removeItem(AUTH_SESSION_KEY);
};

// Normalize product columns from Excel
export const normalizeProduct = (row, index) => {
  // Already-normalized (saved by the Admin panel, or a previous normalize pass) — pass through as-is.
  // Re-running the Excel column parser below on these fields corrupts unitPrice (looks for the
  // column name "UNIT PRICE", not the field "unitPrice") and images (splits base64 data URIs on
  // the ";" in "data:image/jpeg;base64,...").
  if (Array.isArray(row.images) && typeof row.unitPrice === 'number') {
    const images = row.images.length > 0 ? row.images : ['/products/mg2.jpeg'];
    return {
      id: row.id ?? (index + 1),
      title: row.title || `Product #${row.id ?? index + 1}`,
      description: row.description || row.title || '',
      category: row.category || inferCategory(row.title || '', row.description || ''),
      qty: row.qty || '',
      unit: row.unit || 'Litre',
      unitPrice: row.unitPrice,
      images,
      imagePath: row.imagePath || images[0],
      activeIngredient: row.activeIngredient || row.description || '',
      dosage: row.dosage || 'As recommended by agricultural specialist',
      packaging: row.packaging || row.qty || 'Standard Commercial Pack'
    };
  }

  const getKey = (patterns) => {
    const keys = Object.keys(row);
    for (const pattern of patterns) {
      const match = keys.find(k => k.trim().toLowerCase() === pattern.toLowerCase());
      if (match && row[match] !== undefined && row[match] !== null) {
        return row[match];
      }
    }
    return '';
  };

  const id = Number(getKey(['S. NO.', 'S.NO.', 'S.NO', 'SNO', 'ID', 'SL NO', 'SL. NO.'])) || (index + 1);
  const title = String(getKey(['Title', 'Product Name', 'Product', 'Name', 'Item Name'])).trim() || `Product #${id}`;
  const description = String(getKey(['DESCRIPTION', 'Description', 'Desc', 'Details'])).trim() || title;
  const category = String(getKey(['Category', 'Type', 'Segment'])).trim() || inferCategory(title, description);
  const qty = String(getKey(['QTY', 'Quantity', 'Pack Size', 'Packing', 'Available Qty'])).trim();
  const unit = String(getKey(['UNIT', 'Unit', 'UOM', 'Packaging Unit'])).trim() || 'Litre';
  
  const rawPrice = getKey(['UNIT PRICE', 'Unit Price', 'Price', 'Rate', 'UNIT_PRICE']);
  const unitPrice = typeof rawPrice === 'number' ? rawPrice : (parseFloat(String(rawPrice).replace(/[^0-9.]/g, '')) || 0);
  
  const imagesRaw = String(getKey(['Images', 'Image', 'Img', 'Photo', 'Picture'])).trim();
  let imageList = [];
  if (imagesRaw) {
    imageList = imagesRaw.split(/[,;\s]+/).filter(Boolean);
  }
  
  const primaryImage = imageList.length > 0 ? imageList[0] : 'mg2.jpeg';
  const imagePath = primaryImage.startsWith('data:') || primaryImage.startsWith('http') || primaryImage.startsWith('/') 
    ? primaryImage 
    : `/products/${primaryImage}`;

  const activeIngredient = String(getKey(['Active Ingredient', 'Active', 'Technical Name'])).trim() || description;
  const dosage = String(getKey(['Dosage', 'Application', 'How to use'])).trim() || 'As recommended by agricultural specialist';
  const packaging = String(getKey(['Packaging', 'Pack Sizes', 'Pack'])).trim() || (qty ? qty : 'Standard Commercial Pack');

  return {
    id,
    title,
    description,
    category,
    qty,
    unit,
    unitPrice,
    images: imageList.length > 0 ? imageList.map(img => img.startsWith('data:') || img.startsWith('http') || img.startsWith('/') ? img : `/products/${img}`) : [imagePath],
    imagePath,
    activeIngredient,
    dosage,
    packaging
  };
};

function inferCategory(title, desc) {
  const text = `${title} ${desc}`.toLowerCase();
  if (text.includes('bispyribac') || text.includes('butachlor') || text.includes('pretilachlor') || text.includes('pendimethali') || text.includes('herbicide')) {
    return 'Herbicides';
  }
  if (text.includes('bifenthrine') || text.includes('cartap') || text.includes('chlorantrani') || text.includes('chlorpyrifos') || text.includes('dinotefuran') || text.includes('fipronil') || text.includes('imidacloprid') || text.includes('thiamethoxam') || text.includes('insecticide')) {
    return 'Insecticides';
  }
  if (text.includes('carbendazim') || text.includes('streptomycin') || text.includes('sulphur') || text.includes('fungicide') || text.includes('bactericide')) {
    return 'Fungicides & Bactericides';
  }
  if (text.includes('npk') || text.includes('zinc') || text.includes('bentonite') || text.includes('gibberalic') || text.includes('fertilizer') || text.includes('nutrient') || text.includes('growth')) {
    return 'Fertilizers & Nutrients';
  }
  if (text.includes('anti-scalant') || text.includes('defoamer') || text.includes('corrosion')) {
    return 'Industrial Chemicals';
  }
  return 'Agro Chemicals';
}

// Load products from Local Storage (Admin updates) or Excel/JSON file
export const loadProductsData = async () => {
  const localSaved = localStorage.getItem(STORAGE_KEY);
  if (localSaved) {
    try {
      const parsed = JSON.parse(localSaved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (e) {
      console.error(e);
    }
  }

  try {
    const response = await fetch('/data/products.xlsx');
    if (response.ok) {
      const buffer = await response.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      if (jsonData && jsonData.length > 0) {
        return jsonData.map((row, idx) => normalizeProduct(row, idx));
      }
    }
  } catch (err) {
    console.warn('Could not load products.xlsx, trying JSON...', err);
  }

  try {
    const jsonRes = await fetch('/data/products.json');
    if (jsonRes.ok) {
      const data = await jsonRes.json();
      return data.map((row, idx) => normalizeProduct(row, idx));
    }
  } catch (err) {
    console.warn('Could not load products.json', err);
  }

  return [];
};

export const saveProductsData = (products) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
};

export const exportProductsToExcel = (products) => {
  const rows = products.map(p => {
    const firstImage = p.images && p.images.length > 0 ? p.images[0] : 'mg2.jpeg';
    // Base64/inline images can't round-trip through a spreadsheet cell — omit them here
    const imagesCell = firstImage.startsWith('data:') ? '' : firstImage.replace('/products/', '');
    return {
      "S. NO.": p.id,
      "Title": p.title,
      "DESCRIPTION": p.description,
      "Category": p.category,
      "QTY": p.qty || '',
      "UNIT": p.unit,
      "UNIT PRICE": p.unitPrice,
      "Active Ingredient": p.activeIngredient || '',
      "Packaging": p.packaging || '',
      "Dosage": p.dosage || '',
      "Images": imagesCell
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
  XLSX.writeFile(workbook, "BPPL_Updated_Products.xlsx");
};

export const parseUploadedExcel = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rawJson = XLSX.utils.sheet_to_json(worksheet);
        const normalized = rawJson.map((row, idx) => normalizeProduct(row, idx));
        resolve(normalized);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
};
