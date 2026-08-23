import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ProductCatalog from './components/ProductCatalog';
import ProductDetailPage from './components/ProductDetailPage';
import QuickViewModal from './components/QuickViewModal';
import OrderModal from './components/OrderModal';
import AdminModal from './components/AdminModal';
import ServicesSection from './components/ServicesSection';
import TechnicalSection from './components/TechnicalSection';
import AboutSection from './components/AboutSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import { loadProductsData } from './services/excelService';

export default function App() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('All');
  
  const [orderModalData, setOrderModalData] = useState({
    isOpen: false,
    product: null,
    initialQuantity: 1
  });

  useEffect(() => {
    fetchInitialProducts();
  }, []);

  const fetchInitialProducts = async () => {
    setIsLoading(true);
    try {
      const data = await loadProductsData();
      if (data && data.length > 0) {
        setProducts(data);
      }
    } catch (err) {
      console.error('Error reading product data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToCatalog = () => {
    setSelectedProduct(null);
    setActiveTab('products');
    setTimeout(() => {
      const el = document.getElementById('products');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const handleDirectOrder = (product, qty = 1) => {
    setOrderModalData({
      isOpen: true,
      product,
      initialQuantity: qty
    });
  };

  const handleCategoryJump = (category) => {
    setSelectedProduct(null);
    setActiveCategoryFilter(category);
    setActiveTab('products');
    const el = document.getElementById('products');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col antialiased">
      {/* Clean Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (selectedProduct) setSelectedProduct(null);
          setActiveTab(tab);
        }}
        selectedProduct={selectedProduct}
        onBackToCatalog={handleBackToCatalog}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {selectedProduct ? (
          <ProductDetailPage
            product={selectedProduct}
            allProducts={products}
            onBack={handleBackToCatalog}
            onSelectProduct={handleSelectProduct}
          />
        ) : (
          <>
            {/* Hero Section */}
            <HeroSection
              onExploreProducts={() => {
                const el = document.getElementById('products');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onContactClick={() => {
                const el = document.getElementById('contact');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* About Section */}
            <AboutSection />

            {/* Core Services */}
            <ServicesSection
              onSelectCategory={handleCategoryJump}
            />

            {/* Technical Consultancy Section */}
            <TechnicalSection
              onOpenContact={() => {
                const el = document.getElementById('contact');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Clean Product Listing */}
            <ProductCatalog
              products={products}
              isLoading={isLoading}
              onQuickView={(prod) => setQuickViewProduct(prod)}
              onSelectProduct={handleSelectProduct}
              onDirectOrder={(prod) => handleDirectOrder(prod, 1)}
              activeCategoryFilter={activeCategoryFilter}
            />

            {/* Contact Section */}
            <ContactSection />
          </>
        )}
      </main>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onOpenFullPage={(prod) => {
            setQuickViewProduct(null);
            handleSelectProduct(prod);
          }}
          onOpenOrderModal={(prod, qty) => {
            setQuickViewProduct(null);
            handleDirectOrder(prod, qty);
          }}
        />
      )}

      {/* Order Modal */}
      {orderModalData.isOpen && (
        <OrderModal
          product={orderModalData.product}
          initialQuantity={orderModalData.initialQuantity}
          onClose={() => setOrderModalData({ isOpen: false, product: null, initialQuantity: 1 })}
        />
      )}

      {/* Discreet Admin Portal Modal */}
      {isAdminOpen && (
        <AdminModal
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
          products={products}
          onProductsUpdated={(updated) => setProducts(updated)}
        />
      )}

      {/* Footer with discreet Admin button */}
      <Footer
        onNavClick={(id) => {
          if (selectedProduct) setSelectedProduct(null);
          setActiveTab(id);
          const el = document.getElementById(id);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />
    </div>
  );
}
