'use client';

import { useState } from 'react';
import { SIPInputs } from '@/lib/types';

interface Props {
  inputs: SIPInputs;
}

export default function AssumptionsPanel({ inputs }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full px-6 py-4 flex items-center justify-between text-left"
      >
        <span className="text-base font-semibold text-gray-700">📋 Assumptions &amp; Methodology</span>
        <span className="text-gray-400">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="px-6 pb-6 text-sm text-gray-600 space-y-3 border-t border-gray-50">
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-xl p-4 space-y-2">
              <h4 className="font-semibold text-blue-800">SIP Calculation</h4>
              <ul className="text-xs space-y-1 text-blue-700 list-disc list-inside">
                <li>Monthly rate = (1 + CAGR/100)^(1/12) − 1</li>
                <li>SIP contributions assumed at end of each month</li>
                <li>Step-up applied at the start of each new year</li>
                <li>Monthly compounding throughout the tenure</li>
              </ul>
            </div>
            <div className="bg-amber-50 rounded-xl p-4 space-y-2">
              <h4 className="font-semibold text-amber-800">Inflation Adjustment</h4>
              <ul className="text-xs space-y-1 text-amber-700 list-disc list-inside">
                <li>Real Value = Future Value / (1 + inflation%)^years</li>
                <li>Inflation rate: {inputs.inflation}% per annum</li>
                <li>Shows purchasing power in today&apos;s money</li>
              </ul>
            </div>
            <div className="bg-green-50 rounded-xl p-4 space-y-2">
              <h4 className="font-semibold text-green-800">What This Doesn&apos;t Include</h4>
              <ul className="text-xs space-y-1 text-green-700 list-disc list-inside">
                <li>Tax on gains (LTCG/STCG)</li>
                <li>Fund expense ratio</li>
                <li>Market volatility or sequence-of-returns risk</li>
              </ul>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <h4 className="font-semibold text-gray-800">Current Inputs</h4>
              <ul className="text-xs space-y-1 text-gray-600 list-disc list-inside">
                <li>CAGR: {inputs.cagr}%</li>
                <li>Duration: {inputs.years} years</li>
                <li>Step-up: {inputs.stepUp}% annually</li>
                <li>Inflation: {inputs.inflation}%</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
