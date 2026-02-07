interface BearPanelProps {
  content: string
}

/** Renders Bear (Risk Analyst) output with red accent and clean bullets. */
export default function BearPanel({ content }: BearPanelProps) {
  const lines = content.split('\n').filter(Boolean)

  return (
    <section className="glass-card overflow-hidden">
      {/* Header bar */}
      <div className="flex items-center gap-3 border-b border-bear-border bg-bear-bg px-5 py-3.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-bear/15">
          <svg className="h-3.5 w-3.5 text-bear" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6L9 12.75l4.286-4.286a11.948 11.948 0 014.306 6.43l.776 2.898m0 0l3.182-5.511m-3.182 5.51l-5.511-3.181" />
          </svg>
        </div>
        <div>
          <h2 className="text-sm font-bold text-bear-text">Bear Case</h2>
          <p className="text-[11px] text-txt-tertiary">Risk Analyst</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <ul className="space-y-2.5 text-sm leading-relaxed text-txt-secondary">
          {lines.map((line, i) => {
            const isBullet = line.trimStart().startsWith('*') || line.trimStart().startsWith('+')
            const text = line.replace(/^\s*[\*\+]\s*/, '').trim()
            if (!text) return null
            return (
              <li key={i} className={isBullet ? 'flex items-start gap-2.5 pl-0.5' : 'font-semibold text-bear-text'}>
                {isBullet && (
                  <span className="mt-[7px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-bear/50" />
                )}
                <span>{text}</span>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
