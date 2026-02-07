interface HeaderProps {
  ticker: string | null
}

export default function Header({ ticker }: HeaderProps) {
  return (
    <header className="border-b border-slate-700 bg-slate-800/80 px-6 py-4">
      <h1 className="text-xl font-semibold text-white">The Rational Decision Engine</h1>
      <p className="mt-1 text-sm text-slate-400">
        {ticker ? `Ticker: ${ticker}` : 'Enter a ticker and run analysis'}
      </p>
    </header>
  )
}
