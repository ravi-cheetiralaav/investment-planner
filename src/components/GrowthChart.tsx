'use client';

import { YearlyData } from '@/lib/types';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ReferenceLine,
  ReferenceDot,
} from 'recharts';
import { formatINRCompact } from '@/lib/formatting';

interface Props {
  yearlyData: YearlyData[];
}

const formatY = (value: number) => {
  if (value >= 1e7) return `₹${(value / 1e7).toFixed(1)}Cr`;
  if (value >= 1e5) return `₹${(value / 1e5).toFixed(1)}L`;
  return `₹${value}`;
};

export default function GrowthChart({ yearlyData }: Props) {
  const lastYear = yearlyData[yearlyData.length - 1];
  const totalInvested = lastYear?.totalInvested ?? 0;
  const totalGains = lastYear?.wealthGained ?? 0;
  const crossoverPoint = yearlyData.find((row) => row.wealthGained >= row.totalInvested);
  const pieData = [
    { name: 'Principal', value: totalInvested },
    { name: 'Gains', value: totalGains },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Corpus Growth Over Time</h3>
        {crossoverPoint && (
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-fuchsia-200 bg-fuchsia-50 px-3 py-1 text-xs font-semibold text-fuchsia-700">
            Crossover at Year {crossoverPoint.year}: gains ({formatINRCompact(crossoverPoint.wealthGained)}) exceed invested ({formatINRCompact(crossoverPoint.totalInvested)})
          </p>
        )}
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={yearlyData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="year" tickFormatter={(v: number) => `Y${v}`} tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={formatY} tick={{ fontSize: 11 }} width={70} />
            <Tooltip
              formatter={(value) => [formatINRCompact(Number(value)), '']}
              labelFormatter={(v) => `Year ${v}`}
              contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            {crossoverPoint && (
              <>
                <ReferenceLine
                  x={crossoverPoint.year}
                  stroke="#d946ef"
                  strokeDasharray="4 4"
                  label={{ value: 'Crossover', position: 'insideTopRight', fill: '#a21caf', fontSize: 11 }}
                />
                <ReferenceDot
                  x={crossoverPoint.year}
                  y={crossoverPoint.portfolioValue}
                  r={6}
                  fill="#d946ef"
                  stroke="#ffffff"
                  strokeWidth={2}
                />
              </>
            )}
            <Line type="monotone" dataKey="portfolioValue" name="Portfolio Value" stroke="#21808D" strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="totalInvested" name="Total Invested" stroke="#94a3b8" strokeWidth={2} dot={false} strokeDasharray="5 5" />
            <Line type="monotone" dataKey="inflationAdjustedValue" name="Real Value" stroke="#f59e0b" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-base font-semibold text-gray-700 mb-3">Invested vs Value (by Year)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={yearlyData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="year" tickFormatter={(v: number) => `Y${v}`} tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={formatY} tick={{ fontSize: 10 }} width={60} />
              <Tooltip
                formatter={(value) => [formatINRCompact(Number(value)), '']}
                labelFormatter={(v) => `Year ${v}`}
                contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="totalInvested" name="Total Invested" fill="#cbd5e1" radius={[2, 2, 0, 0]} />
              <Bar dataKey="portfolioValue" name="Portfolio Value" fill="#21808D" radius={[2,2,0,0]}>
                {yearlyData.map((row) => (
                  <Cell key={`bar-${row.year}`} fill={crossoverPoint?.year === row.year ? '#d946ef' : '#3b82f6'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h3 className="text-base font-semibold text-gray-700 mb-3">Principal vs Gains</h3>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="60%" height={180}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                  <Cell fill="#cbd5e1" />
                  <Cell fill="#21808D" />
                </Pie>
                <Tooltip formatter={(v) => formatINRCompact(Number(v))} contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {pieData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: i === 0 ? '#cbd5e1' : '#3b82f6' }} />
                  <div>
                    <p className="text-xs text-gray-500">{d.name}</p>
                    <p className="text-sm font-semibold">{formatINRCompact(d.value)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
