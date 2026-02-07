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
    <div className="min-h-screen flex flex-col">
      <Header ticker={ticker} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
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

        <div className="mb-8">
          <TickerInput onAnalyze={handleAnalyze} loading={loading} />
        </div>

        {analyzeError && (
          <div className="mb-8 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-950/40 px-4 py-3.5 text-sm text-red-300 shadow-card">
            <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <span>{analyzeError}</span>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-slate-800 bg-surface p-12 shadow-card">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-600 border-t-sky-400" />
            <p className="text-sm font-medium text-slate-400">Running analysis...</p>
          </div>
        )}

        {!loading && result && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <BearPanel content={result.bear_output} />
              <BullPanel content={result.bull_output} />
            </div>
            <QuantSection quant={result.quant_data} />
            <VerdictSection verdict={result.verdict} />
          </div>
        )}

        {!loading && !result && ticker && !analyzeError && (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-800 bg-surface p-10 shadow-card">
            <p className="text-sm text-slate-400">No result yet. Click Analyze.</p>
          </div>
        )}
      </main>

      <footer className="border-t border-slate-800/60 py-4 text-center text-xs text-slate-600">
        Decision support only. Not financial advice.
      </footer>
    </div>
  )
}
