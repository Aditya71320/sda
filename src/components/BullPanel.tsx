interface BullPanelProps {
  content: string
}

/** Renders Bull (Growth Advocate) output with green accent and clean bullets. */
export default function BullPanel({ content }: BullPanelProps) {
  const paragraphs = content.split(/\n\n+/).filter(Boolean)

  return (
    <section className="rounded-2xl border border-emerald-900/40 bg-bull-bg p-5 shadow-card">
      <div className="mb-4 flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-900/40">
          <svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
          </svg>
        </div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-bull-text">Bull -- Growth Advocate</h2>
      </div>
      <div className="space-y-3 text-sm leading-relaxed text-slate-300">
        {paragraphs.map((p, i) => (
          <p key={i}>{p.trim()}</p>
        ))}
      </div>
    </section>
  )
}
