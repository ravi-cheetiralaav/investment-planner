'use client';

import { useState } from 'react';

interface MetricCard {
  id: string;
  title: string;
  description: string;
  details: string;
  example?: string;
  interpretation: string;
  icon: string;
  gradient: string;
  borderColor: string;
}

const metrics: MetricCard[] = [
  {
    id: 'benchmark',
    title: 'Benchmark',
    description: 'A standard market index used to evaluate fund performance',
    details: 'Benchmark is a reference index (like Nifty 50) that represents the market segment your fund invests in. It serves as a yardstick to measure whether your fund is performing better or worse than the market.',
    example: 'If a fund returns 12% and benchmark returns 10%, the fund has outperformed the benchmark by 2%.',
    interpretation: 'Compare fund returns against its benchmark. Fund should consistently beat or match the benchmark it tracks.',
    icon: '📊',
    gradient: 'from-blue-100 to-cyan-50',
    borderColor: 'border-blue-300',
  },
  {
    id: 'beta',
    title: 'Beta',
    description: 'Measures how much a fund\'s volatility compares to its benchmark',
    details: 'Beta tells you how sensitive the fund is to market movements. It shows the fund\'s volatility relative to its benchmark index.',
    example: 'Large-cap fund benchmark (like Nifty 50) has Beta = 1. A fund with Beta = 0.75 means it moves 75% as much as the benchmark.',
    interpretation: 'Beta < 1: Less risky than market | Beta = 1: Equal risk to market | Beta > 1: More risky than market',
    icon: '📈',
    gradient: 'from-green-100 to-emerald-50',
    borderColor: 'border-green-300',
  },
  {
    id: 'alpha',
    title: 'Alpha',
    description: 'Measures excess return above the benchmark on a risk-adjusted basis',
    details: 'Alpha represents the value that a fund manager adds (or subtracts) through their stock-picking abilities. It\'s the extra return you get after accounting for the risk taken.',
    example: 'Fund returns 10%, Benchmark returns 7%, Beta = 0.75, Risk-free rate = 4%. Alpha = (10%-4%) - (7%-4%) × 0.75 = 3.75%',
    interpretation: 'Higher Alpha is better. Positive alpha means the fund has beaten its benchmark after adjusting for risk.',
    icon: '⭐',
    gradient: 'from-amber-100 to-orange-50',
    borderColor: 'border-amber-300',
  },
  {
    id: 'stddev',
    title: 'Standard Deviation',
    description: 'Measures how much a fund\'s returns fluctuate around its average',
    details: 'Standard Deviation shows the volatility or risk of the fund. It measures how much the fund\'s returns vary from month to month or year to year.',
    example: 'Fund A has returns: 8%, 10%, 12% (StdDev = 1.63%) vs Fund B: 0%, 10%, 20% (StdDev = 8.16%). Fund B is more volatile.',
    interpretation: 'Lower Standard Deviation = Lower risk & more stable returns | Higher = More volatility & uncertainty',
    icon: '📉',
    gradient: 'from-purple-100 to-violet-50',
    borderColor: 'border-purple-300',
  },
  {
    id: 'sharpe',
    title: 'Sharpe Ratio',
    description: 'Measures risk-adjusted returns (Use only for Equity Mutual Funds)',
    details: 'Sharpe Ratio tells you how much return you get for each unit of risk taken. It helps compare funds on a level playing field - accounting for both returns and risk.',
    example: 'Fund A: 12% return, 8% volatility, Sharpe = 1.0 | Fund B: 14% return, 15% volatility, Sharpe = 0.93. Fund A is better risk-adjusted.',
    interpretation: 'Higher Sharpe Ratio = Better risk-adjusted returns | Sharpe > 1 is generally considered good for equity funds',
    icon: '🎯',
    gradient: 'from-rose-100 to-pink-50',
    borderColor: 'border-rose-300',
  },
  {
    id: 'capture',
    title: 'Capture Ratio',
    description: 'Measures how well a fund captures market gains and limits losses',
    details: 'Capture Ratio compares a fund\'s performance in up markets vs down markets to the benchmark. Upside Capture shows gains during bull markets, Downside Capture shows protection during bear markets.',
    example: 'Upside Capture = 110% means fund gained 110% of what benchmark gained in bull market | Downside Capture = 80% means fund lost only 80% of benchmark losses in bear market',
    interpretation: 'High Upside Capture (>100%) + Low Downside Capture (<100%) = Ideal fund characteristics',
    icon: '🎪',
    gradient: 'from-indigo-100 to-blue-50',
    borderColor: 'border-indigo-300',
  },
];

function MetricCardComponent({ metric, isSelected, onClick }: { metric: MetricCard; isSelected: boolean; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
        isSelected
          ? `bg-gradient-to-br ${metric.gradient} ${metric.borderColor} shadow-lg scale-[1.02]`
          : `bg-white border-slate-200 hover:border-slate-300 hover:shadow-md`
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="text-3xl">{metric.icon}</span>
        <div className="flex-1">
          <h3 className={`font-bold text-lg ${isSelected ? 'text-slate-900' : 'text-slate-800'}`}>{metric.title}</h3>
          <p className="text-sm text-slate-600 mt-1">{metric.description}</p>
        </div>
      </div>
    </div>
  );
}

export default function LearnGuides() {
  const [selectedMetric, setSelectedMetric] = useState<string>('benchmark');
  const current = metrics.find((m) => m.id === selectedMetric) || metrics[0];

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-900">📚 Learn Mutual Fund Metrics</h2>
        <p className="text-slate-600">Understand the key metrics that help you select the best mutual funds</p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {metrics.map((metric) => (
          <MetricCardComponent
            key={metric.id}
            metric={metric}
            isSelected={selectedMetric === metric.id}
            onClick={() => setSelectedMetric(metric.id)}
          />
        ))}
      </div>

      {/* Detailed View */}
      <div className={`bg-gradient-to-br ${current.gradient} border-2 ${current.borderColor} rounded-2xl p-8 shadow-lg`}>
        <div className="space-y-6">
          {/* Title Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-5xl">{current.icon}</span>
              <h3 className="text-3xl font-bold text-slate-900">{current.title}</h3>
            </div>
            <p className="text-lg text-slate-700">{current.description}</p>
          </div>

          {/* Details */}
          <div className="space-y-4 bg-white/70 rounded-xl p-6 backdrop-blur-sm">
            <div>
              <h4 className="font-semibold text-slate-900 mb-2">What is it?</h4>
              <p className="text-slate-700">{current.details}</p>
            </div>

            {current.example && (
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">📌 Example</h4>
                <div className="bg-slate-50 border-l-4 border-slate-400 pl-4 py-2 rounded">
                  <p className="text-slate-700 text-sm font-mono">{current.example}</p>
                </div>
              </div>
            )}

            <div>
              <h4 className="font-semibold text-slate-900 mb-2">✅ How to Interpret</h4>
              <div className="bg-emerald-50 border-l-4 border-emerald-500 pl-4 py-2 rounded">
                <p className="text-emerald-900 text-sm">{current.interpretation}</p>
              </div>
            </div>
          </div>

          {/* Selection Tip */}
          <div className="bg-cyan-50 border-l-4 border-cyan-500 pl-4 py-3 rounded">
            <p className="text-cyan-900 text-sm font-medium">
              💡 <strong>Fund Selection Tip:</strong> Use multiple metrics together. Don't rely on just one metric to choose a fund.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Reference Table */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-4">📋 Quick Reference Guide</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-slate-300">
                <th className="text-left py-3 px-4 font-semibold text-slate-900">Metric</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-900">Best Indicator</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-900">Target/Good Value</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-200 hover:bg-white transition-colors">
                <td className="py-3 px-4 font-medium text-slate-900">Benchmark</td>
                <td className="py-3 px-4 text-slate-700">Market Reference</td>
                <td className="py-3 px-4 text-slate-700">Fund should beat it consistently</td>
              </tr>
              <tr className="border-b border-slate-200 hover:bg-white transition-colors">
                <td className="py-3 px-4 font-medium text-slate-900">Beta</td>
                <td className="py-3 px-4 text-slate-700">Risk Relative to Market</td>
                <td className="py-3 px-4 text-slate-700">&lt; 1 for Conservative | = 1 for Balanced</td>
              </tr>
              <tr className="border-b border-slate-200 hover:bg-white transition-colors">
                <td className="py-3 px-4 font-medium text-slate-900">Alpha</td>
                <td className="py-3 px-4 text-slate-700">Manager Skill</td>
                <td className="py-3 px-4 text-slate-700">Positive (higher is better)</td>
              </tr>
              <tr className="border-b border-slate-200 hover:bg-white transition-colors">
                <td className="py-3 px-4 font-medium text-slate-900">Std. Deviation</td>
                <td className="py-3 px-4 text-slate-700">Return Volatility</td>
                <td className="py-3 px-4 text-slate-700">Lower is better (less risky)</td>
              </tr>
              <tr className="border-b border-slate-200 hover:bg-white transition-colors">
                <td className="py-3 px-4 font-medium text-slate-900">Sharpe Ratio</td>
                <td className="py-3 px-4 text-slate-700">Risk-Adjusted Return</td>
                <td className="py-3 px-4 text-slate-700">&gt; 1.0 (Equity funds only)</td>
              </tr>
              <tr className="hover:bg-white transition-colors">
                <td className="py-3 px-4 font-medium text-slate-900">Capture Ratio</td>
                <td className="py-3 px-4 text-slate-700">Upside/Downside Performance</td>
                <td className="py-3 px-4 text-slate-700">High Upside, Low Downside</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
