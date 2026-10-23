/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', 'Consolas', 'Monaco', 'monospace'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        fintech: {
          bg: '#f8fafc',
          card: '#ffffff',
          border: '#e2e8f0',
          borderHover: '#cbd5e1',
          primary: '#2563eb',
          indigo: '#4f46e5',
          purple: '#7c3aed',
          emerald: '#059669',
          amber: '#d97706',
          rose: '#e11d48',
          textMuted: '#64748b',
          textDark: '#0f172a',
        }
      },
      boxShadow: {
        'fintech-subtle': '0 2px 10px -2px rgba(15, 23, 42, 0.04)',
        'fintech-card': '0 4px 20px -4px rgba(15, 23, 42, 0.06)',
        'fintech-hover': '0 12px 30px -6px rgba(15, 23, 42, 0.1)',
        'fintech-modal': '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.25s ease-out',
        'slide-up': 'slideUp 0.25s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
