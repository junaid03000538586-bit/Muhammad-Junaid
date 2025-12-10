export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'PKR' | 'INR' | 'CAD' | 'AUD' | 'JPY';

export interface Product {
  id: string;
  name: string;
  description: string;
  estimatedPrice: number;
  currency: string;
  category: string;
  reason: string; // Why the AI recommended this
}

export interface ShoppingSession {
  query: string;
  products: Product[];
  timestamp: number;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}