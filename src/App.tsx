import { useState } from 'react'
import type { Profile } from './api'
import Header from './components/Header'
import TickerInput from './components/TickerInput'
import BearPanel from './components/BearPanel'
import BullPanel from './components/BullPanel'
import QuantSection from './components/QuantSection'
import VerdictSection from './components/VerdictSection'
import ProfileSelector from './components/ProfileSelector'
import WatchlistSection from './components/WatchlistSection'
import { fetchAnalysis, type AnalysisResult } from './mockData'

export default function App() {
  const [ticker, setTicker] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [analyzeError, setAnalyzeError] = useState<string | null>(null)
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null)

  const handleAnalyze = async (t: string) => {
    setLoading(true)
    setResult(null)
    setAnalyzeError(null)
    setTicker(t)
    try {
      const data = await fetchAnalysis(t)
      setResult(data)
    } catch (e) {
      setAnalyzeError(e instanceof Error ? e.message : 'Analysis failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header ticker={ticker} />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        {/* Profile & Watchlist */}
        <div className="mb-8 space-y-4">
          <ProfileSelector
            selectedId={selectedProfile?.id ?? null}
            onSelect={setSelectedProfile}
          />
          <WatchlistSection
            profile={selectedProfile}
            onProfileUpdate={setSelectedProfile}
            onAnalyzeTicker={(t) => handleAnalyze(t)}
          />
        </div>

        {/* Ticker Input */}
        <div className="mb-8">
          <TickerInput onAnalyze={handleAnalyze} loading={loading} />
        </div>

        {/* Error State */}
        {analyzeError && (
          <div className="glass-card mb-8 flex items-start gap-3 border-bear-border bg-bear-bg px-5 py-4">
            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-bear/10">
              <svg className="h-3.5 w-3.5 text-bear" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-bear-text">Analysis Error</p>
              <p className="mt-0.5 text-sm text-txt-secondary">{analyzeError}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="glass-card flex flex-col items-center justify-center gap-5 p-16">
            <div className="relative">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-zinc-800 border-t-accent" />
              <div className="absolute inset-0 h-10 w-10 animate-ping rounded-full border border-accent/20" style={{ animationDuration: '2s' }} />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-txt-primary">Running analysis</p>
              <p className="mt-1 text-xs text-txt-tertiary">Processing {ticker} through AI agents...</p>
            </div>
          </div>
        )}

        {/* Results */}
        {!loading && result && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <BearPanel content={result.bear_output} />
              <BullPanel content={result.bull_output} />
            </div>
            <QuantSection quant={result.quant_data} />
            <VerdictSection verdict={result.verdict} />
          </div>
        )}

        {/* Empty State */}
        {!loading && !result && ticker && !analyzeError && (
          <div className="glass-card flex flex-col items-center justify-center gap-4 p-12">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-800/50">
              <svg className="h-5 w-5 text-txt-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
              </svg>
            </div>
            <p className="text-sm text-txt-tertiary">No result yet. Click Analyze.</p>
          </div>
        )}
      </main>

      <footer className="border-t border-border-subtle py-5 text-center">
        <p className="text-[11px] text-txt-tertiary">
          Decision support only. Not financial advice. ArbiTicker {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  )
}
