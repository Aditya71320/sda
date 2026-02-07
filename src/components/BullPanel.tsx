interface BullPanelProps {
  content: string
}

/** Renders Bull (Growth Advocate) output with green accent and clean bullets. */
export default function BullPanel({ content }: BullPanelProps) {
  const paragraphs = content.split(/\n\n+/).filter(Boolean)

  return (
    <section className="glass-card overflow-hidden">
      {/* Header bar */}
      <div className="flex items-center gap-3 border-b border-bull-border bg-bull-bg px-5 py-3.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-bull/15">
          <svg className="h-3.5 w-3.5 text-bull" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
          </svg>
        </div>
        <div>
          <h2 className="text-sm font-bold text-bull-text">Bull Case</h2>
          <p className="text-[11px] text-txt-tertiary">Growth Advocate</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="space-y-3 text-sm leading-relaxed text-txt-secondary">
          {paragraphs.map((p, i) => (
            <p key={i}>{p.trim()}</p>
          ))}
        </div>
      </div>
    </section>
  )
}
