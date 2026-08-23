# Bharat Petchem Pvt. Ltd. (BPPL) - Modern React Web Application

A modern, ultra-responsive, minimal web portal and dynamic e-catalog for **BHARAT PETCHEM PVT. LTD. (BPPL)**.

---

## Key Features

1. **Dynamic Excel Product Catalog**:
   - Mapped directly to `public/data/products.xlsx` (with fallback to `public/data/products.json`).
   - Supports live Excel upload, drag-and-drop, and copy-paste through the built-in **Excel Sync Manager**.
2. **Product Photos & Assets**:
   - Photos placed in `public/products/` (e.g. `mg2.jpeg`, `glyphosate.jpeg`, `chlorpyrifos.jpeg`, `antiscalant.jpeg`) automatically map to the `Images` column.
3. **Dedicated Standalone Product Pages & Quick View**:
   - Each product has an interactive outer card, quick view popup, and a dedicated full page with dosage/application guidelines, packaging sizes, and live quantity pricing calculations.
4. **Automated Order & Inquiry Dispatch**:
   - Customer orders are formatted into a clean quotation and sent directly to **`rajadanish31@gmail.com`**.
   - Includes instant 1-click **WhatsApp Order** to **`+91 7982845484`** and 1-click **Copy Quote** slip.
5. **Elevated Agro-Industrial Minimalism**:
   - Modern typography (`Plus Jakarta Sans` & `Outfit`), glassmorphism, responsive mobile drawer, and high-contrast dark theme.
6. **Full Business Line Preservation**:
   - Agro-Chemicals (Herbicides, Insecticides, Fertilizers)
   - Industrial Chemicals (Corrosion Inhibitors, Anti-Scalants, Defoamers)
   - Technical & Management Consultancy (Process simulation, flow assurance, plant commissioning, HSE)
   - Industrial Materials (Stainless steel, alloys, auto parts, pipes/tubes)
   - Registered Delhi Office (`M-32/B, 4th Floor, Abul Fazal Enclave Part-1, South Delhi-110025`)

---

## Excel File Columns Format

When updating `public/data/products.xlsx` or pasting spreadsheet rows, use these columns:

| S. NO. | Title | DESCRIPTION | QTY | UNIT | UNIT PRICE | Images |
|---|---|---|---|---|---|---|
| 1 | Bispyribac S | Bispyribac Sodium - 10% SC | 500 ml | Litre | 1052 | mg2.jpeg |
| 2 | Glyphosate 41% SL | Non-selective systemic herbicide | 1 Litre | Litre | 480 | glyphosate.jpeg |
| 3 | Chlorpyrifos 20% EC | Broad-spectrum organophosphate insecticide | 1 Litre | Litre | 395 | chlorpyrifos.jpeg |
| 4 | BPPL Anti-Scalant BP-200 | Multipurpose water treatment chemical | 25 Kg | Kg | 240 | antiscalant.jpeg |

---

## How to Run Locally

```bash
# 1. Navigate to the React directory
cd bppl-react

# 2. Install dependencies (if first time)
npm install

# 3. Start development server
npm run dev

# 4. Open in browser
http://localhost:5173/
```

## How to Build for Production

```bash
cd bppl-react
npm run build
```
Production bundle will be generated in `bppl-react/dist/`.
