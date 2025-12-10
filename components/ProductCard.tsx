import React from 'react';
import { Product } from '../types';
import { ShoppingBag, Tag, DollarSign, Info, Shirt, Sparkles, Smartphone, Home, Activity, Briefcase } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  isAdded?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, isAdded = false }) => {
  // Generate a deterministic image URL based on the product name length to keep it consistent during re-renders but varied across products
  const seed = product.name.length + product.category.length;
  const imageUrl = `https://picsum.photos/400/300?random=${seed}`;

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: product.currency,
    maximumFractionDigits: 0
  }).format(product.estimatedPrice);

  const getCategoryIcon = (category: string) => {
    const lower = category.toLowerCase();
    if (lower.includes('cloth') || lower.includes('fashion') || lower.includes('wear') || lower.includes('shirt') || lower.includes('pant') || lower.includes('dress') || lower.includes('outfit')) return <Shirt className="w-3 h-3" />;
    if (lower.includes('cosmetic') || lower.includes('beauty') || lower.includes('skin') || lower.includes('makeup') || lower.includes('hair')) return <Sparkles className="w-3 h-3" />;
    if (lower.includes('tech') || lower.includes('phone') || lower.includes('electronic') || lower.includes('laptop') || lower.includes('gadget')) return <Smartphone className="w-3 h-3" />;
    if (lower.includes('home') || lower.includes('decor') || lower.includes('furniture') || lower.includes('kitchen')) return <Home className="w-3 h-3" />;
    if (lower.includes('sport') || lower.includes('fitness') || lower.includes('gym')) return <Activity className="w-3 h-3" />;
    if (lower.includes('work') || lower.includes('office') || lower.includes('business')) return <Briefcase className="w-3 h-3" />;
    
    return <Tag className="w-3 h-3" />;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col h-full group">
      <div className="relative overflow-hidden h-48 bg-slate-100">
        <img 
          src={imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1 mr-2">
            <h3 className="text-lg font-bold text-slate-800 leading-tight line-clamp-2 mb-2">{product.name}</h3>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
              {getCategoryIcon(product.category)}
              <span className="ml-1.5 capitalize">{product.category}</span>
            </span>
          </div>
          <span className="flex items-center text-emerald-600 font-bold ml-1 bg-emerald-50 px-2 py-1 rounded text-sm whitespace-nowrap self-start">
            {formattedPrice}
          </span>
        </div>

        <p className="text-slate-600 text-sm mb-4 line-clamp-3 flex-1 mt-2">
          {product.description}
        </p>

        <div className="bg-indigo-50 p-3 rounded-lg mb-4">
          <p className="text-xs text-indigo-800 flex items-start">
            <Info className="w-3 h-3 mr-1.5 mt-0.5 flex-shrink-0" />
            <span className="italic">{product.reason}</span>
          </p>
        </div>

        <button
          onClick={() => onAddToCart && onAddToCart(product)}
          disabled={isAdded}
          className={`w-full py-2.5 px-4 rounded-lg flex items-center justify-center font-medium transition-colors ${
            isAdded 
              ? 'bg-slate-100 text-slate-400 cursor-default' 
              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow-indigo-200'
          }`}
        >
          {isAdded ? (
            <>
              <Tag className="w-4 h-4 mr-2" />
              Saved to List
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4 mr-2" />
              Add to List
            </>
          )}
        </button>
      </div>
    </div>
  );
};