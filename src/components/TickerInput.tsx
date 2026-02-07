import { useRef } from 'react'

interface TickerInputProps {
  onAnalyze: (ticker: string) => void
  loading: boolean
}

export default function TickerInput({ onAnalyze, loading }: TickerInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const t = inputRef.current?.value?.trim().toUpperCase()
    if (t) onAnalyze(t)
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card p-5">
      <div className="mb-3 flex items-center gap-2">
        <svg className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-txt-tertiary">Analyze Ticker</h2>
      </div>
      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-[180px] flex-1">
          <label htmlFor="ticker" className="sr-only">Ticker symbol</label>
          <input
            id="ticker"
            ref={inputRef}
            type="text"
            placeholder="Enter symbol... e.g. AMD, AAPL"
            className="w-full rounded-xl border border-border-subtle bg-bg-inset px-4 py-3 text-sm font-medium text-txt-primary placeholder-txt-tertiary shadow-inset"
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white shadow-btn hover:bg-accent-strong active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none"
        >
          {loading ? (
            <>
              <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
              <span>Analyze</span>
            </>
          )}
        </button>
      </div>
    </form>
  )
}
