'use client';

import { useState, useCallback } from 'react';
import { SWPInputs, SWPResults, DEFAULT_SWP_INPUTS } from '@/lib/types';
import { calculateSWP } from '@/lib/calculations';
import { formatINRCompact, formatINR } from '@/lib/formatting';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, ResponsiveContainer, ReferenceLine, Legend,
} from 'recharts';

interface Props {
  suggestedCorpus?: number; // pre-fill from SIP result
}

export default function SWPCalculator({ suggestedCorpus }: Props) {
  const [inputs, setInputs] = useState<SWPInputs>({
    ...DEFAULT_SWP_INPUTS,
    corpus: suggestedCorpus ?? DEFAULT_SWP_INPUTS.corpus,
  });
  const [results, setResults] = useState<SWPResults | null>(null);

  const handleChange = (field: keyof SWPInputs, value: number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleCalculate = useCallback(() => {
    setResults(calculateSWP(inputs));
  }, [inputs]);

  const formatY = (v: number) => {
    if (v >= 1_00_00_000) return `₹${(v / 1_00_00_000).toFixed(1)}Cr`;
    if (v >= 1_00_000) return `₹${(v / 1_00_000).toFixed(0)}L`;
    return `₹${(v / 1000).toFixed(0)}K`;
  };

  const exhaustionYear = results?.yearlyData.find(r => r.corpusExhausted)?.year;

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-base font-semibold text-slate-800 mb-4">SWP Parameters</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Corpus */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              Starting Corpus (₹)
            </label>
            <input
              type="number"
              value={inputs.corpus}
              min={100000}
              step={100000}
              onChange={e => handleChange('corpus', Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#21808D]/30 focus:border-[#21808D]"
            />
            <p className="text-xs text-slate-400 mt-1">{formatINRCompact(inputs.corpus)}</p>
          </div>

          {/* Monthly Withdrawal */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              Monthly Withdrawal (₹)
            </label>
            <input
              type="number"
              value={inputs.monthlyWithdrawal}
              min={1000}
              step={1000}
              onChange={e => handleChange('monthlyWithdrawal', Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#21808D]/30 focus:border-[#21808D]"
            />
            <p className="text-xs text-slate-400 mt-1">{formatINRCompact(inputs.monthlyWithdrawal)} / month</p>
          </div>

          {/* Expected CAGR */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              Expected Return (% p.a.)
            </label>
            <input
              type="number"
              value={inputs.cagr}
              min={0}
              max={30}
              step={0.5}
              onChange={e => handleChange('cagr', Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#21808D]/30 focus:border-[#21808D]"
            />
            <div className="flex gap-1.5 mt-1.5 flex-wrap">
              {[6, 8, 10, 12].map(v => (
                <button key={v} onClick={() => handleChange('cagr', v)}
                  className={`px-2 py-0.5 rounded text-xs font-medium transition-all ${inputs.cagr === v ? 'bg-[#21808D] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                  {v}%
                </button>
              ))}
            </div>
          </div>

          {/* Inflation */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              Inflation (% p.a.)
            </label>
            <input
              type="number"
              value={inputs.inflation}
              min={0}
              max={20}
              step={0.5}
              onChange={e => handleChange('inflation', Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#21808D]/30 focus:border-[#21808D]"
            />
          </div>

          {/* Projection Years */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              Projection Period (Years)
            </label>
            <input
              type="number"
              value={inputs.years}
              min={1}
              max={40}
              step={1}
              onChange={e => handleChange('years', Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#21808D]/30 focus:border-[#21808D]"
            />
            <div className="flex gap-1.5 mt-1.5 flex-wrap">
              {[10, 15, 20, 25, 30].map(v => (
                <button key={v} onClick={() => handleChange('years', v)}
                  className={`px-2 py-0.5 rounded text-xs font-medium transition-all ${inputs.years === v ? 'bg-[#21808D] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                  {v}Y
                </button>
              ))}
            </div>
          </div>

          {/* Calculate Button */}
          <div className="flex items-end">
            <button
              onClick={handleCalculate}
              className="w-full py-2.5 bg-gradient-to-r from-[#21808D] to-[#1a626d] text-white font-semibold rounded-lg shadow hover:shadow-md transition-all text-sm"
            >
              Calculate SWP
            </button>
          </div>
        </div>
      </div>

      {results && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">Starting Corpus</p>
              <p className="text-xl font-bold text-slate-800">{formatINRCompact(results.initialCorpus)}</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 rounded-2xl p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600 mb-1">Total Withdrawn</p>
              <p className="text-xl font-bold text-slate-800">{formatINRCompact(results.totalWithdrawn)}</p>
            </div>
            <div className={`bg-gradient-to-br border rounded-2xl p-4 shadow-sm ${results.finalCorpus > 0 ? 'from-cyan-50 to-white border-cyan-100' : 'from-rose-50 to-white border-rose-200'}`}>
              <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${results.finalCorpus > 0 ? 'text-[#21808D]' : 'text-rose-500'}`}>
                {results.finalCorpus > 0 ? 'Remaining Corpus' : 'Corpus Exhausted'}
              </p>
              <p className="text-xl font-bold text-slate-800">
                {results.finalCorpus > 0 ? formatINRCompact(results.finalCorpus) : '₹0'}
              </p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-white border border-amber-100 rounded-2xl p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-600 mb-1">Corpus Duration</p>
              <p className="text-xl font-bold text-slate-800">
                {results.corpusLastsMonths === null
                  ? `${inputs.years}+ yrs`
                  : `${results.corpusLastsYears} yrs ${results.corpusLastsMonths! % 12} mo`}
              </p>
              {results.corpusLastsMonths === null && (
                <p className="text-xs text-emerald-600 mt-0.5">Corpus survives full period ✓</p>
              )}
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Corpus vs. Total Withdrawn Over Time</h3>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={results.yearlyData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="corpusGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#21808D" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#21808D" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="withdrawnGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} tickFormatter={v => `Yr ${v}`} />
                <YAxis tickFormatter={formatY} tick={{ fontSize: 11 }} width={60} />
                <ReTooltip
                  formatter={(value) => [formatINRCompact(Number(value)), '']}
                  labelFormatter={l => `Year ${l}`}
                  contentStyle={{ fontSize: 12 }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                {exhaustionYear && (
                  <ReferenceLine x={exhaustionYear} stroke="#ef4444" strokeDasharray="4 3" label={{ value: 'Exhausted', fill: '#ef4444', fontSize: 11 }} />
                )}
                <Area type="monotone" dataKey="corpusEnd" name="Remaining Corpus" stroke="#21808D" strokeWidth={2} fill="url(#corpusGrad)" dot={false} />
                <Area type="monotone" dataKey="totalWithdrawn" name="Total Withdrawn" stroke="#f59e0b" strokeWidth={2} fill="url(#withdrawnGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Yearly Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
              <h3 className="text-sm font-semibold text-slate-700">Year-by-Year Breakdown</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-[#21808D] to-[#1a626d] text-white text-xs">
                    <th className="px-4 py-3 text-left font-semibold">Year</th>
                    <th className="px-4 py-3 text-right font-semibold">Monthly Withdrawal</th>
                    <th className="px-4 py-3 text-right font-semibold">Annual Withdrawn</th>
                    <th className="px-4 py-3 text-right font-semibold">Cumulative Withdrawn</th>
                    <th className="px-4 py-3 text-right font-semibold">Growth Earned</th>
                    <th className="px-4 py-3 text-right font-semibold">Corpus at Year End</th>
                  </tr>
                </thead>
                <tbody>
                  {results.yearlyData.map((row, i) => (
                    <tr key={row.year}
                      className={`border-b border-slate-100 transition-colors ${row.corpusExhausted ? 'bg-rose-50' : i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                      <td className="px-4 py-2.5 font-semibold text-slate-700">
                        {row.year}
                        {row.corpusExhausted && <span className="ml-2 text-[10px] bg-rose-500 text-white px-1.5 py-0.5 rounded-full">Exhausted</span>}
                      </td>
                      <td className="px-4 py-2.5 text-right text-slate-600">{formatINR(Math.round(row.monthlyWithdrawal))}</td>
                      <td className="px-4 py-2.5 text-right text-amber-700 font-medium">{formatINRCompact(row.annualWithdrawn)}</td>
                      <td className="px-4 py-2.5 text-right text-slate-600">{formatINRCompact(row.totalWithdrawn)}</td>
                      <td className="px-4 py-2.5 text-right text-emerald-700">{formatINRCompact(row.growthEarned)}</td>
                      <td className={`px-4 py-2.5 text-right font-semibold ${row.corpusEnd > 0 ? 'text-[#21808D]' : 'text-rose-500'}`}>
                        {row.corpusEnd > 0 ? formatINRCompact(row.corpusEnd) : '₹0'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {!results && (
        <div className="flex flex-col items-center justify-center min-h-[300px] text-center bg-white rounded-2xl border border-slate-200">
          <div className="text-5xl mb-4">💸</div>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">Plan your withdrawals</h3>
          <p className="text-slate-400 text-sm max-w-sm">Enter your corpus and desired monthly withdrawal above, then click <span className="text-[#21808D] font-medium">Calculate SWP</span> to see how long your money lasts.</p>
        </div>
      )}
    </div>
  );
}
