'use client';

import { FXRates } from '@/lib/types';
import { formatCurrency } from '@/lib/formatting';

interface Props {
  amount: number;
  fxRates: FXRates | null;
  loading: boolean;
  error: boolean;
}

export default function CurrencyHint({ amount, fxRates, loading, error }: Props) {
  if (loading) {
    return <p className="text-xs text-gray-400 mt-1 animate-pulse">Loading exchange rates...</p>;
  }
  if (error || !fxRates) {
    return <p className="text-xs text-amber-500 mt-1">⚠ Exchange rates unavailable</p>;
  }
  const usd = amount * fxRates.USD;
  const aud = amount * fxRates.AUD;
  const eurRate_ = fxRates.EUR && !isNaN(fxRates.EUR) ? fxRates.EUR : 0.01098;
  const eur = amount * eurRate_;
  const formatRate = (value: number, currency: 'USD' | 'AUD' | 'EUR') =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    }).format(value);
  const usdRate = formatRate(fxRates.USD, 'USD');
  const audRate = formatRate(fxRates.AUD, 'AUD');
  const eurRate = formatRate(eurRate_, 'EUR');
  const isStale = fxRates.source === 'cached';
  const isFallback = fxRates.source === 'fallback';
  return (
    <div className="mt-1.5">
      <p className="text-xs text-gray-600 flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="text-gray-500">≈</span>
        <span className="inline-flex items-center gap-1">
          <span className="rounded bg-sky-100 px-1.5 py-0.5 font-medium text-[10px] text-sky-700">USD</span>
          <span className="font-semibold text-sky-700">{formatCurrency(usd, 'USD')}</span>
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="rounded bg-emerald-100 px-1.5 py-0.5 font-medium text-[10px] text-emerald-700">AUD</span>
          <span className="font-semibold text-emerald-700">{formatCurrency(aud, 'AUD')}</span>
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="rounded bg-violet-100 px-1.5 py-0.5 font-medium text-[10px] text-violet-700">EUR</span>
          <span className="font-semibold text-violet-700">{formatCurrency(eur, 'EUR')}</span>
        </span>
        {(isStale || isFallback) && (
          <span className="ml-1 text-amber-500" title={isStale ? 'Using cached rates' : 'Using secondary rate source'}>
            {isStale ? '(cached)' : '(approx)'}
          </span>
        )}
      </p>
      <p className="text-xs text-gray-400 mt-0.5">
        <span className="text-gray-500">1 INR</span> = <span className="text-sky-700">{usdRate}</span> /{' '}
        <span className="text-emerald-700">{audRate}</span> /{' '}
        <span className="text-violet-700">{eurRate}</span>
        <span className="mx-1">•</span>
        Updated {fxRates.updatedAt}
      </p>
    </div>
  );
}
