import type { VerdictData } from '../mockData'

interface VerdictSectionProps {
  verdict: VerdictData
}

const VERDICT_COLORS: Record<string, string> = {
  BUY: 'bg-emerald-600/90 text-white border-emerald-500/60',
  HOLD: 'bg-amber-600/90 text-white border-amber-500/60',
  SELL: 'bg-red-600/90 text-white border-red-500/60',
}

const VERDICT_GLOW: Record<string, string> = {
  BUY: 'shadow-[0_0_20px_rgba(16,185,129,0.15)]',
  HOLD: 'shadow-[0_0_20px_rgba(245,158,11,0.15)]',
  SELL: 'shadow-[0_0_20px_rgba(239,68,68,0.15)]',
}

export default function VerdictSection({ verdict }: VerdictSectionProps) {
  const colorClass = VERDICT_COLORS[verdict.verdict] ?? 'bg-slate-600'
  const glowClass = VERDICT_GLOW[verdict.verdict] ?? ''
  const confidence = Math.min(100, Math.max(0, verdict.confidence_score))

  return (
    <section className="rounded-2xl border border-slate-800 bg-surface p-5 shadow-card">
      <h2 className="mb-5 text-sm font-semibold uppercase tracking-wider text-slate-400">Verdict</h2>
      <div className="mb-5 flex flex-wrap items-center gap-5">
        <span
          className={`inline-flex items-center rounded-xl border px-7 py-2.5 text-2xl font-bold tracking-wide ${colorClass} ${glowClass}`}
        >
          {verdict.verdict}
        </span>
        <div className="flex-1 min-w-[140px]">
          <div className="mb-1.5 flex items-baseline justify-between">
            <p className="text-xs font-medium text-slate-500">{'Confidence (0-100)'}</p>
            <p className="text-sm font-bold tabular-nums text-slate-300 font-mono">{confidence}</p>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-slate-800 ring-1 ring-slate-700/50">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sky-600 to-sky-400 transition-all duration-700 ease-out"
              style={{ width: `${confidence}%` }}
            />
          </div>
        </div>
      </div>
      {verdict.justification?.length > 0 && (
        <ul className="mb-4 space-y-2 text-sm text-slate-300">
          {verdict.justification.map((j, i) => (
            <li key={i} className="flex items-start gap-2 pl-1">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-sky-500/50" />
              <span className="leading-relaxed">{j}</span>
            </li>
          ))}
        </ul>
      )}
      <p className="text-xs leading-relaxed text-slate-500">{verdict.confidence_basis}</p>
      <div className="mt-4 border-t border-slate-800/80 pt-4">
        <p className="text-xs italic leading-relaxed text-slate-600">
          This output is for decision support only and does not constitute financial advice. Do your
          own research and consider consulting a licensed advisor.
        </p>
      </div>
    </section>
  )
}
