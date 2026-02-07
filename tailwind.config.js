/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        bg: {
          primary: '#09090b',
          card: 'rgba(24, 24, 27, 0.7)',
          inset: 'rgba(9, 9, 11, 0.8)',
        },
        border: {
          subtle: 'rgba(63, 63, 70, 0.5)',
          DEFAULT: 'rgba(63, 63, 70, 0.7)',
        },
        accent: {
          DEFAULT: '#0ea5e9',
          muted: 'rgba(14, 165, 233, 0.15)',
          strong: '#38bdf8',
        },
        bear: {
          DEFAULT: '#ef4444',
          bg: 'rgba(239, 68, 68, 0.08)',
          border: 'rgba(239, 68, 68, 0.2)',
          text: '#fca5a5',
        },
        bull: {
          DEFAULT: '#22c55e',
          bg: 'rgba(34, 197, 94, 0.08)',
          border: 'rgba(34, 197, 94, 0.2)',
          text: '#86efac',
        },
        txt: {
          primary: '#fafafa',
          secondary: '#a1a1aa',
          tertiary: '#71717a',
        },
      },
      borderRadius: {
        '2xl': '16px',
        xl: '12px',
        lg: '10px',
      },
      boxShadow: {
        'card': '0 0 0 1px rgba(63, 63, 70, 0.5), 0 2px 8px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 0 0 1px rgba(63, 63, 70, 0.7), 0 8px 24px rgba(0, 0, 0, 0.4)',
        'inset': 'inset 0 1px 2px rgba(0, 0, 0, 0.3)',
        'glow-accent': '0 0 24px rgba(14, 165, 233, 0.15)',
        'glow-green': '0 0 24px rgba(34, 197, 94, 0.12)',
        'glow-red': '0 0 24px rgba(239, 68, 68, 0.12)',
        'btn': '0 1px 2px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      },
      animation: {
        'spin-slow': 'spin 2s linear infinite',
      },
    },
  },
  plugins: [],
}
