import React, { useState, useCallback, useEffect } from 'react';
import { ProductCard } from './components/ProductCard';
import { EmptyState } from './components/EmptyState';
import { SettingsModal } from './components/SettingsModal';
import { Product, LoadingState } from './types';
import { generateRecommendations } from './services/geminiService';
import { Search, ShoppingBag, Download, Loader2, Sparkles, Menu, X, Trash2, Mail, Phone, Settings } from 'lucide-react';

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<LoadingState>(LoadingState.IDLE);
  const [savedProducts, setSavedProducts] = useState<Product[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Initialize currency from localStorage or default to USD
  const [currency, setCurrency] = useState<string>(() => {
    return localStorage.getItem('currency') || 'USD';
  });

  const handleCurrencyChange = (newCurrency: string) => {
    setCurrency(newCurrency);
    localStorage.setItem('currency', newCurrency);
    // Optional: Clear existing results if they don't match currency, 
    // or we could assume the user will search again.
    if (products.length > 0 && products[0].currency !== newCurrency) {
      setProducts([]); // Clear to avoid currency confusion
      setStatus(LoadingState.IDLE);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setStatus(LoadingState.LOADING);
    setProducts([]); // Clear previous results while loading

    try {
      const results = await generateRecommendations(query, currency);
      setProducts(results);
      setStatus(LoadingState.SUCCESS);
    } catch (error) {
      console.error(error);
      setStatus(LoadingState.ERROR);
    }
  };

  const addToSaved = useCallback((product: Product) => {
    setSavedProducts(prev => {
      if (prev.some(p => p.id === product.id)) return prev;
      return [...prev, product];
    });
    setIsSidebarOpen(true); // Open sidebar to show feedback
  }, []);

  const removeFromSaved = useCallback((productId: string) => {
    setSavedProducts(prev => prev.filter(p => p.id !== productId));
  }, []);

  const handleDownload = () => {
    const dataStr = JSON.stringify(savedProducts, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'smart-shopping-list.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Helper to format total price correctly based on the mixed currencies in the cart (if any)
  // Note: ideally we shouldn't mix currencies, but if we do, we just sum raw numbers which isn't perfect but simple.
  const totalAmount = savedProducts.reduce((sum, p) => sum + p.estimatedPrice, 0);
  // We use the currency of the first item, or default to current currency preference
  const displayCurrency = savedProducts.length > 0 ? savedProducts[0].currency : currency;
  
  const formattedTotal = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: displayCurrency,
    maximumFractionDigits: 0
  }).format(totalAmount);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        currentCurrency={currency}
        onCurrencyChange={handleCurrencyChange}
      />

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-800 tracking-tight">SmartShopping</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              title="Settings"
            >
              <Settings className="w-6 h-6" />
            </button>

            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            >
              <ShoppingBag className="w-6 h-6" />
              {savedProducts.length > 0 && (
                <span className="absolute top-0 right-0 h-5 w-5 bg-indigo-600 text-white text-xs font-bold flex items-center justify-center rounded-full border-2 border-white">
                  {savedProducts.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Search Hero */}
<div className="max-w-3xl mx-auto mb-12 text-center">
  <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
    Welcome to <span className="text-indigo-600">Junaid's Shopping Assistant</span>
  </h1>
  
  <p className="text-lg text-slate-600 mb-8">
    AI-powered shopping helper that finds best deals and recommendations for you.
  </p>

  <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={'Search for mobile phones, laptops, or any product...'}
        className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 shadow-sm text-lg outline-none transition-all placeholder:text-slate-400"
      />
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
      <button
        type="submit"
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-md"
      >
        Find Products
      </button>
    </div>
    <p className="text-sm text-slate-500 mt-4">
      Try: "gaming laptop" • "wireless headphones" • "kitchen appliances"
    </p>
  </form>
</div>
          </h1>
          <p className="text-lg text-slate-600 mb-8">
            Our AI assistant curates the perfect products for your needs, whether it's a gift, a hobby, or a new project.
          </p><h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
  Welcome to <span className="text-indigo-600">Junaid's Shopping Assistant</span>

          
          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`E.g., 'A beginner photography kit under 1000 ${currency}'...`}
                className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 shadow-sm text-lg outline-none transition-all placeholder:text-slate-400"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6" />
              
              <button
                type="submit"
                disabled={status === LoadingState.LOADING || !query.trim()}
                className="absolute right-2 top-2 bottom-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {status === LoadingState.LOADING ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate
                  </>
                )}
              </button>
            </div>
            <div className="mt-2 text-xs text-slate-400">
              Results will be in <span className="font-semibold text-slate-600">{currency}</span>
            </div>
          </form>
        </div>

        {/* Results Area */}
        {status === LoadingState.ERROR && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg text-center border border-red-200 mb-8">
            Oops! Something went wrong while fetching recommendations. Please try again.
          </div>
        )}

        {status === LoadingState.LOADING && (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
             {[...Array(3)].map((_, i) => (
               <div key={i} className="h-96 bg-slate-200 rounded-xl"></div>
             ))}
           </div>
        )}

        {products.length > 0 && status === LoadingState.SUCCESS && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Top Recommendations</h2>
              <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                {products.length} items found
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addToSaved}
                  isAdded={savedProducts.some(p => p.id === product.id)}
                />
              ))}
            </div>
          </div>
        )}

        {status === LoadingState.IDLE && products.length === 0 && <EmptyState />}
      </main>

      {/* Footer with Contact Info */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            
            <div className="flex items-center space-x-2">
              <div className="bg-slate-100 p-1.5 rounded-lg">
                <ShoppingBag className="w-4 h-4 text-slate-600" />
              </div>
              <span className="text-lg font-bold text-slate-700">SmartShopping</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-sm font-medium">
              <a href="mailto:junaid03000538586@gmail.com" className="flex items-center text-slate-600 hover:text-indigo-600 transition-colors group">
                <div className="p-2 bg-slate-50 rounded-full group-hover:bg-indigo-50 border border-slate-100 group-hover:border-indigo-100 mr-3 transition-colors">
                  <Mail className="w-4 h-4 text-slate-500 group-hover:text-indigo-600" />
                </div>
                <span className="hidden sm:inline">Email: </span>
                <span className="sm:ml-1">junaid03000538586@gmail.com</span>
              </a>
              
              <a href="tel:03097047943" className="flex items-center text-slate-600 hover:text-indigo-600 transition-colors group">
                <div className="p-2 bg-slate-50 rounded-full group-hover:bg-indigo-50 border border-slate-100 group-hover:border-indigo-100 mr-3 transition-colors">
                  <Phone className="w-4 h-4 text-slate-500 group-hover:text-indigo-600" />
                </div>
                <span className="hidden sm:inline">Phone: </span>
                <span className="sm:ml-1">03097047943</span>
              </a>
            </div>

          </div>
          
          <div className="mt-8 pt-8 border-t border-slate-100 text-center text-slate-400 text-xs">
            © {new Date().getFullYear()} SmartShopping. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Shopping List Sidebar (Drawer) */}
      <div className={`fixed inset-0 z-50 transform ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out`}>
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>
        <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl flex flex-col">
          
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white">
            <h2 className="text-xl font-bold text-slate-800 flex items-center">
              <ShoppingBag className="w-5 h-5 mr-2 text-indigo-600" />
              Your List
              <span className="ml-2 bg-indigo-100 text-indigo-700 text-xs py-0.5 px-2 rounded-full">
                {savedProducts.length}
              </span>
            </h2>
            <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50">
            {savedProducts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-500">
                <ShoppingBag className="w-12 h-12 mb-3 text-slate-300" />
                <p>Your list is empty.</p>
                <p className="text-sm">Start adding products from your search results!</p>
              </div>
            ) : (
              savedProducts.map(product => (
                <div key={product.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex gap-4">
                  <div className="h-16 w-16 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img 
                      src={`https://picsum.photos/400/300?random=${product.name.length + product.category.length}`} 
                      alt={product.name} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-slate-800 truncate">{product.name}</h4>
                    <p className="text-sm text-emerald-600 font-medium">
                       {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: product.currency,
                          maximumFractionDigits: 0
                        }).format(product.estimatedPrice)}
                    </p>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">{product.category}</p>
                  </div>
                  <button 
                    onClick={() => removeFromSaved(product.id)}
                    className="text-slate-400 hover:text-red-500 transition-colors p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {savedProducts.length > 0 && (
            <div className="p-5 border-t border-slate-100 bg-white">
              <div className="flex justify-between items-center mb-4">
                <span className="text-slate-600">Total Est.</span>
                <span className="text-2xl font-bold text-slate-900">
                  {formattedTotal}
                </span>
              </div>
              <button 
                onClick={handleDownload}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 px-4 rounded-xl font-medium flex items-center justify-center transition-all shadow-lg shadow-slate-200"
              >
                <Download className="w-5 h-5 mr-2" />
                Download List (JSON)
              </button>
            </div>
          )}
        </div>
      </div>

    </div
  );
};

export default App;