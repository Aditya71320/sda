/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bear: { bg: 'rgba(127,29,29,0.2)', border: '#b91c1c', text: '#fca5a5' },
        bull: { bg: 'rgba(21,128,61,0.2)', border: '#15803d', text: '#86efac' },
      },
    },
  },
  plugins: [],
}
