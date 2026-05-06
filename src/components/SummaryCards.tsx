'use client';

import { SIPResults, SIPInputs, FXRates } from '@/lib/types';
import { formatINRCompact, formatCurrency } from '@/lib/formatting';

interface Props {
  results: SIPResults;
  inputs: SIPInputs;
  fxRates: FXRates | null;
}

interface CardProps {
  label: string;
  value: string;
  sub?: string;
  accent?: string;
}

function Card({ label, value, sub, accent = 'bg-white' }: CardProps) {
  return (
    <div className={`${accent} rounded-xl p-4 border border-gray-100 shadow-sm`}>
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

export default function SummaryCards({ results, inputs, fxRates }: Props) {
  const { totalInvested, estimatedCorpus, wealthGained, inflationAdjustedCorpus, effectiveFirstYearSIP, finalYearSIP } = results;
  const gains = ((wealthGained / totalInvested) * 100).toFixed(1);

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
      <Card
        label="Total Invested"
        value={formatINRCompact(totalInvested)}
        accent="bg-white"
      />
      <Card
        label="Estimated Corpus"
        value={formatINRCompact(estimatedCorpus)}
        accent="bg-blue-50"
      />
      <Card
        label="Wealth Gained"
        value={formatINRCompact(wealthGained)}
        sub={`+${gains}% over investment`}
        accent="bg-green-50"
      />
      <Card
        label="Inflation-Adjusted"
        value={formatINRCompact(inflationAdjustedCorpus)}
        sub={`Real value in today's money at ${inputs.inflation}% inflation`}
        accent="bg-amber-50"
      />
      {fxRates && (
        <>
          <Card
            label="Current Monthly SIP"
            value={formatINRCompact(effectiveFirstYearSIP)}
            sub={`≈ ${formatCurrency(effectiveFirstYearSIP * fxRates.USD, 'USD')} · ${formatCurrency(effectiveFirstYearSIP * fxRates.AUD, 'AUD')}`}
          />
          {inputs.stepUp > 0 && (
            <Card
              label={`Final Year SIP (Year ${inputs.years})`}
              value={formatINRCompact(finalYearSIP)}
              sub={`After ${inputs.stepUp}% annual step-up`}
            />
          )}
        </>
      )}
    </div>
  );
}
