interface HeaderProps {
  ticker: string | null
}

export default function Header({ ticker }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-slate-50 sm:text-xl">
            The Rational Decision Engine
          </h1>
          <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
            {ticker ? `Ticker: ${ticker}` : 'Enter a ticker and run analysis'}
          </p>
        </div>
        {ticker && (
          <div className="hidden items-center gap-2 sm:flex">
            <span className="inline-flex items-center rounded-md bg-sky-500/10 px-2.5 py-1 text-xs font-medium text-sky-400 ring-1 ring-inset ring-sky-500/20">
              {ticker}
            </span>
          </div>
        )}
      </div>
    </header>
  )
}
