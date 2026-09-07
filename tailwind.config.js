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
          'blue-hover': '#003DB3',
          'blue-surface': '#F0F5FF',
          navy: '#0A1931',
          'navy-dark': '#050E1E',
          slate: '#1E293B',
          muted: '#64748B',
          green: '#25D366',
          emerald: '#10B981',
          surface: '#FFFFFF',
          'surface-alt': '#F8FAFC',
          border: '#E2E8F0',
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
