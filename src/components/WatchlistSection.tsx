import { useEffect, useRef, useState } from 'react'
import type { Profile } from '../api'
import type { CheckWatchlistResponse } from '../api'
import { checkWatchlist, updateProfileTickers } from '../api'

interface WatchlistSectionProps {
  profile: Profile | null
  onProfileUpdate: (profile: Profile) => void
  onAnalyzeTicker: (ticker: string) => void
}

const VERDICT_COLORS: Record<string, string> = {
  BUY: 'bg-emerald-600 text-white border-emerald-500',
  HOLD: 'bg-amber-600 text-white border-amber-500',
  SELL: 'bg-red-600 text-white border-red-500',
}

export default function WatchlistSection({
  profile,
  onProfileUpdate,
  onAnalyzeTicker,
}: WatchlistSectionProps) {
  const addRef = useRef<HTMLInputElement>(null)
  const [checking, setChecking] = useState(false)
  const [checkResult, setCheckResult] = useState<CheckWatchlistResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Clear previous results when switching profile
  useEffect(() => {
    setCheckResult(null)
    setError(null)
  }, [profile?.id])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    const t = addRef.current?.value?.trim().toUpperCase()
    if (!t || !profile) return
    setError(null)
    try {
      const updated = await updateProfileTickers(profile.id, [t], undefined)
      onProfileUpdate(updated)
      addRef.current!.value = ''
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add ticker. Is the backend running?')
    }
  }

  const handleRemove = async (ticker: string) => {
    if (!profile) return
    setError(null)
    try {
      const updated = await updateProfileTickers(profile.id, undefined, [ticker])
      onProfileUpdate(updated)
      setCheckResult((prev) =>
        prev
          ? {
              ...prev,
              results: prev.results.filter((r) => r.ticker !== ticker),
              good_to_invest: prev.good_to_invest.filter((t) => t !== ticker),
            }
          : null
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove ticker.')
    }
  }

  const handleCheckWatchlist = async () => {
    if (!profile) return
    setChecking(true)
    setCheckResult(null)
    setError(null)
    try {
      const res = await checkWatchlist(profile.id)
      setCheckResult(res)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check watchlist. Is the backend running?')
    } finally {
      setChecking(false)
    }
  }

  if (!profile) return null

  return (
    <div className="rounded-2xl border border-slate-800 bg-surface p-5 shadow-card">
      <h2 className="mb-1.5 text-sm font-semibold uppercase tracking-wider text-slate-400">Watchlist</h2>
      <p className="mb-4 text-sm leading-relaxed text-slate-500">
        Add tickers to track. The AI will analyze them and notify when any have a <strong className="text-slate-300">BUY</strong> verdict.
      </p>

      {error && (
        <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-950/40 px-3.5 py-2.5 text-sm text-red-300">
          <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleAdd} className="mb-5 flex flex-wrap items-end gap-2.5">
        <div className="min-w-[140px]">
          <label className="mb-1.5 block text-xs font-medium text-slate-400">Add ticker</label>
          <input
            ref={addRef}
            type="text"
            placeholder="e.g. AAPL"
            className="w-full rounded-lg border border-slate-700/80 bg-slate-900/80 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-sky-500/60 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
          />
        </div>
        <button
          type="submit"
          className="rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 active:scale-[0.98]"
        >
          Add
        </button>
      </form>

      {profile.tickers.length > 0 && (
        <>
          <ul className="mb-4 flex flex-wrap gap-2">
            {profile.tickers.map((t) => (
              <li
                key={t}
                className="flex items-center gap-1.5 rounded-lg bg-slate-800/80 px-3 py-1.5 text-sm text-slate-200 ring-1 ring-slate-700/60"
              >
                <button
                  type="button"
                  onClick={() => onAnalyzeTicker(t)}
                  className="font-medium hover:text-sky-400"
                >
                  {t}
                </button>
                <button
                  type="button"
                  onClick={() => handleRemove(t)}
                  className="ml-0.5 text-slate-500 hover:text-red-400"
                  aria-label={`Remove ${t}`}
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={handleCheckWatchlist}
            disabled={checking}
            className="rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
          >
            {checking ? 'Checking watchlist...' : 'Check watchlist (run AI analysis)'}
          </button>
        </>
      )}

      {checkResult && (
        <div className="mt-5 space-y-4 border-t border-slate-800/80 pt-5">
          {checkResult.good_to_invest.length > 0 && (
            <div className="rounded-xl border border-emerald-700/40 bg-emerald-950/30 p-4">
              <h3 className="mb-2 text-sm font-semibold text-emerald-300">
                Good time to invest (BUY verdict)
              </h3>
              <p className="text-sm leading-relaxed text-slate-300">
                The engine suggests these tickers may be a good time to consider:{' '}
                <strong className="text-emerald-300">
                  {checkResult.good_to_invest.join(', ')}
                </strong>
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Click a ticker above to see full analysis. This is decision support only, not financial advice.
              </p>
            </div>
          )}
          {checkResult.results.length > 0 && (
            <div>
              <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-slate-400">All results</h3>
              <ul className="space-y-2">
                {checkResult.results.map((r) => (
                  <li
                    key={r.ticker}
                    className="flex flex-wrap items-center gap-2.5 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-2.5 text-sm"
                  >
                    <button
                      type="button"
                      onClick={() => onAnalyzeTicker(r.ticker)}
                      className="font-semibold text-sky-400 hover:underline"
                    >
                      {r.ticker}
                    </button>
                    <span
                      className={`rounded-md border px-2.5 py-0.5 text-xs font-semibold ${
                        VERDICT_COLORS[r.verdict] ?? 'bg-slate-600'
                      }`}
                    >
                      {r.verdict}
                    </span>
                    <span className="text-slate-500">({r.confidence_score})</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
