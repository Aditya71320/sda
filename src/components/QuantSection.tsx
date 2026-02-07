import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts'
import type { QuantData } from '../mockData'
import { mockPriceHistory } from '../mockData'

interface QuantSectionProps {
  quant: QuantData
}

function num(v: number | string): number | null {
  if (typeof v === 'number' && !Number.isNaN(v)) return v
  if (typeof v === 'string' && v !== 'N/A') {
    const n = parseFloat(v)
    return Number.isNaN(n) ? null : n
  }
  return null
}

export default function QuantSection({ quant }: QuantSectionProps) {
  const price = num(quant.current_price) ?? 0
  const priceHistory = mockPriceHistory(price)

  const rev = num(quant.revenue_growth_yoy_pct)
  const eps = num(quant.eps_growth_pct)
  const vol = num(quant.volatility_proxy)
  const barData = [
    { name: 'Revenue growth YoY %', value: rev ?? 0, fill: '#22c55e' },
    { name: 'EPS growth %', value: eps ?? 0, fill: '#3b82f6' },
    { name: 'Volatility (ann.)', value: vol != null ? vol * 100 : 0, fill: '#eab308' },
  ].filter((d) => d.value !== 0 || d.name.includes('Volatility'))

  const pe = num(quant.pe_ratio)
  const cap = num(quant.market_cap)
  const ret30 = num(quant.return_30d_pct)

  return (
    <section className="rounded-2xl border border-slate-800 bg-surface p-5 shadow-card">
      <h2 className="mb-5 text-sm font-semibold uppercase tracking-wider text-slate-400">Quantitative Data</h2>

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl bg-slate-900/70 p-4 ring-1 ring-slate-800">
          <p className="text-xs font-medium text-slate-500">P/E Ratio</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-white font-mono">{pe != null ? pe.toFixed(1) : 'N/A'}</p>
        </div>
        <div className="rounded-xl bg-slate-900/70 p-4 ring-1 ring-slate-800">
          <p className="text-xs font-medium text-slate-500">Market Cap</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-white font-mono">
            {cap != null ? `$${(cap / 1e9).toFixed(1)}B` : 'N/A'}
          </p>
        </div>
        <div className="rounded-xl bg-slate-900/70 p-4 ring-1 ring-slate-800">
          <p className="text-xs font-medium text-slate-500">30D Return</p>
          <p className={`mt-1 text-2xl font-bold tabular-nums font-mono ${ret30 != null ? (ret30 >= 0 ? 'text-emerald-400' : 'text-red-400') : 'text-white'}`}>
            {ret30 != null ? `${ret30 > 0 ? '+' : ''}${ret30.toFixed(2)}%` : 'N/A'}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <p className="mb-2 text-xs font-medium text-slate-500">Price (mock trend)</p>
        <div className="h-52 rounded-xl bg-slate-900/50 p-3 ring-1 ring-slate-800">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={priceHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} stroke="#334155" />
              <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10, fill: '#64748b' }} stroke="#334155" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: '1px solid #1e293b',
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
                }}
              />
              <Line type="monotone" dataKey="close" stroke="#38bdf8" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-medium text-slate-500">Revenue Growth / EPS Growth / Volatility</p>
        <div className="h-44 rounded-xl bg-slate-900/50 p-3 ring-1 ring-slate-800">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 4, right: 4, left: 4, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#64748b' }} stroke="#334155" />
              <YAxis tick={{ fontSize: 10, fill: '#64748b' }} stroke="#334155" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: '1px solid #1e293b',
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
                }}
              />
              <Bar dataKey="value" radius={6} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  )
}
