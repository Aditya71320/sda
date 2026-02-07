interface HeaderProps {
  ticker: string | null
}

export default function Header({ ticker }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border-subtle bg-bg-primary/80 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-6">
        <div className="flex items-center gap-3">
          {/* Logo mark */}
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 ring-1 ring-accent/20">
            <svg className="h-4 w-4 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
              <polyline points="16 7 22 7 22 13" />
            </svg>
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-txt-primary sm:text-lg">
              ArbiTicker
            </h1>
            <p className="hidden text-[11px] font-medium text-txt-tertiary sm:block">
              AI-Powered Stock Analysis
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {ticker && (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent ring-1 ring-inset ring-accent/20">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              {ticker}
            </span>
          )}
          <div className="hidden h-4 w-px bg-border-subtle sm:block" />
          <span className="hidden text-[11px] text-txt-tertiary sm:block">
            {ticker ? 'Analyzing' : 'Ready'}
          </span>
        </div>
      </div>
    </header>
  )
}
