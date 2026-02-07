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
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
      <div className="flex-1 min-w-[140px]">
        <label htmlFor="ticker" className="mb-1 block text-xs text-slate-400">Ticker</label>
        <input
          id="ticker"
          ref={inputRef}
          type="text"
          placeholder="e.g. AMD, AAPL"
          className="w-full rounded border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          disabled={loading}
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="rounded bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500 disabled:opacity-50"
      >
        {loading ? 'Analyzing…' : 'Analyze'}
      </button>
      
    </form>
  )
}
