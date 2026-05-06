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
  return (
    <div className="mt-1.5">
      <p className="text-xs text-gray-500">
        ≈ {formatCurrency(usd, 'USD')} · {formatCurrency(aud, 'AUD')}
      </p>
      <p className="text-xs text-gray-400">Rates updated at {fxRates.updatedAt}</p>
    </div>
  );
}
