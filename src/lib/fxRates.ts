import { FXRates } from './types';

const FX_CACHE_KEY = 'sip_fx_rates';
const API_URL = 'https://api.fxratesapi.com/latest?base=INR&currencies=USD,AUD';

export async function fetchFXRates(): Promise<FXRates | null> {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('FX API failed');
    const data = await response.json();
    const rates: FXRates = {
      USD: data.rates?.USD ?? 0,
      AUD: data.rates?.AUD ?? 0,
      updatedAt: new Date().toLocaleString('en-IN'),
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem(FX_CACHE_KEY, JSON.stringify(rates));
    }
    return rates;
  } catch {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem(FX_CACHE_KEY);
      if (cached) return JSON.parse(cached);
    }
    return null;
  }
}

export function getCachedFXRates(): FXRates | null {
  if (typeof window === 'undefined') return null;
  const cached = localStorage.getItem(FX_CACHE_KEY);
  return cached ? JSON.parse(cached) : null;
}
