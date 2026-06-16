/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{svelte,ts,js}'],
  theme: {
    extend: {
      colors: {
        bg: '#0b1020',
        'bg-deep': '#070b16',
        surface: 'rgba(16, 22, 36, 0.82)',
        'surface-strong': 'rgba(12, 18, 30, 0.92)',
        border: 'rgba(130, 150, 185, 0.18)',
        'border-strong': 'rgba(160, 180, 210, 0.32)',
        ink: '#d7e2f2',
        'ink-muted': '#9fb0c9',
        'ink-strong': '#f5f8ff',
        accent: '#5d7cff',
        'accent-warm': '#d58a5e',
        'focus-ring': '#9eb3ff',
        'focus-ring-strong': '#c8d4ff',
        'focus-shadow': 'rgba(104, 134, 255, 0.38)',
      },
      fontFamily: {
        heading: ['Outfit', 'Segoe UI', 'sans-serif'],
        body: ['Manrope', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      boxShadow: {
        elevated: '0 22px 60px rgba(5, 9, 18, 0.65)',
        soft: '0 16px 40px rgba(5, 9, 18, 0.35)',
      },
      keyframes: {
        rise: {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'float-in': {
          from: { opacity: '0', transform: 'translateY(18px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'glow-bob': {
          from: { transform: 'translate3d(0, 0, 0) scale(1)' },
          to: { transform: 'translate3d(0, 20px, 0) scale(1.05)' },
        },
        'pulse-glow': {
          '0%, 100%': { transform: 'scale(1)', filter: 'saturate(1)' },
          '50%': { transform: 'scale(1.04)', filter: 'saturate(1.15)' },
        },
        'cue-bounce': {
          '0%, 100%': { transform: 'translateY(0)' },
          '45%': { transform: 'translateY(2px)' },
          '65%': { transform: 'translateY(4px)' },
        },
        'smoke-rise': {
          '0%': { opacity: '0', transform: 'translate(-50%, -20%) scale(0.96)', filter: 'blur(0)' },
          '12%': { opacity: '0.95' },
          '100%': { opacity: '0', transform: 'translate(-50%, -165%) scale(1.05)', filter: 'blur(1px)' },
        },
      },
      animation: {
        rise: 'rise 720ms cubic-bezier(0.16, 1, 0.3, 1) both',
        'rise-slow': 'rise 760ms cubic-bezier(0.16, 1, 0.3, 1) both',
        'float-in': 'float-in 780ms cubic-bezier(0.16, 1, 0.3, 1) both',
        'float-in-soft': 'float-in 860ms cubic-bezier(0.16, 1, 0.3, 1) both',
        'glow-bob': 'glow-bob 14s ease-in-out infinite alternate',
        'pulse-glow': 'pulse-glow 2.2s ease-in-out infinite',
        'cue-bounce': 'cue-bounce 1.3s ease-in-out infinite',
        'smoke-rise': 'smoke-rise 1100ms ease-out both',
      },
      screens: {
        'max-1040': { max: '1040px' },
        'max-820': { max: '820px' },
        'max-560': { max: '560px' },
        'max-h-800': { raw: '(max-height: 800px)' },
      },
    },
  },
  plugins: [],
}
