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
  labelTone?: string;
}

function Card({ label, value, sub, accent = 'bg-white', labelTone = 'text-slate-500' }: CardProps) {
  return (
    <div className={`${accent} rounded-2xl p-4 border border-slate-200/70 shadow-sm hover:shadow-md transition-shadow`}>
      <p className={`text-[11px] font-semibold uppercase tracking-[0.08em] mb-1.5 ${labelTone}`}>{label}</p>
      <p className="text-2xl font-bold text-slate-900 leading-tight">{value}</p>
      {sub && <p className="text-xs text-slate-500 mt-1.5">{sub}</p>}
    </div>
  );
}

export default function SummaryCards({ results, inputs, fxRates }: Props) {
  const { totalInvested, estimatedCorpus, wealthGained, inflationAdjustedCorpus, effectiveFirstYearSIP, finalYearSIP } = results;
  const gains = ((wealthGained / totalInvested) * 100).toFixed(1);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Card
        label="Total Invested"
        value={formatINRCompact(totalInvested)}
        accent="bg-gradient-to-br from-white to-slate-50"
      />
      <Card
        label="Estimated Corpus"
        value={formatINRCompact(estimatedCorpus)}
        accent="bg-gradient-to-br from-cyan-50 to-teal-50"
        labelTone="text-[#21808D]"
      />
      <Card
        label="Wealth Gained"
        value={formatINRCompact(wealthGained)}
        sub={`+${gains}% over investment`}
        accent="bg-gradient-to-br from-emerald-50 to-green-50"
        labelTone="text-emerald-700"
      />
      <Card
        label="Inflation-Adjusted"
        value={formatINRCompact(inflationAdjustedCorpus)}
        sub={`Real value in today's money at ${inputs.inflation}% inflation`}
        accent="bg-gradient-to-br from-amber-50 to-yellow-50"
        labelTone="text-amber-700"
      />
      {fxRates && (
        <>
          <Card
            label="Current Monthly SIP"
            value={formatINRCompact(effectiveFirstYearSIP)}
            sub={`≈ ${formatCurrency(effectiveFirstYearSIP * fxRates.USD, 'USD')} · ${formatCurrency(effectiveFirstYearSIP * fxRates.AUD, 'AUD')}`}
            accent="bg-gradient-to-br from-slate-50 to-white"
          />
          {inputs.stepUp > 0 && (
            <Card
              label={`Final Year SIP (Year ${inputs.years})`}
              value={formatINRCompact(finalYearSIP)}
              sub={`After ${inputs.stepUp}% annual step-up`}
              accent="bg-gradient-to-br from-teal-50 to-cyan-50"
              labelTone="text-[#21808D]"
            />
          )}
        </>
      )}
    </div>
  );
}
