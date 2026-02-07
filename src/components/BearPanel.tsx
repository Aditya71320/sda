interface BearPanelProps {
  content: string
}

/** Renders Bear (Risk Analyst) output with red accent and clean bullets. */
export default function BearPanel({ content }: BearPanelProps) {
  const lines = content.split('\n').filter(Boolean)

  return (
    <section className="rounded-2xl border border-red-900/40 bg-bear-bg p-5 shadow-card">
      <div className="mb-4 flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-900/40">
          <svg className="h-4 w-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6L9 12.75l4.286-4.286a11.948 11.948 0 014.306 6.43l.776 2.898m0 0l3.182-5.511m-3.182 5.51l-5.511-3.181" />
          </svg>
        </div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-bear-text">Bear -- Risk Analyst</h2>
      </div>
      <ul className="space-y-2 text-sm leading-relaxed text-slate-300">
        {lines.map((line, i) => {
          const isBullet = line.trimStart().startsWith('*') || line.trimStart().startsWith('+')
          const text = line.replace(/^\s*[\*\+]\s*/, '').trim()
          if (!text) return null
          return (
            <li key={i} className={isBullet ? 'flex items-start gap-2 pl-1' : 'font-medium text-red-300/90'}>
              {isBullet && <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-500/60" />}
              <span>{text}</span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
