import React, { useState, useMemo } from 'react';
import { Search, Filter, LayoutGrid, List, Package, X } from 'lucide-react';
import ProductCard from './ProductCard';

export default function ProductCatalog({ 
  products = [], 
  isLoading = false, 
  onQuickView, 
  onSelectProduct, 
  onDirectOrder,
  activeCategoryFilter = 'All'
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(activeCategoryFilter);
  const [sortBy, setSortBy] = useState('id-asc');
  const [viewMode, setViewMode] = useState('grid');

  const categories = useMemo(() => {
    const set = new Set(['All']);
    products.forEach(p => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matchTitle = p.title?.toLowerCase().includes(q);
          const matchDesc = p.description?.toLowerCase().includes(q);
          const matchActive = p.activeIngredient?.toLowerCase().includes(q);
          const matchId = String(p.id).includes(q);
          if (!matchTitle && !matchDesc && !matchActive && !matchId) {
            return false;
          }
        }
        if (selectedCategory !== 'All' && p.category !== selectedCategory) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return (a.unitPrice || 0) - (b.unitPrice || 0);
        if (sortBy === 'price-desc') return (b.unitPrice || 0) - (a.unitPrice || 0);
        if (sortBy === 'name-asc') return a.title.localeCompare(b.title);
        return a.id - b.id;
      });
  }, [products, searchTerm, selectedCategory, sortBy]);

  return (
    <section id="products" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-slate-50/50">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold text-blue-950 uppercase tracking-wider block mb-1">
            Product Listing
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Our Products & Formulations
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
            Select any formulation to view complete technical details, packaging sizes, or submit an order inquiry directly.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded border text-xs transition-colors ${
              viewMode === 'grid' 
                ? 'bg-white border-slate-300 text-slate-900 shadow-sm' 
                : 'bg-transparent border-transparent text-slate-500 hover:text-slate-900'
            }`}
            title="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded border text-xs transition-colors ${
              viewMode === 'list' 
                ? 'bg-white border-slate-300 text-slate-900 shadow-sm' 
                : 'bg-transparent border-transparent text-slate-500 hover:text-slate-900'
            }`}
            title="List View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Clean Toolbar */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm mb-8 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Box */}
          <div className="md:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search products by title, active ingredient or number (e.g. Bispyribac, Glyphosate)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-900 focus:outline-none"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="md:col-span-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 focus:bg-white focus:border-blue-900 focus:outline-none cursor-pointer"
            >
              <option value="id-asc">Sort by: Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Alphabetical (A - Z)</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none border-t border-slate-100">
          <span className="text-[11px] font-medium text-slate-400 pr-1">Category:</span>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded text-xs transition-colors whitespace-nowrap ${
                  isSelected
                    ? 'bg-blue-950 text-white font-medium'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
              onSelectProduct={onSelectProduct}
              onDirectOrder={onDirectOrder}
            />
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-3">
          {filteredProducts.map((product) => (
            <div 
              key={product.id}
              className="bg-white p-4 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div 
                  onClick={() => onSelectProduct(product)}
                  className="w-16 h-16 rounded bg-slate-50 p-2 flex items-center justify-center flex-shrink-0 cursor-pointer border border-slate-100"
                >
                  <img src={product.imagePath} alt="" className="h-full object-contain" />
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-blue-950 uppercase tracking-wider">
                    {product.category}
                  </span>
                  <h3 
                    onClick={() => onSelectProduct(product)}
                    className="font-bold text-sm sm:text-base text-slate-900 hover:text-blue-900 cursor-pointer transition-colors"
                  >
                    {product.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-1">
                    {product.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                <div className="text-left sm:text-right">
                  <span className="text-[10px] text-slate-400 block uppercase">Price</span>
                  <div className="text-sm font-bold text-slate-900">
                    ₹{product.unitPrice} <span className="text-xs font-normal text-slate-500">/ {product.unit}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onQuickView(product)}
                    className="px-3 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
                  >
                    Quick View
                  </button>
                  <button
                    onClick={() => onSelectProduct(product)}
                    className="px-3 py-1.5 rounded bg-blue-950 hover:bg-blue-900 text-white text-xs font-medium transition-colors"
                  >
                    Details & Order
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-16 px-4 bg-white rounded-lg border border-slate-200 space-y-3">
          <Package className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-semibold text-slate-800">No products found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search query or selected category.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
            }}
            className="px-4 py-1.5 rounded bg-blue-950 text-white text-xs font-medium"
          >
            Clear Filters
          </button>
        </div>
      )}
    </section>
  );
}
