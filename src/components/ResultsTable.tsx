'use client';

import { MonthlyData, YearlyData } from '@/lib/types';
import { formatINRCompact } from '@/lib/formatting';

interface Props {
  yearlyData: YearlyData[];
  monthlyData: MonthlyData[];
  view: 'annual' | 'monthly';
}

export default function ResultsTable({ yearlyData, monthlyData, view }: Props) {
  const isMonthly = view === 'monthly';
  const rows = isMonthly ? monthlyData : yearlyData;
  const crossoverIndex = rows.findIndex((row) => row.wealthGained >= row.totalInvested);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-slate-50 to-white">
        <h3 className="text-lg font-semibold text-gray-800">{isMonthly ? 'Month-by-Month Breakdown' : 'Year-by-Year Breakdown'}</h3>
        <p className="text-xs text-gray-500 mt-0.5">
          {isMonthly ? 'Each row shows one month progression' : 'Yearly snapshot across your investment horizon'}
        </p>
      </div>

      <div className="md:hidden space-y-3 p-4 bg-slate-50/40">
        {rows.map((row, idx) => {
          const isLast = idx === rows.length - 1;
          const isCrossover = idx === crossoverIndex;
          const periodLabel = isMonthly
            ? `M${(row as MonthlyData).month} (Y${(row as MonthlyData).year})`
            : `${(row as YearlyData).year}`;
          const monthlySIP = row.monthlySIP;
          const investedValue = row.totalInvested;
          const portfolioValue = row.portfolioValue;
          const wealthGained = row.wealthGained;
          const realValue = row.inflationAdjustedValue;

          return (
            <article
              key={isMonthly ? `m-${(row as MonthlyData).month}` : `y-${(row as YearlyData).year}`}
              className={`rounded-xl border p-4 shadow-sm ${
                isCrossover
                  ? 'border-fuchsia-300 bg-gradient-to-r from-fuchsia-50 to-violet-50'
                  : isLast
                    ? 'border-blue-200 bg-blue-50/70'
                    : 'border-gray-100 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-slate-800 rounded-full bg-indigo-100 px-2.5 py-1 text-indigo-700">
                  {periodLabel}
                </p>
                {isLast && (
                  <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-semibold text-white uppercase tracking-wide">
                    Final
                  </span>
                )}
                {isCrossover && (
                  <span className="rounded-full bg-fuchsia-600 px-2 py-0.5 text-[10px] font-semibold text-white uppercase tracking-wide">
                    Crossover
                  </span>
                )}
              </div>
              <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
                <div>
                  <dt className="text-gray-500">Monthly SIP</dt>
                  <dd className="mt-0.5 font-medium text-gray-800 tabular-nums">{formatINRCompact(monthlySIP)}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Total Invested</dt>
                  <dd className="mt-0.5 font-medium text-gray-800 tabular-nums">{formatINRCompact(investedValue)}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Portfolio Value</dt>
                  <dd className="mt-0.5 font-semibold text-blue-700 tabular-nums">{formatINRCompact(portfolioValue)}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Wealth Gained</dt>
                  <dd className="mt-0.5 font-semibold text-green-700 tabular-nums">{formatINRCompact(wealthGained)}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Real Value</dt>
                  <dd className="mt-0.5 font-semibold text-amber-700 tabular-nums">{formatINRCompact(realValue)}</dd>
                </div>
              </dl>
            </article>
          );
        })}
      </div>

      <div className="hidden md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-cyan-50 via-teal-50 to-blue-50 text-[11px] uppercase tracking-[0.08em] text-slate-700">
              <th className="px-5 py-3.5 text-left">{isMonthly ? 'Month' : 'Year'}</th>
              <th className="px-5 py-3.5 text-right whitespace-nowrap">Monthly SIP</th>
              <th className="px-5 py-3.5 text-right whitespace-nowrap">Total Invested</th>
              <th className="px-5 py-3.5 text-right whitespace-nowrap">Portfolio Value</th>
              <th className="px-5 py-3.5 text-right whitespace-nowrap">Wealth Gained</th>
              <th className="px-5 py-3.5 text-right whitespace-nowrap">Real Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row, idx) => {
              const isLast = idx === rows.length - 1;
              const isCrossover = idx === crossoverIndex;
              const periodValue = isMonthly ? `M${(row as MonthlyData).month}` : `${(row as YearlyData).year}`;

              return (
                <tr
                  key={isMonthly ? `m-${(row as MonthlyData).month}` : `y-${(row as YearlyData).year}`}
                  className={`transition-colors ${
                    isCrossover
                      ? 'bg-gradient-to-r from-fuchsia-100/70 via-violet-100/70 to-indigo-100/70'
                      : isLast
                        ? 'bg-gradient-to-r from-blue-100/70 via-indigo-100/70 to-cyan-100/70'
                        : 'odd:bg-white even:bg-slate-50/50 hover:bg-blue-50/60'
                  }`}
                >
                  <td className="px-5 py-3.5 font-semibold text-slate-800">
                    {periodValue}
                    {isCrossover && <span className="ml-2 rounded-full bg-fuchsia-600 px-2 py-0.5 text-[10px] font-semibold text-white uppercase">Crossover</span>}
                  </td>
                  <td className="px-5 py-3.5 text-right tabular-nums text-slate-700">{formatINRCompact(row.monthlySIP)}</td>
                  <td className="px-5 py-3.5 text-right tabular-nums text-slate-700">{formatINRCompact(row.totalInvested)}</td>
                  <td className="px-5 py-3.5 text-right tabular-nums font-bold text-[#21808D] bg-cyan-50/60">{formatINRCompact(row.portfolioValue)}</td>
                  <td className="px-5 py-3.5 text-right tabular-nums font-bold text-emerald-700 bg-emerald-50/70">{formatINRCompact(row.wealthGained)}</td>
                  <td className="px-5 py-3.5 text-right tabular-nums font-bold text-amber-700 bg-amber-50/80">{formatINRCompact(row.inflationAdjustedValue)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
