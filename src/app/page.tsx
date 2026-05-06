'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { SIPInputs, SIPResults, FXRates, DEFAULT_INPUTS } from '@/lib/types';
import { calculateSIP } from '@/lib/calculations';
import { fetchFXRates } from '@/lib/fxRates';
import { encodeParams, decodeParams } from '@/lib/queryParams';
import CalculatorForm from '@/components/CalculatorForm';
import SummaryCards from '@/components/SummaryCards';
import ResultsTable from '@/components/ResultsTable';
import AssumptionsPanel from '@/components/AssumptionsPanel';
import WhatIfComparison from '@/components/WhatIfComparison';

const GrowthChart = dynamic(() => import('@/components/GrowthChart'), { ssr: false });

export default function Home() {
  const [inputs, setInputs] = useState<SIPInputs>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.toString()) return decodeParams(params.toString());
      const saved = localStorage.getItem('sip_last_inputs');
      if (saved) { try { return JSON.parse(saved); } catch (e) { console.warn('Failed to parse saved inputs:', e); } }
    }
    return DEFAULT_INPUTS;
  });
  const [results, setResults] = useState<SIPResults | null>(null);
  const [fxRates, setFxRates] = useState<FXRates | null>(null);
  const [fxLoading, setFxLoading] = useState(true);
  const [fxError, setFxError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [activeView, setActiveView] = useState<'annual' | 'monthly'>('annual');

  useEffect(() => {
    fetchFXRates().then(rates => {
      setFxRates(rates);
      setFxError(!rates);
      setFxLoading(false);
    });
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sip_last_inputs', JSON.stringify(inputs));
    }
  }, [inputs]);

  const handleCalculate = useCallback(() => {
    const result = calculateSIP(inputs);
    setResults(result);
    if (typeof window !== 'undefined') {
      const newUrl = `${window.location.pathname}?${encodeParams(inputs)}`;
      window.history.pushState({}, '', newUrl);
    }
  }, [inputs]);

  const handleReset = useCallback(() => {
    setInputs(DEFAULT_INPUTS);
    setResults(null);
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', window.location.pathname);
    }
  }, []);

  const handleShare = useCallback(() => {
    const url = `${window.location.origin}${window.location.pathname}?${encodeParams(inputs)}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [inputs]);

  const handleDownloadCSV = useCallback(() => {
    if (!results) return;
    const headers = ['Year','Monthly SIP (₹)','Annual Invested (₹)','Total Invested (₹)','Portfolio Value (₹)','Wealth Gained (₹)','Inflation-Adjusted Value (₹)'];
    const rows = results.yearlyData.map(d => [
      d.year,
      Math.round(d.monthlySIP),
      Math.round(d.annualInvested),
      Math.round(d.totalInvested),
      Math.round(d.portfolioValue),
      Math.round(d.wealthGained),
      Math.round(d.inflationAdjustedValue),
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sip-projection.csv';
    a.click();
  }, [results]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">SIP Growth Calculator</h1>
          <p className="text-gray-500 text-lg">Plan your wealth creation with Systematic Investment Plans</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <CalculatorForm
              inputs={inputs}
              onChange={setInputs}
              onCalculate={handleCalculate}
              onReset={handleReset}
              fxRates={fxRates}
              fxLoading={fxLoading}
              fxError={fxError}
            />
          </div>

          <div className="lg:col-span-2 space-y-6">
            {results ? (
              <>
                <SummaryCards results={results} inputs={inputs} fxRates={fxRates} />
                
                <div className="flex flex-wrap gap-3 no-print">
                  <button onClick={handleShare} className="btn-secondary">
                    {copied ? '✓ Copied!' : '🔗 Share'}
                  </button>
                  <button onClick={handleDownloadCSV} className="btn-secondary">
                    📥 Download CSV
                  </button>
                  <button onClick={handlePrint} className="btn-secondary">
                    🖨️ Print
                  </button>
                  <button onClick={() => setShowComparison(v => !v)} className="btn-secondary">
                    ⚖️ What-if Comparison
                  </button>
                </div>

                {showComparison && (
                  <WhatIfComparison baseInputs={inputs} />
                )}
                
                <GrowthChart yearlyData={results.yearlyData} />
                
                <div className="flex gap-2 mb-2">
                  <button
                    onClick={() => setActiveView('annual')}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${activeView === 'annual' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
                  >
                    Annual View
                  </button>
                  <button
                    onClick={() => setActiveView('monthly')}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${activeView === 'monthly' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
                  >
                    Monthly View
                  </button>
                </div>
                
                <ResultsTable yearlyData={results.yearlyData} view={activeView} />
                <AssumptionsPanel inputs={inputs} />
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
                <div className="text-6xl mb-6">📈</div>
                <h2 className="text-2xl font-semibold text-gray-700 mb-3">Ready to calculate your wealth?</h2>
                <p className="text-gray-400 max-w-md">Fill in your investment details and click <span className="font-medium text-blue-600">Calculate SIP Growth</span> to see your projected returns.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
