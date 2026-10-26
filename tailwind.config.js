/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: {
          950: '#060709',
          900: '#0a0d12',
          850: '#0f131a',
          800: '#141a24',
          700: '#1e2636',
          600: '#2c374d',
        },
        aqua: {
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          glow: '#00e5ff',
        },
        safe: {
          400: '#34d399',
          500: '#10b981',
          glow: '#05df72',
        },
        unsafe: {
          400: '#f87171',
          500: '#ef4444',
          glow: '#ff334b',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'SF Mono', 'Menlo', 'monospace'],
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.02)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
        telemetryTick: {
          '0%': { opacity: '0.2' },
          '50%': { opacity: '1' },
          '100%': { opacity: '0.2' },
        }
      },
      animation: {
        'pulse-glow': 'pulseGlow 4s ease-in-out infinite',
        'scanline': 'scanline 8s linear infinite',
        'telemetry-tick': 'telemetryTick 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
