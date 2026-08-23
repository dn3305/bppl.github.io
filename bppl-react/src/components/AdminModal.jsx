import React, { useState, useEffect, useRef } from 'react';
import {
  X, Upload, Plus, Trash2, Edit2, Save, Download,
  Image as ImageIcon, LogOut, CheckCircle2, AlertCircle,
  Search, Lock, RefreshCw, CloudUpload
} from 'lucide-react';
import {
  verifySuperAdmin,
  isSessionAuthenticated,
  logoutAdminSession,
  saveProductsData,
  parseUploadedExcel,
  exportProductsToExcel
} from '../services/excelService';
import {
  hasGitHubToken,
  saveGitHubToken,
  clearGitHubToken,
  verifyGitHubToken,
  pushProductsToGitHub
} from '../services/githubService';

export default function AdminModal({
  isOpen,
  onClose,
  products = [],
  onProductsUpdated
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Login
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Dashboard tabs: 'products' | 'add' | 'settings'
  const [activeTab, setActiveTab] = useState('products');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusMsg, setStatusMsg] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // GitHub Setup
  const [ghTokenInput, setGhTokenInput] = useState('');
  const [ghTokenSaved, setGhTokenSaved] = useState(false);
  const [ghVerifying, setGhVerifying] = useState(false);
  const [ghError, setGhError] = useState('');

  // Edit / Add Product
  const [editingId, setEditingId] = useState(null);
  const emptyFormData = {
    title: '', description: '', category: 'Herbicides',
    qty: '', unit: 'Litre', unitPrice: '', images: [],
    activeIngredient: '', dosage: '', packaging: ''
  };
  const [formData, setFormData] = useState(emptyFormData);
  const [imagesProcessing, setImagesProcessing] = useState(false);

  useEffect(() => {
    setIsAuthenticated(isSessionAuthenticated());
    setGhTokenSaved(hasGitHubToken());
  }, [isOpen]);

  if (!isOpen) return null;

  // ── AUTH ──────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setIsVerifying(true);
    const res = await verifySuperAdmin(emailInput, passwordInput);
    setIsVerifying(false);
    if (res.success) {
      setIsAuthenticated(true);
      setGhTokenSaved(hasGitHubToken());
    } else {
      setAuthError('Invalid administrator credentials.');
    }
  };

  const handleLogout = () => {
    logoutAdminSession();
    setIsAuthenticated(false);
    setEmailInput('');
    setPasswordInput('');
  };

  // ── GITHUB TOKEN SETUP ────────────────────────────────
  const handleSaveGhToken = async (e) => {
    e.preventDefault();
    if (!ghTokenInput.trim()) return;
    setGhVerifying(true);
    setGhError('');
    const res = await verifyGitHubToken(ghTokenInput.trim());
    setGhVerifying(false);
    if (res.success) {
      saveGitHubToken(ghTokenInput.trim());
      setGhTokenSaved(true);
      setGhTokenInput('');
      setStatusMsg({ type: 'success', text: 'GitHub token verified and saved! Products will now push live to your website.' });
    } else {
      setGhError(res.error);
    }
  };

  const handleClearGhToken = () => {
    if (!window.confirm('Remove the GitHub token? Admins won\'t be able to push live until it\'s re-entered.')) return;
    clearGitHubToken();
    setGhTokenSaved(false);
  };

  // ── IMAGE HANDLING (stored inline as Base64 — no upload/token needed) ──
  const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
    reader.readAsDataURL(file);
  });

  const handleImageFiles = async (fileList) => {
    const files = Array.from(fileList || []);
    if (files.length === 0) return;
    setImagesProcessing(true);
    try {
      const encoded = await Promise.all(files.map(fileToBase64));
      setFormData(prev => ({ ...prev, images: [...prev.images, ...encoded] }));
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message });
    } finally {
      setImagesProcessing(false);
    }
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  // ── EXCEL UPLOAD ──────────────────────────────────────
  const handleExcelUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsSaving(true);
    try {
      const parsed = await parseUploadedExcel(file);
      if (parsed.length === 0) throw new Error('No product rows found in file.');
      saveProductsData(parsed);
      onProductsUpdated(parsed);

      // Push to GitHub if token is set
      if (hasGitHubToken()) {
        await pushProductsToGitHub(parsed);
        setStatusMsg({ type: 'success', text: `✓ ${parsed.length} products updated and pushed live to GitHub! Site will rebuild in ~30 seconds.` });
      } else {
        setStatusMsg({ type: 'success', text: `${parsed.length} products loaded locally. Set up GitHub token in Settings to push live.` });
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: `Error: ${err.message}` });
    } finally {
      setIsSaving(false);
    }
  };

  // ── SAVE PRODUCT ──────────────────────────────────────
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.unitPrice) {
      alert('Please fill in product title and unit price.');
      return;
    }

    setIsSaving(true);
    setStatusMsg(null);

    try {
      const finalImages = formData.images.length > 0 ? formData.images : ['/products/mg2.jpeg'];
      const finalImagePath = finalImages[0];

      let updatedList = [];
      if (editingId) {
        updatedList = products.map(p =>
          p.id === editingId
            ? { ...p, title: formData.title, description: formData.description, category: formData.category, qty: formData.qty, unit: formData.unit, unitPrice: parseFloat(formData.unitPrice) || 0, activeIngredient: formData.activeIngredient, dosage: formData.dosage, packaging: formData.packaging, imagePath: finalImagePath, images: finalImages }
            : p
        );
      } else {
        const nextId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        updatedList = [...products, {
          id: nextId,
          title: formData.title,
          description: formData.description || formData.title,
          category: formData.category,
          qty: formData.qty,
          unit: formData.unit,
          unitPrice: parseFloat(formData.unitPrice) || 0,
          activeIngredient: formData.activeIngredient,
          dosage: formData.dosage,
          packaging: formData.packaging,
          imagePath: finalImagePath,
          images: finalImages,
          inStock: true
        }];
      }

      // Save locally
      saveProductsData(updatedList);
      onProductsUpdated(updatedList);

      // Push products.json to GitHub
      if (hasGitHubToken()) {
        setStatusMsg({ type: 'info', text: 'Pushing catalog update to GitHub...' });
        await pushProductsToGitHub(updatedList);
        setStatusMsg({ type: 'success', text: `✓ Product saved and pushed live! Your website will update in ~30 seconds.` });
      } else {
        setStatusMsg({ type: 'success', text: `Product saved locally. Set up GitHub token in Settings tab to push live.` });
      }

      // Reset form
      setEditingId(null);
      setFormData(emptyFormData);
      setActiveTab('products');

    } catch (err) {
      setStatusMsg({ type: 'error', text: `Failed: ${err.message}` });
    } finally {
      setIsSaving(false);
    }
  };

  const handleStartEdit = (p) => {
    setEditingId(p.id);
    setFormData({
      title: p.title, description: p.description,
      category: p.category || 'Herbicides', qty: p.qty || '',
      unit: p.unit || 'Litre', unitPrice: p.unitPrice || 0,
      images: p.images && p.images.length > 0 ? p.images : [],
      activeIngredient: p.activeIngredient || '', dosage: p.dosage || '', packaging: p.packaging || ''
    });
    setActiveTab('add');
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm(`Delete Product #${id}?`)) return;
    const filtered = products.filter(p => p.id !== id);
    setIsSaving(true);
    try {
      saveProductsData(filtered);
      onProductsUpdated(filtered);
      if (hasGitHubToken()) {
        await pushProductsToGitHub(filtered);
        setStatusMsg({ type: 'success', text: `Product deleted and site updated live!` });
      } else {
        setStatusMsg({ type: 'success', text: `Product #${id} removed locally.` });
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: `Delete failed: ${err.message}` });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePushAllNow = async () => {
    if (!hasGitHubToken()) {
      alert('Please configure the GitHub token in the Settings tab first.');
      return;
    }
    setIsSaving(true);
    try {
      await pushProductsToGitHub(products);
      setStatusMsg({ type: 'success', text: `✓ All ${products.length} products pushed live to GitHub! Site rebuilds in ~30 seconds.` });
    } catch (err) {
      setStatusMsg({ type: 'error', text: `Push failed: ${err.message}` });
    } finally {
      setIsSaving(false);
    }
  };

  const filtered = products.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(p.id).includes(searchTerm)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div
        className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto bg-white rounded-xl border border-slate-200 shadow-2xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100">
          <X className="w-5 h-5" />
        </button>

        {/* ─── LOGIN SCREEN ─────────────────────────────────── */}
        {!isAuthenticated ? (
          <div className="max-w-md mx-auto py-8 space-y-6">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-blue-950 text-white rounded-lg flex items-center justify-center mx-auto mb-3">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">BPPL Admin Portal</h2>
              <p className="text-xs text-slate-500">Authorized access only.</p>
            </div>

            {authError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {authError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Administrator Email</label>
                <input type="email" required placeholder="admin@bharatpetchem.com" value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2.5 text-slate-900 focus:bg-white focus:border-blue-900 focus:outline-none" />
              </div>
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Password</label>
                <input type="password" required placeholder="••••••••" value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2.5 text-slate-900 focus:bg-white focus:border-blue-900 focus:outline-none" />
              </div>
              <button type="submit" disabled={isVerifying}
                className="w-full py-2.5 bg-blue-950 hover:bg-blue-900 text-white font-semibold rounded text-xs transition-colors disabled:opacity-50">
                {isVerifying ? 'Verifying...' : 'Sign In'}
              </button>
            </form>
          </div>

        ) : (
          /* ─── ADMIN DASHBOARD ─────────────────────────────── */
          <div className="space-y-5">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-blue-950 bg-blue-50 px-2 py-0.5 rounded">Super Admin</span>
                {ghTokenSaved
                  ? <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> GitHub Connected</span>
                  : <span className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded flex items-center gap-1"><AlertCircle className="w-3 h-3" /> GitHub Not Set Up</span>
                }
              </div>
              <div className="flex items-center gap-2">
                <button onClick={handlePushAllNow} disabled={isSaving || !ghTokenSaved}
                  className="px-3 py-1.5 rounded bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium flex items-center gap-1.5 disabled:opacity-40">
                  <CloudUpload className="w-3.5 h-3.5" />
                  <span>Push All Live</span>
                </button>
                <button onClick={handleLogout} className="px-3 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium flex items-center gap-1.5">
                  <LogOut className="w-3.5 h-3.5" /><span>Logout</span>
                </button>
              </div>
            </div>

            {/* Status Banner */}
            {statusMsg && (
              <div className={`p-3 text-xs rounded flex items-start gap-2 ${
                statusMsg.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                : statusMsg.type === 'error' ? 'bg-red-50 border border-red-200 text-red-700'
                : 'bg-blue-50 border border-blue-200 text-blue-800'
              }`}>
                {statusMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  : statusMsg.type === 'error' ? <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  : <RefreshCw className="w-4 h-4 flex-shrink-0 mt-0.5 animate-spin" />}
                <span>{statusMsg.text}</span>
              </div>
            )}

            {/* Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs">
              {[
                { id: 'products', label: `Products (${products.length})` },
                { id: 'add', label: editingId ? `Edit #${editingId}` : '+ Add Product' },
                { id: 'settings', label: '⚙ GitHub Settings' }
              ].map(tab => (
                <button key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    if (tab.id !== 'add') { setEditingId(null); setFormData(emptyFormData); }
                  }}
                  className={`px-4 py-2 rounded font-medium transition-colors ${activeTab === tab.id ? 'bg-blue-950 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* ── TAB: PRODUCTS ────────────────────────────── */}
            {activeTab === 'products' && (
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer px-4 py-2 bg-blue-950 hover:bg-blue-900 text-white font-medium rounded flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isSaving ? 'Processing...' : 'Upload Excel (.xlsx)'}</span>
                      <input type="file" accept=".xlsx,.xls,.csv" onChange={handleExcelUpload} className="hidden" disabled={isSaving} />
                    </label>
                    <button onClick={() => exportProductsToExcel(products)}
                      className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-medium rounded flex items-center gap-1.5">
                      <Download className="w-3.5 h-3.5" /><span>Export Excel</span>
                    </button>
                  </div>
                  <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input type="text" placeholder="Search inventory..." value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded text-xs focus:outline-none" />
                  </div>
                </div>

                {!ghTokenSaved && (
                  <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span><strong>GitHub not connected.</strong> Products saved locally only. Go to <button className="underline font-semibold" onClick={() => setActiveTab('settings')}>⚙ GitHub Settings</button> to enable live publishing.</span>
                  </div>
                )}

                <div className="overflow-x-auto border border-slate-200 rounded-lg">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-semibold">
                        <th className="p-2.5 w-12">S.NO</th>
                        <th className="p-2.5 w-12">Img</th>
                        <th className="p-2.5">Title & Description</th>
                        <th className="p-2.5">Category</th>
                        <th className="p-2.5">Unit</th>
                        <th className="p-2.5">Price</th>
                        <th className="p-2.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filtered.map(p => (
                        <tr key={p.id} className="hover:bg-slate-50">
                          <td className="p-2.5 font-mono text-slate-400">#{p.id}</td>
                          <td className="p-2.5">
                            <div className="w-9 h-9 rounded bg-slate-50 border border-slate-100 p-0.5 flex items-center justify-center">
                              <img src={p.imagePath} alt="" className="h-full object-contain" onError={(e) => { e.target.src = '/products/mg2.jpeg'; }} />
                            </div>
                          </td>
                          <td className="p-2.5">
                            <div className="font-semibold text-slate-900">{p.title}</div>
                            <div className="text-[11px] text-slate-400 truncate max-w-[200px]">{p.description}</div>
                          </td>
                          <td className="p-2.5"><span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px]">{p.category}</span></td>
                          <td className="p-2.5 text-slate-500">{p.unit}</td>
                          <td className="p-2.5 font-bold text-slate-900">₹{p.unitPrice}</td>
                          <td className="p-2.5 text-right space-x-1">
                            <button onClick={() => handleStartEdit(p)} className="p-1.5 rounded text-slate-500 hover:text-blue-900 hover:bg-slate-100" title="Edit"><Edit2 className="w-3.5 h-3.5" /></button>
                            <button onClick={() => handleDeleteProduct(p.id)} className="p-1.5 rounded text-slate-400 hover:text-red-600 hover:bg-red-50" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── TAB: ADD / EDIT PRODUCT ───────────────────── */}
            {activeTab === 'add' && (
              <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-600 mb-1 font-medium">Product Title *</label>
                    <input type="text" required placeholder="e.g. Bispyribac Sodium" value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:border-blue-900 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1 font-medium">Category</label>
                    <input type="text" placeholder="e.g. Herbicides, Insecticides" value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:border-blue-900 focus:outline-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Description (DESCRIPTION column from Excel)</label>
                  <textarea rows={2} placeholder="e.g. Bispyribac Sodium - 10% SC" value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:border-blue-900 focus:outline-none resize-none" />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-600 mb-1 font-medium">Unit Price (₹) *</label>
                    <input type="number" required placeholder="1052" value={formData.unitPrice}
                      onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:border-blue-900 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1 font-medium">Unit</label>
                    <select value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:border-blue-900 focus:outline-none cursor-pointer">
                      <option>Litre</option><option>Kg</option><option>Pack</option><option>Bottle</option><option>Drum</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1 font-medium">Pack Size / QTY</label>
                    <input type="text" placeholder="e.g. 500 ml" value={formData.qty}
                      onChange={(e) => setFormData({ ...formData, qty: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:border-blue-900 focus:outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-600 mb-1 font-medium">Active Ingredient</label>
                    <input type="text" placeholder="e.g. Zinc Sulphate Mono - 33%" value={formData.activeIngredient}
                      onChange={(e) => setFormData({ ...formData, activeIngredient: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:border-blue-900 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1 font-medium">Packaging</label>
                    <input type="text" placeholder="e.g. Standard Commercial Pack" value={formData.packaging}
                      onChange={(e) => setFormData({ ...formData, packaging: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:border-blue-900 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1 font-medium">Dosage</label>
                    <input type="text" placeholder="e.g. As recommended by agricultural specialist" value={formData.dosage}
                      onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:border-blue-900 focus:outline-none" />
                  </div>
                </div>

                {/* Multi-Image Upload — stored inline as Base64, no GitHub token needed */}
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Product Images</label>

                  {formData.images.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.images.map((img, i) => (
                        <div key={i} className="relative w-16 h-16 rounded border border-slate-200 bg-white p-1 flex items-center justify-center group">
                          <img src={img} alt={`Preview ${i + 1}`} className="h-full w-full object-contain" onError={(e) => e.target.style.opacity = '0.2'} />
                          <button type="button" onClick={() => handleRemoveImage(i)}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Trash2 className="w-3 h-3" />
                          </button>
                          {i === 0 && (
                            <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-blue-950 text-white text-[9px] px-1 rounded">main</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <label className="flex items-center gap-3 border-2 border-dashed border-slate-200 hover:border-blue-900 rounded-lg px-4 py-3 cursor-pointer bg-slate-50 hover:bg-white transition-colors">
                    <ImageIcon className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="text-slate-700 font-medium text-xs block">
                        {imagesProcessing ? 'Processing images...' : formData.images.length > 0 ? 'Add more images' : 'Click to select one or more images'}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Stored directly with the product — no upload step or GitHub token required. Customers can browse all images on the product page.
                      </span>
                    </div>
                    <input type="file" accept="image/*" multiple disabled={imagesProcessing}
                      onChange={(e) => { handleImageFiles(e.target.files); e.target.value = ''; }} className="hidden" />
                  </label>
                </div>

                <div className="flex gap-3 pt-1">
                  <button type="submit" disabled={isSaving}
                    className="flex-1 py-2.5 bg-blue-950 hover:bg-blue-900 text-white font-semibold rounded text-xs transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5">
                    {isSaving
                      ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" /><span>Pushing to GitHub...</span></>
                      : <><Save className="w-3.5 h-3.5" /><span>{editingId ? 'Save Changes' : ghTokenSaved ? 'Save & Push Live' : 'Save Product'}</span></>
                    }
                  </button>
                  <button type="button" onClick={() => { setActiveTab('products'); setEditingId(null); }}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded text-xs">
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* ── TAB: GITHUB SETTINGS ─────────────────────── */}
            {activeTab === 'settings' && (
              <div className="space-y-5 text-xs max-w-2xl">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm mb-1">GitHub Live Publishing Setup</h3>
                  <p className="text-slate-500 leading-relaxed">
                    Enter a GitHub Personal Access Token with <code className="bg-slate-100 px-1 rounded">Contents: Read & Write</code> permission for the <code className="bg-slate-100 px-1 rounded">dn3305/bppl.github.io</code> repository.
                    Once saved, any product added, edited, or deleted from this panel will be pushed live to your website automatically.
                    The token is stored only in this browser — never in your code or repository.
                  </p>
                </div>

                {ghTokenSaved ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg space-y-3">
                    <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                      <CheckCircle2 className="w-4 h-4" />
                      GitHub token is configured and active
                    </div>
                    <p className="text-emerald-700">
                      All product saves will automatically push to GitHub and update your live site within ~30 seconds.
                    </p>
                    <button onClick={handleClearGhToken}
                      className="px-3 py-1.5 bg-white hover:bg-red-50 text-red-600 border border-red-200 rounded text-xs font-medium">
                      Remove Token
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSaveGhToken} className="space-y-3">
                    {ghError && (
                      <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        {ghError}
                      </div>
                    )}
                    <div>
                      <label className="block text-slate-600 mb-1 font-medium">GitHub Personal Access Token</label>
                      <input type="password" required placeholder="github_pat_..." value={ghTokenInput}
                        onChange={(e) => setGhTokenInput(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 focus:bg-white focus:border-blue-900 focus:outline-none font-mono" />
                      <p className="text-[10px] text-slate-400 mt-1">Paste your Fine-grained token. It will be verified immediately.</p>
                    </div>
                    <button type="submit" disabled={ghVerifying}
                      className="px-5 py-2 bg-blue-950 hover:bg-blue-900 text-white font-semibold rounded text-xs transition-colors disabled:opacity-50">
                      {ghVerifying ? 'Verifying token...' : 'Verify & Save Token'}
                    </button>
                  </form>
                )}

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                  <div className="font-semibold text-slate-700">How it works after setup:</div>
                  <ul className="space-y-1 text-slate-600">
                    {[
                      'Admin adds/edits a product → product catalog is committed to GitHub as products.json',
                      'Product images are stored inline (Base64) inside products.json — no separate image upload step',
                      'GitHub Pages detects the change and rebuilds the site automatically',
                      'Live website updates within ~30 seconds — visible to all customers globally',
                      'Admin can also upload an Excel sheet to bulk-replace all products at once'
                    ].map((step, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-blue-950 text-white text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
