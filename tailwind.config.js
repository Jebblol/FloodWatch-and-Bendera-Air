/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        fw: {
          bg: 'var(--bg)',
          panel: 'var(--panel)',
          ink: 'var(--ink)',
          muted: 'var(--muted)',
          line: 'var(--line)',
          sea: 'var(--sea)',
          low: 'var(--low)',
          mod: 'var(--mod)',
          high: 'var(--high)',
          crit: 'var(--crit)',
          na: 'var(--na)',
        },
      },
      fontFamily: {
        sans: ['"Segoe UI"', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
