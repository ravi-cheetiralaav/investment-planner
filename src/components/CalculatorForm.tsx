'use client';

import { useState } from 'react';
import { SIPInputs, FXRates, ALLOWED_YEARS, PRESETS } from '@/lib/types';
import CurrencyHint from './CurrencyHint';
import InfoTooltip from './Tooltip';

interface Props {
  inputs: SIPInputs;
  onChange: (inputs: SIPInputs) => void;
  onCalculate: () => void;
  onReset: () => void;
  fxRates: FXRates | null;
  fxLoading: boolean;
  fxError: boolean;
}

interface ValidationErrors {
  monthlyInvestment?: string;
  inflation?: string;
  stepUp?: string;
  cagr?: string;
}

export default function CalculatorForm({ inputs, onChange, onCalculate, onReset, fxRates, fxLoading, fxError }: Props) {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validate = (): boolean => {
    const newErrors: ValidationErrors = {};
    if (inputs.monthlyInvestment < 500) newErrors.monthlyInvestment = 'Minimum investment is ₹500';
    if (inputs.inflation < 0) newErrors.inflation = 'Cannot be negative';
    if (inputs.stepUp < 0) newErrors.stepUp = 'Cannot be negative';
    if (inputs.cagr <= 0) newErrors.cagr = 'CAGR must be greater than 0';
    if (inputs.cagr > 50) newErrors.cagr = 'CAGR seems unrealistically high';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (validate()) onCalculate();
  };

  const update = (key: keyof SIPInputs, value: number) => {
    onChange({ ...inputs, [key]: value });
  };

  const applyPreset = (preset: keyof typeof PRESETS) => {
    onChange({ ...inputs, ...PRESETS[preset] });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/70 p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">Investment Details</h2>
        <p className="text-xs text-slate-500 mt-0.5">Adjust inputs to model your SIP scenario</p>
      </div>

      {/* Presets */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-[0.08em]">Scenario Presets</label>
        <div className="flex gap-2">
          {(Object.keys(PRESETS) as Array<keyof typeof PRESETS>).map(preset => (
            <button
              key={preset}
              onClick={() => applyPreset(preset)}
              className="flex-1 py-1.5 text-sm font-medium rounded-lg border border-slate-200 text-slate-600 hover:border-[#21808D] hover:text-[#21808D] hover:bg-cyan-50 transition-all"
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* Years */}
      <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
          Investment Duration
        </label>
        <div className="flex flex-wrap gap-2">
          {ALLOWED_YEARS.map(y => (
            <button
              type="button"
              key={y}
              onClick={() => update('years', y)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                Number(inputs.years) === y
                  ? 'bg-[#21808D] text-white border-[#21808D] shadow-sm'
                  : 'border-slate-200 text-slate-600 hover:border-[#21808D] hover:text-[#21808D] hover:bg-cyan-50'
              }`}
            >
              {y}Y
            </button>
          ))}
        </div>
      </div>

      {/* Monthly Investment */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Monthly Investment (INR)
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">₹</span>
          <input
            type="number"
            value={inputs.monthlyInvestment}
            onChange={e => update('monthlyInvestment', Number(e.target.value))}
            min={500}
            className="w-full pl-7 pr-4 py-2.5 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#21808D]/50 focus:border-[#21808D]"
          />
        </div>
        {errors.monthlyInvestment && <p className="text-red-500 text-xs mt-1">{errors.monthlyInvestment}</p>}
        <CurrencyHint amount={inputs.monthlyInvestment} fxRates={fxRates} loading={fxLoading} error={fxError} />
      </div>

      {/* Annual Lump Sum */}
      <div>
        <div className="flex items-center gap-1 mb-1">
          <label className="text-sm font-medium text-slate-700">Annual Lump Sum (INR)</label>
          <InfoTooltip text="An additional one-time amount invested at the start of each year, on top of your monthly SIP. Set to 0 to skip." />
        </div>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">₹</span>
          <input
            type="number"
            value={inputs.lumpsum}
            onChange={e => update('lumpsum', Number(e.target.value))}
            min={0}
            step={10000}
            className="w-full pl-7 pr-4 py-2.5 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#21808D]/50 focus:border-[#21808D]"
          />
        </div>
        <CurrencyHint amount={inputs.lumpsum} fxRates={fxRates} loading={fxLoading} error={fxError} />
        <div className="flex gap-1.5 mt-1.5 flex-wrap">
          {[0, 50000, 100000, 500000].map(v => (
            <button type="button" key={v} onClick={() => update('lumpsum', v)}
              className={`px-2 py-0.5 rounded text-xs font-medium transition-all ${inputs.lumpsum === v ? 'bg-[#21808D] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              {v === 0 ? 'None' : v >= 100000 ? `₹${v/100000}L` : `₹${v/1000}K`}
            </button>
          ))}
        </div>
      </div>

      {/* CAGR */}
      <div>
        <div className="flex items-center gap-1 mb-1">
          <label className="text-sm font-medium text-slate-700">Expected CAGR</label>
          <InfoTooltip text="Compound Annual Growth Rate — the expected annual return on your investment. Equity mutual funds have historically returned 12–15% over long periods." />
        </div>
        <div className="relative">
          <input
            type="number"
            value={inputs.cagr}
            onChange={e => update('cagr', Number(e.target.value))}
            min={0.1}
            max={50}
            step={0.5}
            className="w-full pr-8 pl-4 py-2.5 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">%</span>
        </div>
        {errors.cagr && <p className="text-red-500 text-xs mt-1">{errors.cagr}</p>}
        <p className="text-xs text-slate-500 mt-1">Annual return on your investment</p>
      </div>

      {/* Annual Step-up */}
      <div>
        <div className="flex items-center gap-1 mb-1">
          <label className="text-sm font-medium text-slate-700">Annual Step-up</label>
          <InfoTooltip text="Increase your monthly SIP by this % every year. E.g., 10% step-up means ₹10,000 becomes ₹11,000 in year 2, ₹12,100 in year 3, and so on." />
        </div>
        <div className="relative">
          <input
            type="number"
            value={inputs.stepUp}
            onChange={e => update('stepUp', Number(e.target.value))}
            min={0}
            max={50}
            step={0.5}
            className="w-full pr-8 pl-4 py-2.5 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">%</span>
        </div>
        {errors.stepUp && <p className="text-red-500 text-xs mt-1">{errors.stepUp}</p>}
        <p className="text-xs text-slate-500 mt-1">Increase SIP amount yearly to match income growth</p>
      </div>

      {/* Inflation */}
      <div>
        <div className="flex items-center gap-1 mb-1">
          <label className="text-sm font-medium text-slate-700">Inflation Rate</label>
          <InfoTooltip text="Expected annual inflation. Used to calculate the real (inflation-adjusted) value of your corpus in today's money. India's average inflation is around 5–7%." />
        </div>
        <div className="relative">
          <input
            type="number"
            value={inputs.inflation}
            onChange={e => update('inflation', Number(e.target.value))}
            min={0}
            max={20}
            step={0.5}
            className="w-full pr-8 pl-4 py-2.5 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">%</span>
        </div>
        {errors.inflation && <p className="text-red-500 text-xs mt-1">{errors.inflation}</p>}
        <p className="text-xs text-slate-500 mt-1">Used to compute real value of your corpus</p>
      </div>

      {/* Buttons */}
      <div className="space-y-3 pt-2">
        <button
          onClick={handleCalculate}
          className="w-full py-3 bg-[#21808D] hover:bg-[#1a626d] text-white font-semibold rounded-xl transition-all shadow-sm hover:shadow-md active:scale-[0.99]"
        >
          Calculate SIP Growth
        </button>
        <button
          onClick={onReset}
          className="w-full py-2.5 border border-slate-200 text-slate-600 hover:text-slate-800 font-medium rounded-xl transition-all hover:border-slate-300 hover:bg-slate-50"
        >
          Reset to Defaults
        </button>
      </div>
    </div>
  );
}
