import React from 'react';
import { X, Check } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCurrency: string;
  onCurrencyChange: (currency: string) => void;
}

const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'PKR', name: 'Pakistani Rupee', symbol: 'Rs' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'dh' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: 'SR' },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, currentCurrency, onCurrencyChange }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="font-bold text-slate-800">Settings</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-200 text-slate-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-5">
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Preferred Currency
          </label>
          <div className="grid grid-cols-1 gap-2 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            {CURRENCIES.map((currency) => (
              <button
                key={currency.code}
                onClick={() => {
                  onCurrencyChange(currency.code);
                  onClose();
                }}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                  currentCurrency === currency.code
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm'
                    : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-white border border-slate-200 text-sm font-bold shadow-sm">
                    {currency.symbol}
                  </span>
                  <div className="text-left">
                    <div className="font-semibold">{currency.code}</div>
                    <div className="text-xs opacity-70">{currency.name}</div>
                  </div>
                </div>
                {currentCurrency === currency.code && (
                  <Check className="w-5 h-5 text-indigo-600" />
                )}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-4 text-center">
            Prices will be estimated in this currency for future searches.
          </p>
        </div>
      </div>
    </div>
  );
};