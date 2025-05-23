/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6366f1',
          light: '#818cf8',
          dark: '#4338ca'
        },
        secondary: {
          DEFAULT: '#10b981',
          light: '#34d399',
          dark: '#059669'
        },
        'badge-bronze': '#CD7F32',
        'badge-silver': '#C0C0C0',
        'badge-gold': '#FFD700',
        'badge-platinum': '#E5E4E2',
        accent: '#f97316',
        badge: {
          bronze: '#CD7F32',
          silver: '#C0C0C0',
          gold: '#FFD700',
          beginner: '#83c5be',
          intermediate: '#6b73c1',
          advanced: '#e76f51', 
          certificate: '#0ea5e9',
          certification: '#8b5cf6',
          course: '#f59e0b',
          specialization: '#ec4899',
          master: '#7209b7'
        },
        resource: {
          pdf: '#ef4444',
          slides: '#3b82f6',
          worksheet: '#8b5cf6',
          video: '#f97316'
        },
        leaderboard: {
          gold: '#FFD700',
          silver: '#C0C0C0',
          bronze: '#CD7F32',
          highlight: '#4ade80'
        },
        surface: {
          50: '#f8fafc',   // Lightest
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a'   // Darkest
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        heading: ['Inter', 'ui-sans-serif', 'system-ui']
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'neu-light': '5px 5px 15px #d1d9e6, -5px -5px 15px #ffffff',
        'neu-dark': '5px 5px 15px rgba(0, 0, 0, 0.3), -5px -5px 15px rgba(255, 255, 255, 0.05)'
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem'
      }
    }
  },
  safelist: [
    'border-t-primary',
    'border-t-secondary',
    'border-t-accent',
    'border-t-primary-dark',
    'border-t-secondary-dark',
    'border-t-accent-dark',
    'bg-primary/10',
    'bg-secondary/10',
    'bg-accent/10',
  ],
  plugins: [],
  darkMode: 'class',
}