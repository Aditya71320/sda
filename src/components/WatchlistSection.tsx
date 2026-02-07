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
  BUY: 'bg-bull/15 text-bull-text border-bull-border',
  HOLD: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
  SELL: 'bg-bear/15 text-bear-text border-bear-border',
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
    <div className="glass-card p-5">
      <div className="mb-1.5 flex items-center gap-2">
        <svg className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
        </svg>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-txt-tertiary">Watchlist</h2>
      </div>
      <p className="mb-5 text-sm leading-relaxed text-txt-tertiary">
        Add tickers to track. The AI will analyze them and flag any with a <strong className="text-bull-text">BUY</strong> verdict.
      </p>

      {/* Error */}
      {error && (
        <div className="mb-4 flex items-start gap-3 rounded-xl border border-bear-border bg-bear-bg px-4 py-3">
          <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-bear/10">
            <svg className="h-3 w-3 text-bear" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <span className="text-sm text-bear-text">{error}</span>
        </div>
      )}

      {/* Add ticker form */}
      <form onSubmit={handleAdd} className="mb-5 flex flex-wrap items-end gap-2.5">
        <div className="min-w-[160px]">
          <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-txt-tertiary">Add ticker</label>
          <input
            ref={addRef}
            type="text"
            placeholder="e.g. AAPL"
            className="w-full rounded-xl border border-border-subtle bg-bg-inset px-3.5 py-2.5 text-sm text-txt-primary placeholder-txt-tertiary shadow-inset"
          />
        </div>
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-btn hover:bg-accent-strong active:scale-[0.97]"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add
        </button>
      </form>

      {/* Ticker chips */}
      {profile.tickers.length > 0 && (
        <>
          <ul className="mb-4 flex flex-wrap gap-2">
            {profile.tickers.map((t) => (
              <li
                key={t}
                className="group flex items-center gap-1.5 rounded-lg border border-border-subtle bg-zinc-800/50 px-3 py-1.5 text-sm"
              >
                <button
                  type="button"
                  onClick={() => onAnalyzeTicker(t)}
                  className="font-semibold text-txt-primary hover:text-accent"
                >
                  {t}
                </button>
                <button
                  type="button"
                  onClick={() => handleRemove(t)}
                  className="text-txt-tertiary opacity-0 transition-opacity group-hover:opacity-100 hover:text-bear"
                  aria-label={`Remove ${t}`}
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
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
            className="inline-flex items-center gap-2 rounded-xl bg-bull/15 px-4 py-2.5 text-sm font-semibold text-bull-text ring-1 ring-inset ring-bull-border hover:bg-bull/20 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none"
          >
            {checking ? (
              <>
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-bull-text/30 border-t-bull-text" />
                <span>Checking watchlist...</span>
              </>
            ) : (
              <>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                </svg>
                <span>Check watchlist (run AI analysis)</span>
              </>
            )}
          </button>
        </>
      )}

      {/* Results */}
      {checkResult && (
        <div className="mt-5 space-y-4 border-t border-border-subtle pt-5">
          {checkResult.good_to_invest.length > 0 && (
            <div className="rounded-xl border border-bull-border bg-bull-bg p-4 shadow-glow-green">
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-bull/15">
                  <svg className="h-3.5 w-3.5 text-bull" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-bull-text">Good time to invest (BUY verdict)</h3>
              </div>
              <p className="text-sm leading-relaxed text-txt-secondary">
                The engine suggests these tickers may be a good time to consider:{' '}
                <strong className="text-bull-text">{checkResult.good_to_invest.join(', ')}</strong>
              </p>
              <p className="mt-2 text-[11px] text-txt-tertiary">
                Click a ticker above to see full analysis. This is decision support only, not financial advice.
              </p>
            </div>
          )}
          {checkResult.results.length > 0 && (
            <div>
              <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-txt-tertiary">All results</h3>
              <ul className="space-y-2">
                {checkResult.results.map((r) => (
                  <li
                    key={r.ticker}
                    className="inset-panel flex flex-wrap items-center gap-3 px-4 py-3 text-sm"
                  >
                    <button
                      type="button"
                      onClick={() => onAnalyzeTicker(r.ticker)}
                      className="font-semibold text-accent hover:underline"
                    >
                      {r.ticker}
                    </button>
                    <span
                      className={`rounded-md border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${
                        VERDICT_COLORS[r.verdict] ?? 'bg-zinc-800 text-txt-secondary'
                      }`}
                    >
                      {r.verdict}
                    </span>
                    <span className="font-mono text-xs text-txt-tertiary">({r.confidence_score})</span>
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
