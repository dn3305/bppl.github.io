import React, { useState } from 'react';
import { 
  X, 
  FileSpreadsheet, 
  UploadCloud, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  FileText, 
  HelpCircle, 
  Table, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { 
  parseUploadedExcel, 
  parsePastedText, 
  downloadSampleExcel 
} from '../services/excelService';

export default function ExcelSyncModal({ 
  onClose, 
  onUpdateProducts, 
  productCount = 0 
}) {
  const [activeTab, setActiveTab] = useState('upload'); // upload | paste | guide
  const [pasteText, setPasteText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsLoading(true);
    setStatusMessage(null);
    try {
      const parsedProducts = await parseUploadedExcel(file);
      if (parsedProducts.length === 0) {
        throw new Error('No valid product rows found in the uploaded file.');
      }
      onUpdateProducts(parsedProducts);
      setStatusMessage({
        type: 'success',
        text: `Successfully imported and synchronized ${parsedProducts.length} products from ${file.name}!`
      });
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: `Error parsing Excel file: ${err.message}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasteSubmit = () => {
    if (!pasteText.trim()) {
      setStatusMessage({ type: 'error', text: 'Please paste spreadsheet table data first.' });
      return;
    }

    setIsLoading(true);
    setStatusMessage(null);
    try {
      const parsed = parsePastedText(pasteText);
      if (parsed.length === 0) {
        throw new Error('Could not parse products from pasted text.');
      }
      onUpdateProducts(parsed);
      setStatusMessage({
        type: 'success',
        text: `Successfully parsed and loaded ${parsed.length} products from pasted data!`
      });
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: `Error reading pasted data: ${err.message}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-panel rounded-3xl border border-slate-700/80 shadow-2xl p-6 sm:p-8 bg-slate-900/95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Excel Product Manager & Live Sync
            </h2>
            <p className="text-xs text-slate-400">
              Active Catalog: <span className="text-emerald-400 font-bold">{productCount} Products Loaded</span>
            </p>
          </div>
        </div>

        {/* Status Alert */}
        {statusMessage && (
          <div className={`mb-5 p-4 rounded-2xl text-xs flex items-center gap-3 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-950/90 border border-emerald-500/50 text-emerald-300'
              : 'bg-rose-950/90 border border-rose-500/50 text-rose-300'
          }`}>
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-5">
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'upload' 
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload .xlsx / .csv</span>
          </button>

          <button
            onClick={() => setActiveTab('paste')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'paste' 
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Table className="w-4 h-4" />
            <span>Paste Table Data</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'guide' 
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Format Guide</span>
          </button>
        </div>

        {/* Tab 1: Upload File */}
        {activeTab === 'upload' && (
          <div className="space-y-4">
            <label className="border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer bg-slate-950/50 hover:bg-slate-950 transition-all group">
              <UploadCloud className="w-12 h-12 text-emerald-400 group-hover:scale-110 transition-transform mb-3" />
              <span className="text-sm font-bold text-white group-hover:text-emerald-300">
                Click to browse or drop your Excel file here
              </span>
              <span className="text-xs text-slate-400 mt-1">
                Supports .xlsx, .xls, .csv with your columns (S. NO., Title, DESCRIPTION, QTY, UNIT, UNIT PRICE, Images)
              </span>
              <input
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isLoading}
              />
            </label>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400">Need a starter template?</span>
              <button
                onClick={downloadSampleExcel}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Sample Excel Template</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Paste Raw Data */}
        {activeTab === 'paste' && (
          <div className="space-y-4 text-xs">
            <p className="text-slate-400">
              Copy rows directly from Excel or Google Sheets and paste them below:
            </p>
            <textarea
              rows={6}
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              placeholder={`S. NO.\tTitle\tDESCRIPTION\tQTY\tUNIT\tUNIT PRICE\tImages\n1\tBispyribac S\tBispyribac Sodium - 10% SC\t\tLitre\t1052\tmg2.jpeg`}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3.5 text-white font-mono text-xs focus:border-emerald-500 focus:outline-none"
            />
            <button
              onClick={handlePasteSubmit}
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-transform hover:scale-[1.01]"
            >
              <Sparkles className="w-4 h-4" />
              <span>Parse and Synchronize Pasted Products</span>
            </button>
          </div>
        )}

        {/* Tab 3: Format & Folder Guide */}
        {activeTab === 'guide' && (
          <div className="space-y-4 text-xs text-slate-300">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <span>How Excel Synchronization Works</span>
              </h4>
              <p className="text-slate-400 leading-relaxed">
                1. <strong>Project Excel File</strong>: Place your primary Excel sheet at <code className="text-emerald-400 bg-slate-900 px-1.5 py-0.5 rounded">public/data/products.xlsx</code>. The website reads it dynamically on startup!
              </p>
              <p className="text-slate-400 leading-relaxed">
                2. <strong>Product Images Folder</strong>: Place your product photos in <code className="text-emerald-400 bg-slate-900 px-1.5 py-0.5 rounded">public/products/</code> (e.g. <code className="text-slate-200">mg2.jpeg</code>).
              </p>
            </div>

            <div className="space-y-1">
              <span className="font-bold text-white block">Required Excel Columns:</span>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse border border-slate-800 text-[11px]">
                  <thead>
                    <tr className="bg-slate-950 text-emerald-400 font-mono">
                      <th className="border border-slate-800 p-2">S. NO.</th>
                      <th className="border border-slate-800 p-2">Title</th>
                      <th className="border border-slate-800 p-2">DESCRIPTION</th>
                      <th className="border border-slate-800 p-2">QTY</th>
                      <th className="border border-slate-800 p-2">UNIT</th>
                      <th className="border border-slate-800 p-2">UNIT PRICE</th>
                      <th className="border border-slate-800 p-2">Images</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border border-slate-800 text-slate-400">
                      <td className="border border-slate-800 p-2">1</td>
                      <td className="border border-slate-800 p-2 font-semibold text-white">Bispyribac S</td>
                      <td className="border border-slate-800 p-2">Bispyribac Sodium - 10% SC</td>
                      <td className="border border-slate-800 p-2">500 ml</td>
                      <td className="border border-slate-800 p-2">Litre</td>
                      <td className="border border-slate-800 p-2 text-emerald-400">1052</td>
                      <td className="border border-slate-800 p-2 font-mono">mg2.jpeg</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={downloadSampleExcel}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download Sample .xlsx File</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
