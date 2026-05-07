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
import Logo from '@/components/Logo';
import SWPCalculator from '@/components/SWPCalculator';
import LearnGuides from '@/components/LearnGuides';

const GrowthChart = dynamic(() => import('@/components/GrowthChart'), { ssr: false });

export default function Home() {
  const [inputs, setInputs] = useState<SIPInputs>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.toString()) return decodeParams(params.toString());
      const saved = localStorage.getItem('sip_last_inputs');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Ensure all numeric fields are actual numbers (guard against stale string values)
          return {
            ...DEFAULT_INPUTS,
            ...parsed,
            years: Number(parsed.years) || DEFAULT_INPUTS.years,
            inflation: Number(parsed.inflation) ?? DEFAULT_INPUTS.inflation,
            monthlyInvestment: Number(parsed.monthlyInvestment) || DEFAULT_INPUTS.monthlyInvestment,
            stepUp: Number(parsed.stepUp) ?? DEFAULT_INPUTS.stepUp,
            cagr: Number(parsed.cagr) || DEFAULT_INPUTS.cagr,
            lumpsum: Number(parsed.lumpsum) ?? DEFAULT_INPUTS.lumpsum,
          };
        } catch (e) { console.warn('Failed to parse saved inputs:', e); }
      }
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
  const [activeMenu, setActiveMenu] = useState<'calculator' | 'learn'>('calculator');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'table' | 'swp' | 'whatif' | 'assumptions'>('dashboard');

  useEffect(() => {
    fetchFXRates().then(rates => {
      setFxRates(rates);
      setFxError(false); // fetchFXRates always returns rates (live, cached, or approximate fallback)
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
        <div className="mb-10">
          <Logo />
          <p className="text-gray-500 text-lg mt-2">Plan your wealth creation with Systematic Investment Plans</p>
        </div>

        <div className="mb-8 no-print">
          <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
            <button
              onClick={() => setActiveMenu('calculator')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeMenu === 'calculator' ? 'bg-[#21808D] text-white' : 'text-slate-600 hover:text-slate-900'}`}
            >
              🧮 Calculator
            </button>
            <button
              onClick={() => setActiveMenu('learn')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeMenu === 'learn' ? 'bg-[#21808D] text-white' : 'text-slate-600 hover:text-slate-900'}`}
            >
              📚 Learn
            </button>
          </div>
        </div>

        {activeMenu === 'calculator' ? (
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

            <div className="lg:col-span-2">
              {results ? (
                <>
                  <SummaryCards results={results} inputs={inputs} fxRates={fxRates} />
                
                <div className="flex flex-wrap gap-2 mb-8 no-print">
                  <button onClick={handleShare} className="btn-secondary" title="Share this calculation">
                    <span>🔗</span>
                    <span>{copied ? '✓ Copied!' : 'Share'}</span>
                  </button>
                  <button onClick={handleDownloadCSV} className="btn-secondary" title="Download as CSV">
                    <span>📥</span>
                    <span>Download CSV</span>
                  </button>
                  <button onClick={handlePrint} className="btn-secondary" title="Print this page">
                    <span>🖨️</span>
                    <span>Print</span>
                  </button>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-2 mb-6 border-b border-gray-200 no-print flex-wrap">
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`px-4 py-2 font-medium transition-all border-b-2 ${activeTab === 'dashboard' ? 'border-[#21808D] text-[#21808D]' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
                  >
                    📊 Dashboard
                  </button>
                  <button
                    onClick={() => setActiveTab('table')}
                    className={`px-4 py-2 font-medium transition-all border-b-2 ${activeTab === 'table' ? 'border-[#21808D] text-[#21808D]' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
                  >
                    📋 Data Table
                  </button>
                  <button
                    onClick={() => setActiveTab('whatif')}
                    className={`px-4 py-2 font-medium transition-all border-b-2 ${activeTab === 'whatif' ? 'border-[#21808D] text-[#21808D]' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
                  >
                    ⚖️ What-If
                  </button>
                  <button
                    onClick={() => setActiveTab('swp')}
                    className={`px-4 py-2 font-medium transition-all border-b-2 ${activeTab === 'swp' ? 'border-[#21808D] text-[#21808D]' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
                  >
                    💸 SWP
                  </button>
                  <button
                    onClick={() => setActiveTab('assumptions')}
                    className={`px-4 py-2 font-medium transition-all border-b-2 ${activeTab === 'assumptions' ? 'border-[#21808D] text-[#21808D]' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
                  >
                    ⚙️ Assumptions
                  </button>
                </div>

                {/* Tab Content */}
                <div className="no-print">
                  {/* Dashboard Tab */}
                  {activeTab === 'dashboard' && (
                    <div className="space-y-6">
                      <GrowthChart yearlyData={results.yearlyData} />
                    </div>
                  )}

                  {/* Data Table Tab */}
                  {activeTab === 'table' && (
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setActiveView('annual')}
                          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${activeView === 'annual' ? 'bg-[#21808D] text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
                        >
                          Annual View
                        </button>
                        <button
                          onClick={() => setActiveView('monthly')}
                          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${activeView === 'monthly' ? 'bg-[#21808D] text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
                        >
                          Monthly View
                        </button>
                      </div>
                      <ResultsTable yearlyData={results.yearlyData} monthlyData={results.monthlyData} view={activeView} />
                    </div>
                  )}

                  {/* SWP Tab */}
                  {activeTab === 'swp' && (
                    <SWPCalculator suggestedCorpus={results.estimatedCorpus} />
                  )}

                  {/* What-If Tab */}
                  {activeTab === 'whatif' && (
                    <div className="space-y-4">
                      <WhatIfComparison baseInputs={inputs} />
                    </div>
                  )}

                  {/* Assumptions Tab */}
                  {activeTab === 'assumptions' && (
                    <div className="space-y-4">
                      <AssumptionsPanel inputs={inputs} />
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
                <div className="text-6xl mb-6">📈</div>
                <h2 className="text-2xl font-semibold text-gray-700 mb-3">Ready to calculate your wealth?</h2>
                <p className="text-gray-400 max-w-md">Fill in your investment details and click <span className="font-medium text-[#21808D]">Calculate SIP Growth</span> to see your projected returns.</p>
              </div>
            )}
          </div>
          </div>
        ) : (
          <LearnGuides />
        )}
      </div>
    </main>
  );
}
