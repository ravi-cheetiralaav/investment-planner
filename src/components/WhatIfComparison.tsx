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
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">⚖️ What-If Comparison</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Alternative CAGR (%)</label>
          <input
            type="number"
            value={altCagr}
            onChange={e => setAltCagr(Number(e.target.value))}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Alternative Step-up (%)</label>
          <input
            type="number"
            value={altStepUp}
            onChange={e => setAltStepUp(Number(e.target.value))}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-xs font-medium text-gray-500 uppercase mb-2">Your Plan</p>
          <p className="font-semibold text-gray-800">{formatINRCompact(baseResults.estimatedCorpus)}</p>
          <p className="text-xs text-gray-400">CAGR {baseInputs.cagr}% · Step-up {baseInputs.stepUp}%</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4">
          <p className="text-xs font-medium text-blue-600 uppercase mb-2">Alternative Plan</p>
          <p className="font-semibold text-blue-800">{formatINRCompact(altResults.estimatedCorpus)}</p>
          <p className="text-xs text-blue-400">CAGR {altCagr}% · Step-up {altStepUp}%</p>
        </div>
      </div>
      <div className="mt-3 p-3 bg-green-50 rounded-lg">
        <p className="text-sm text-green-700 font-medium">
          Difference: {formatINRCompact(Math.abs(altResults.estimatedCorpus - baseResults.estimatedCorpus))}
          {altResults.estimatedCorpus > baseResults.estimatedCorpus ? ' more' : ' less'} with alternative plan
        </p>
      </div>
    </div>
  );
}
