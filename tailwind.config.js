/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ews: {
          bg: '#F7F8FA',
          surface: '#FFFFFF',
          card: '#FFFFFF',
          cardHover: '#F8FAFC',
          border: '#E5E7EB',
          borderLight: '#F1F5F9',
          text: '#172033',
          textMuted: '#667085',
          textDim: '#94A3B8',
          primary: '#2F80ED',
          primaryLight: '#5B9EF4',
          accent: '#2563EB',
          low: '#10B981',
          moderate: '#F59E0B',
          high: '#F97316',
          critical: '#EF4444',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'pulse-fast': 'pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
