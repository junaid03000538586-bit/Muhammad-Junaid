import React from 'react';
import { ShoppingCart, Search, Sparkles } from 'lucide-react';

export const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="relative mb-6">
        <div className="absolute -inset-4 bg-indigo-100 rounded-full opacity-50 blur-xl animate-pulse"></div>
        <div className="relative bg-white p-6 rounded-2xl shadow-lg border border-indigo-50">
          <Sparkles className="w-12 h-12 text-indigo-600" />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Ready to go shopping?</h2>
      <p className="text-slate-500 max-w-md mx-auto mb-8">
        Describe what you're looking for, and our AI will curate a personalized list of products just for you.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
        {[
          "Camping gear for 2 people under $300",
          "Outfit for a summer garden wedding",
          "Tech starter pack for a home office"
        ].map((example, idx) => (
          <div key={idx} className="bg-white border border-slate-200 p-4 rounded-lg text-sm text-slate-600 shadow-sm opacity-75">
            "{example}"
          </div>
        ))}
      </div>
    </div>
  );
};