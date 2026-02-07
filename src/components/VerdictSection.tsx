import type { VerdictData } from '../mockData'

interface VerdictSectionProps {
  verdict: VerdictData
}

const VERDICT_STYLES: Record<string, { badge: string; glow: string; bar: string }> = {
  BUY: {
    badge: 'bg-bull/15 text-bull-text border-bull-border',
    glow: 'shadow-glow-green',
    bar: 'from-emerald-600 to-emerald-400',
  },
  HOLD: {
    badge: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
    glow: 'shadow-[0_0_24px_rgba(245,158,11,0.12)]',
    bar: 'from-amber-600 to-amber-400',
  },
  SELL: {
    badge: 'bg-bear/15 text-bear-text border-bear-border',
    glow: 'shadow-glow-red',
    bar: 'from-red-600 to-red-400',
  },
}

export default function VerdictSection({ verdict }: VerdictSectionProps) {
  const style = VERDICT_STYLES[verdict.verdict] ?? VERDICT_STYLES.HOLD
  const confidence = Math.min(100, Math.max(0, verdict.confidence_score))

  return (
    <section className="glass-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-border-subtle px-5 py-3.5">
        <svg className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z" />
        </svg>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-txt-tertiary">Verdict</h2>
      </div>

      <div className="p-5">
        {/* Verdict badge and confidence */}
        <div className="mb-6 flex flex-wrap items-center gap-5">
          <span className={`inline-flex items-center rounded-xl border px-8 py-3 text-2xl font-extrabold tracking-wide ${style.badge} ${style.glow}`}>
            {verdict.verdict}
          </span>
          <div className="min-w-[160px] flex-1">
            <div className="mb-2 flex items-baseline justify-between">
              <span className="text-[11px] font-medium uppercase tracking-wider text-txt-tertiary">
                {'Confidence (0-100)'}
              </span>
              <span className="font-mono text-lg font-bold tabular-nums text-txt-primary">{confidence}</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-800 ring-1 ring-inset ring-border-subtle">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${style.bar} transition-all duration-700 ease-out`}
                style={{ width: `${confidence}%` }}
              />
            </div>
          </div>
        </div>

        {/* Justification */}
        {verdict.justification?.length > 0 && (
          <div className="mb-5">
            <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-txt-tertiary">Justification</h3>
            <ul className="space-y-2.5">
              {verdict.justification.map((j, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="mt-[7px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent/50" />
                  <span className="text-sm leading-relaxed text-txt-secondary">{j}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Confidence basis */}
        <p className="text-xs leading-relaxed text-txt-tertiary">{verdict.confidence_basis}</p>

        {/* Disclaimer */}
        <div className="mt-5 border-t border-border-subtle pt-4">
          <p className="text-[11px] italic leading-relaxed text-txt-tertiary/70">
            This output is for decision support only and does not constitute financial advice. Do your
            own research and consider consulting a licensed advisor.
          </p>
        </div>
      </div>
    </section>
  )
}
