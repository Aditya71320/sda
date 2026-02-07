/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        bear: { bg: 'rgba(127,29,29,0.15)', border: '#991b1b', text: '#fca5a5' },
        bull: { bg: 'rgba(21,128,61,0.15)', border: '#166534', text: '#86efac' },
        surface: {
          DEFAULT: 'rgba(15, 23, 42, 0.6)',
          raised: 'rgba(30, 41, 59, 0.7)',
        },
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1rem',
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px -1px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.3)',
        glow: '0 0 20px rgba(56, 189, 248, 0.1)',
      },
    },
  },
  plugins: [],
}
