'use client';

import { useState } from 'react';
import { SIPInputs } from '@/lib/types';
import { calculateSIP } from '@/lib/calculations';
import { formatINRCompact } from '@/lib/formatting';

interface Props {
  baseInputs: SIPInputs;
}

export default function WhatIfComparison({ baseInputs }: Props) {
  const [altCagr, setAltCagr] = useState(baseInputs.cagr + 2);
  const [altStepUp, setAltStepUp] = useState(baseInputs.stepUp);

  const baseResults = calculateSIP(baseInputs);
  const altResults = calculateSIP({ ...baseInputs, cagr: altCagr, stepUp: altStepUp });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/70 p-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">⚖️ What-If Comparison</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-[0.08em] mb-1.5">Alternative CAGR (%)</label>
          <input
            type="number"
            value={altCagr}
            onChange={e => setAltCagr(Number(e.target.value))}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#21808D]/50 focus:border-[#21808D]"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-[0.08em] mb-1.5">Alternative Step-up (%)</label>
          <input
            type="number"
            value={altStepUp}
            onChange={e => setAltStepUp(Number(e.target.value))}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#21808D]/50 focus:border-[#21808D]"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-4 border border-slate-200/70">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.08em] mb-2">Your Plan</p>
          <p className="font-bold text-slate-800 text-2xl leading-tight">{formatINRCompact(baseResults.estimatedCorpus)}</p>
          <p className="text-xs text-slate-500 mt-1">CAGR {baseInputs.cagr}% · Step-up {baseInputs.stepUp}%</p>
        </div>
        <div className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-xl p-4 border border-[#21808D]/20">
          <p className="text-[11px] font-semibold text-[#21808D] uppercase tracking-[0.08em] mb-2">Alternative Plan</p>
          <p className="font-bold text-[#21808D] text-2xl leading-tight">{formatINRCompact(altResults.estimatedCorpus)}</p>
          <p className="text-xs text-[#21808D] mt-1">CAGR {altCagr}% · Step-up {altStepUp}%</p>
        </div>
      </div>
      <div className="mt-3 p-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border border-emerald-200/70">
        <p className="text-sm text-emerald-800 font-semibold">
          Difference: {formatINRCompact(Math.abs(altResults.estimatedCorpus - baseResults.estimatedCorpus))}
          {altResults.estimatedCorpus > baseResults.estimatedCorpus ? ' more' : ' less'} with alternative plan
        </p>
      </div>
    </div>
  );
}
