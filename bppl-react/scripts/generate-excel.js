import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// All 23 products exactly as in the user's Excel table
const initialProducts = [
  {
    "S. NO.": 1,
    "Title": "Bispyribac S",
    "DESCRIPTION": "Bispyribac Sodium - 10% SC",
    "Category": "Herbicides",
    "QTY": "",
    "UNIT": "Litre",
    "UNIT PRICE": 1052,
    "Images": "mg2.jpeg"
  },
  {
    "S. NO.": 2,
    "Title": "Bifenthrine",
    "DESCRIPTION": "Bifenthrine - 10% EC",
    "Category": "Insecticides",
    "QTY": "",
    "UNIT": "Litre",
    "UNIT PRICE": 281,
    "Images": "mg2.jpeg"
  },
  {
    "S. NO.": 3,
    "Title": "Butachlor",
    "DESCRIPTION": "Butachlor - 50% EC",
    "Category": "Herbicides",
    "QTY": "",
    "UNIT": "Kg",
    "UNIT PRICE": 253,
    "Images": "mg2.jpeg"
  },
  {
    "S. NO.": 4,
    "Title": "Bentonite Su",
    "DESCRIPTION": "Bentonite Sulphur - 90% SG/WG",
    "Category": "Fertilizers & Nutrients",
    "QTY": "",
    "UNIT": "Kg",
    "UNIT PRICE": 72,
    "Images": "mg2.jpeg"
  },
  {
    "S. NO.": 5,
    "Title": "Cartap Hydro",
    "DESCRIPTION": "Cartap Hydrochloride - 4% GR",
    "Category": "Insecticides",
    "QTY": "",
    "UNIT": "Litre",
    "UNIT PRICE": 46,
    "Images": "mg2.jpeg"
  },
  {
    "S. NO.": 6,
    "Title": "Carbendazim",
    "DESCRIPTION": "Carbendazim - 12% + Mancozeb - 63% WP",
    "Category": "Fungicides & Bactericides",
    "QTY": "",
    "UNIT": "Kg",
    "UNIT PRICE": 319,
    "Images": "mg2.jpeg"
  },
  {
    "S. NO.": 7,
    "Title": "Chlorantrani",
    "DESCRIPTION": "Chlorantraniliprole - 0.4% GR (Ferterra)",
    "Category": "Insecticides",
    "QTY": "",
    "UNIT": "Kg",
    "UNIT PRICE": 69,
    "Images": "mg2.jpeg"
  },
  {
    "S. NO.": 8,
    "Title": "Chlorpyrifos",
    "DESCRIPTION": "Chlorpyrifos - 50% EC",
    "Category": "Insecticides",
    "QTY": "",
    "UNIT": "Litre",
    "UNIT PRICE": 347,
    "Images": "chlorpyrifos.jpeg"
  },
  {
    "S. NO.": 9,
    "Title": "Chlorpyrifos",
    "DESCRIPTION": "Chlorpyrifos 50% + Cypermethrine - 5% EC",
    "Category": "Insecticides",
    "QTY": "",
    "UNIT": "Litre",
    "UNIT PRICE": 402,
    "Images": "chlorpyrifos.jpeg"
  },
  {
    "S. NO.": 10,
    "Title": "Chlorantrani",
    "DESCRIPTION": "Chlorantraniliprole 18.5% SC",
    "Category": "Insecticides",
    "QTY": "",
    "UNIT": "Litre",
    "UNIT PRICE": 3317,
    "Images": "mg2.jpeg"
  },
  {
    "S. NO.": 11,
    "Title": "Dinotefuran",
    "DESCRIPTION": "Dinotefuran - 20% SG",
    "Category": "Insecticides",
    "QTY": "",
    "UNIT": "Kg",
    "UNIT PRICE": 1095,
    "Images": "mg2.jpeg"
  },
  {
    "S. NO.": 12,
    "Title": "Fipronil - 0.",
    "DESCRIPTION": "Fipronil - 0.3% GR",
    "Category": "Insecticides",
    "QTY": "",
    "UNIT": "Kg",
    "UNIT PRICE": 47,
    "Images": "mg2.jpeg"
  },
  {
    "S. NO.": 13,
    "Title": "Gibberalic A",
    "DESCRIPTION": "Gibberalic Acid - 0.001% L",
    "Category": "Plant Growth Regulators",
    "QTY": "",
    "UNIT": "Litre",
    "UNIT PRICE": 161,
    "Images": "mg2.jpeg"
  },
  {
    "S. NO.": 14,
    "Title": "Imidacloprid",
    "DESCRIPTION": "Imidacloprid - 17.8% SL",
    "Category": "Insecticides",
    "QTY": "",
    "UNIT": "Litre",
    "UNIT PRICE": 484,
    "Images": "mg2.jpeg"
  },
  {
    "S. NO.": 15,
    "Title": "Pretilachlor",
    "DESCRIPTION": "Pretilachlor - 50% EC",
    "Category": "Herbicides",
    "QTY": "",
    "UNIT": "Litre",
    "UNIT PRICE": 259,
    "Images": "mg2.jpeg"
  },
  {
    "S. NO.": 16,
    "Title": "Pendimethali",
    "DESCRIPTION": "Pendimethalin - 30% EC",
    "Category": "Herbicides",
    "QTY": "",
    "UNIT": "Litre",
    "UNIT PRICE": 264,
    "Images": "mg2.jpeg"
  },
  {
    "S. NO.": 17,
    "Title": "Streptomycin",
    "DESCRIPTION": "Streptomycine Sulphate-90% + Tetracycline Hydrochloride 10% SP",
    "Category": "Fungicides & Bactericides",
    "QTY": "",
    "UNIT": "Kg",
    "UNIT PRICE": 3317,
    "Images": "mg2.jpeg"
  },
  {
    "S. NO.": 18,
    "Title": "Sulphur Dust",
    "DESCRIPTION": "Sulphur Dust (yellow)",
    "Category": "Fungicides & Bactericides",
    "QTY": "",
    "UNIT": "Kg",
    "UNIT PRICE": 49,
    "Images": "mg2.jpeg"
  },
  {
    "S. NO.": 19,
    "Title": "Thiamethoxam",
    "DESCRIPTION": "Thiamethoxam - 25% WG/SG (Actara)",
    "Category": "Insecticides",
    "QTY": "",
    "UNIT": "Kg",
    "UNIT PRICE": 457,
    "Images": "mg2.jpeg"
  },
  {
    "S. NO.": 20,
    "Title": "Thiamethoxam",
    "DESCRIPTION": "Thiamethoxam - 1% + Chlorantraniliprole - 0.5% GR",
    "Category": "Insecticides",
    "QTY": "",
    "UNIT": "Kg",
    "UNIT PRICE": 167,
    "Images": "mg2.jpeg"
  },
  {
    "S. NO.": 21,
    "Title": "NPK 00:52:34",
    "DESCRIPTION": "NPK 00:52:34 100% Water Soluble Fertilizer",
    "Category": "Fertilizers & Nutrients",
    "QTY": "",
    "UNIT": "Kg",
    "UNIT PRICE": 193,
    "Images": "mg2.jpeg"
  },
  {
    "S. NO.": 22,
    "Title": "Zinc Sulphat",
    "DESCRIPTION": "Zinc Sulphate Mono - 33%",
    "Category": "Fertilizers & Nutrients",
    "QTY": "",
    "UNIT": "Kg",
    "UNIT PRICE": 69,
    "Images": "mg2.jpeg"
  },
  {
    "S. NO.": 23,
    "Title": "Zinc 33% + S",
    "DESCRIPTION": "Zinc 33% + Sulphur 15%",
    "Category": "Fertilizers & Nutrients",
    "QTY": "",
    "UNIT": "Kg",
    "UNIT PRICE": 63,
    "Images": "mg2.jpeg"
  }
];

const dataDir = path.join(__dirname, '..', 'public', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// 1. Write JSON
fs.writeFileSync(path.join(dataDir, 'products.json'), JSON.stringify(initialProducts, null, 2), 'utf-8');

// 2. Write CSV
const csvHeaders = ["S. NO.", "Title", "DESCRIPTION", "Category", "QTY", "UNIT", "UNIT PRICE", "Images"];
const csvRows = [csvHeaders.join(",")];
initialProducts.forEach(p => {
  const row = [
    p["S. NO."],
    `"${p.Title.replace(/"/g, '""')}"`,
    `"${p.DESCRIPTION.replace(/"/g, '""')}"`,
    `"${p.Category || ''}"`,
    `"${p.QTY || ''}"`,
    `"${p.UNIT || ''}"`,
    p["UNIT PRICE"],
    `"${p.Images || ''}"`
  ];
  csvRows.push(row.join(","));
});
fs.writeFileSync(path.join(dataDir, 'products.csv'), csvRows.join("\n"), 'utf-8');

// 3. Write Excel (.xlsx)
const worksheet = XLSX.utils.json_to_sheet(initialProducts);
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
XLSX.writeFile(workbook, path.join(dataDir, 'products.xlsx'));

console.log("Successfully generated all 23 products in products.xlsx, products.json, and products.csv!");
