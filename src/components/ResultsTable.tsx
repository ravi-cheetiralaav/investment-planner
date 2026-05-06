'use client';

import { YearlyData } from '@/lib/types';
import { formatINRCompact } from '@/lib/formatting';

interface Props {
  yearlyData: YearlyData[];
  view: 'annual' | 'monthly';
}

export default function ResultsTable({ yearlyData, view }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800">Year-by-Year Breakdown</h3>
        {view === 'monthly' && (
          <p className="text-xs text-gray-400 mt-0.5">Monthly SIP shown for each year</p>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
              <th className="px-4 py-3 text-left sticky left-0 bg-gray-50">Year</th>
              <th className="px-4 py-3 text-right whitespace-nowrap">Monthly SIP</th>
              <th className="px-4 py-3 text-right whitespace-nowrap">Annual Invested</th>
              <th className="px-4 py-3 text-right whitespace-nowrap">Total Invested</th>
              <th className="px-4 py-3 text-right whitespace-nowrap">Portfolio Value</th>
              <th className="px-4 py-3 text-right whitespace-nowrap">Wealth Gained</th>
              <th className="px-4 py-3 text-right whitespace-nowrap">Real Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {yearlyData.map((row, idx) => {
              const isLast = idx === yearlyData.length - 1;
              return (
                <tr
                  key={row.year}
                  className={`transition-colors ${isLast ? 'bg-blue-50 font-semibold' : 'hover:bg-gray-50'}`}
                >
                  <td className={`px-4 py-3 sticky left-0 ${isLast ? 'bg-blue-50' : 'bg-white'} font-medium`}>
                    Year {row.year}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">{formatINRCompact(row.monthlySIP)}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{formatINRCompact(row.annualInvested)}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{formatINRCompact(row.totalInvested)}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-blue-700">{formatINRCompact(row.portfolioValue)}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-green-700">{formatINRCompact(row.wealthGained)}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-amber-700">{formatINRCompact(row.inflationAdjustedValue)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
