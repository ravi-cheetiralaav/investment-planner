import { FXRates } from './types';

const FX_CACHE_KEY = 'sip_fx_rates';

// Primary: open.er-api.com — free, no key, CORS-friendly
const PRIMARY_URL = 'https://open.er-api.com/v6/latest/INR';
// Secondary: fawazahmed0/currency-api on jsDelivr CDN — always free, no key
const SECONDARY_URL =
  'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/inr.json';

// Approximate fallback rates (updated periodically). Used only when all live APIs and
// localStorage cache are unavailable. Rates labelled "approx" in the UI.
const FALLBACK_RATES: FXRates = {
  USD: 0.01193, // ~₹1 ≈ $0.012 (approx mid-2025)
  AUD: 0.0186,  // ~₹1 ≈ A$0.019 (approx mid-2025)
  updatedAt: 'approx (offline)',
  source: 'fallback',
};

async function tryPrimary(): Promise<FXRates | null> {
  try {
    const res = await fetch(PRIMARY_URL, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data?.rates?.USD || !data?.rates?.AUD) return null;
    return {
      USD: data.rates.USD,
      AUD: data.rates.AUD,
      updatedAt: new Date().toLocaleString('en-IN'),
      source: 'live',
    };
  } catch {
    return null;
  }
}

async function trySecondary(): Promise<FXRates | null> {
  try {
    const res = await fetch(SECONDARY_URL, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    // Response shape: { inr: { usd: 0.012, aud: 0.019, ... } }
    const inr = data?.inr;
    if (!inr?.usd || !inr?.aud) return null;
    return {
      USD: inr.usd,
      AUD: inr.aud,
      updatedAt: new Date().toLocaleString('en-IN'),
      source: 'fallback',
    };
  } catch {
    return null;
  }
}

export async function fetchFXRates(): Promise<FXRates | null> {
  // 1. Try primary API
  const primary = await tryPrimary();
  if (primary) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(FX_CACHE_KEY, JSON.stringify(primary));
    }
    return primary;
  }

  // 2. Try secondary API
  const secondary = await trySecondary();
  if (secondary) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(FX_CACHE_KEY, JSON.stringify(secondary));
    }
    return secondary;
  }

  // 3. Fall back to localStorage cache
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(FX_CACHE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as FXRates;
        return { ...parsed, source: 'cached' };
      } catch {
        // ignore corrupt cache
      }
    }
  }

  // 4. Last resort: hardcoded approximate rates
  return FALLBACK_RATES;
}

export function getCachedFXRates(): FXRates | null {
  if (typeof window === 'undefined') return null;
  const cached = localStorage.getItem(FX_CACHE_KEY);
  if (!cached) return null;
  try {
    return JSON.parse(cached) as FXRates;
  } catch {
    return null;
  }
}


