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
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3 rounded-2xl border border-slate-800 bg-surface p-4 shadow-card">
      <div className="flex-1 min-w-[160px]">
        <label htmlFor="ticker" className="mb-1.5 block text-xs font-medium text-slate-400">Ticker symbol</label>
        <input
          id="ticker"
          ref={inputRef}
          type="text"
          placeholder="e.g. AMD, AAPL"
          className="w-full rounded-lg border border-slate-700/80 bg-slate-900/80 px-3.5 py-2.5 text-sm font-medium text-white placeholder-slate-500 focus:border-sky-500/60 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
          disabled={loading}
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
      >
        {loading ? 'Analyzing...' : 'Analyze'}
      </button>
    </form>
  )
}
