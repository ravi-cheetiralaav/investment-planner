import { FXRates } from './types';

const FX_CACHE_KEY = 'sip_fx_rates';

// 1st: fxratesapi.com — EUR base is free (no key needed); compute INR cross-rates
const FXRATES_URL = 'https://api.fxratesapi.com/latest?currencies=INR,USD,AUD,EUR';
// 2nd: open.er-api.com — free, no key, CORS-friendly, INR base
const ER_API_URL = 'https://open.er-api.com/v6/latest/INR';
// 3rd: fawazahmed0/currency-api on jsDelivr CDN — always free, no key
const JSDELIVR_URL =
  'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/inr.json';

// Approximate fallback rates (updated periodically). Used only when all live APIs and
// localStorage cache are unavailable. Rates labelled "approx" in the UI.
const FALLBACK_RATES: FXRates = {
  USD: 0.01193, // ~₹1 ≈ $0.012 (approx mid-2025)
  AUD: 0.0186,  // ~₹1 ≈ A$0.019 (approx mid-2025)
  EUR: 0.01098, // ~₹1 ≈ €0.011 (approx mid-2025)
  updatedAt: 'approx (offline)',
  source: 'fallback',
};

async function tryFxRatesApi(): Promise<FXRates | null> {
  try {
    const res = await fetch(FXRATES_URL, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    // Response is EUR-based: { rates: { INR: 90.x, USD: 1.0x, AUD: 1.6x } }
    const inrPerEur = data?.rates?.INR;
    const usdPerEur = data?.rates?.USD;
    const audPerEur = data?.rates?.AUD;
    if (!inrPerEur || !usdPerEur || !audPerEur) return null;
    return {
      USD: usdPerEur / inrPerEur,   // USD per 1 INR
      AUD: audPerEur / inrPerEur,   // AUD per 1 INR
      EUR: 1 / inrPerEur,           // EUR per 1 INR (EUR is base)
      updatedAt: new Date().toLocaleString('en-IN'),
      source: 'live',
    };
  } catch {
    return null;
  }
}

async function tryErApi(): Promise<FXRates | null> {
  try {
    const res = await fetch(ER_API_URL, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data?.rates?.USD || !data?.rates?.AUD) return null;
    return {
      USD: data.rates.USD,
      AUD: data.rates.AUD,
      EUR: data.rates.EUR ?? FALLBACK_RATES.EUR,
      updatedAt: new Date().toLocaleString('en-IN'),
      source: 'live',
    };
  } catch {
    return null;
  }
}

async function tryJsDelivr(): Promise<FXRates | null> {
  try {
    const res = await fetch(JSDELIVR_URL, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    // Response shape: { inr: { usd: 0.012, aud: 0.019, ... } }
    const inr = data?.inr;
    if (!inr?.usd || !inr?.aud) return null;
    return {
      USD: inr.usd,
      AUD: inr.aud,
      EUR: inr.eur ?? FALLBACK_RATES.EUR,
      updatedAt: new Date().toLocaleString('en-IN'),
      source: 'fallback',
    };
  } catch {
    return null;
  }
}

export async function fetchFXRates(): Promise<FXRates | null> {
  // 1. Try fxratesapi.com (EUR base, free — compute INR cross-rates)
  const fxrates = await tryFxRatesApi();
  if (fxrates) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(FX_CACHE_KEY, JSON.stringify(fxrates));
    }
    return fxrates;
  }

  // 2. Try open.er-api.com (INR base, free)
  const erapi = await tryErApi();
  if (erapi) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(FX_CACHE_KEY, JSON.stringify(erapi));
    }
    return erapi;
  }

  // 3. Try jsDelivr CDN mirror
  const jsdelivr = await tryJsDelivr();
  if (jsdelivr) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(FX_CACHE_KEY, JSON.stringify(jsdelivr));
    }
    return jsdelivr;
  }

  // 4. Fall back to localStorage cache
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(FX_CACHE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as FXRates;
        return { ...FALLBACK_RATES, ...parsed, EUR: parsed.EUR ?? FALLBACK_RATES.EUR, source: 'cached' };
      } catch {
        // ignore corrupt cache
      }
    }
  }

  // 5. Last resort: hardcoded approximate rates
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


