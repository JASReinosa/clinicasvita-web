/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./**/*.html",
    "./js/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        vita: {
          blue: '#0050E7',
          'blue-dark': '#003DB3',
          'blue-light': '#EBF2FF',
          navy: '#0A1931',
          'navy-dark': '#050E1E',
          slate: '#1E293B',
          green: '#25D366',
          emerald: '#10B981',
          bg: '#F8FAFC'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['Fira Code', 'monospace']
      }
    },
  },
  plugins: [],
}
