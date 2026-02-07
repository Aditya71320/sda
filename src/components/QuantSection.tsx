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
    { name: 'EPS growth %', value: eps ?? 0, fill: '#0ea5e9' },
    { name: 'Volatility (ann.)', value: vol != null ? vol * 100 : 0, fill: '#eab308' },
  ].filter((d) => d.value !== 0 || d.name.includes('Volatility'))

  const pe = num(quant.pe_ratio)
  const cap = num(quant.market_cap)
  const ret30 = num(quant.return_30d_pct)

  const tooltipStyle = {
    backgroundColor: '#18181b',
    border: '1px solid rgba(63, 63, 70, 0.5)',
    borderRadius: '12px',
    fontSize: '12px',
    fontFamily: 'JetBrains Mono, monospace',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
    padding: '8px 12px',
  }

  return (
    <section className="glass-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-border-subtle px-5 py-3.5">
        <svg className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-txt-tertiary">Quantitative Data</h2>
      </div>

      <div className="p-5">
        {/* Metric cards */}
        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="inset-panel p-4">
            <p className="text-[11px] font-medium uppercase tracking-wider text-txt-tertiary">P/E Ratio</p>
            <p className="mt-1.5 font-mono text-2xl font-bold tabular-nums text-txt-primary">
              {pe != null ? pe.toFixed(1) : 'N/A'}
            </p>
          </div>
          <div className="inset-panel p-4">
            <p className="text-[11px] font-medium uppercase tracking-wider text-txt-tertiary">Market Cap</p>
            <p className="mt-1.5 font-mono text-2xl font-bold tabular-nums text-txt-primary">
              {cap != null ? `$${(cap / 1e9).toFixed(1)}B` : 'N/A'}
            </p>
          </div>
          <div className="inset-panel p-4">
            <p className="text-[11px] font-medium uppercase tracking-wider text-txt-tertiary">30D Return</p>
            <p className={`mt-1.5 font-mono text-2xl font-bold tabular-nums ${
              ret30 != null ? (ret30 >= 0 ? 'text-bull' : 'text-bear') : 'text-txt-primary'
            }`}>
              {ret30 != null ? `${ret30 > 0 ? '+' : ''}${ret30.toFixed(2)}%` : 'N/A'}
            </p>
          </div>
        </div>

        {/* Price chart */}
        <div className="mb-6">
          <p className="mb-2.5 text-[11px] font-medium uppercase tracking-wider text-txt-tertiary">Price (mock trend)</p>
          <div className="inset-panel h-56 p-3">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={priceHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(63, 63, 70, 0.3)" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#71717a', fontFamily: 'JetBrains Mono' }} stroke="rgba(63, 63, 70, 0.3)" />
                <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10, fill: '#71717a', fontFamily: 'JetBrains Mono' }} stroke="rgba(63, 63, 70, 0.3)" />
                <Tooltip contentStyle={tooltipStyle} />
                <Line
                  type="monotone"
                  dataKey="close"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: '#0ea5e9', stroke: '#09090b', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar chart */}
        <div>
          <p className="mb-2.5 text-[11px] font-medium uppercase tracking-wider text-txt-tertiary">Revenue Growth / EPS Growth / Volatility</p>
          <div className="inset-panel h-48 p-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 4, right: 4, left: 4, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(63, 63, 70, 0.3)" />
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#71717a' }} stroke="rgba(63, 63, 70, 0.3)" />
                <YAxis tick={{ fontSize: 10, fill: '#71717a', fontFamily: 'JetBrains Mono' }} stroke="rgba(63, 63, 70, 0.3)" />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  )
}
