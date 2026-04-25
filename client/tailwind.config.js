/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FFFFFF',
        surface: '#F5F5F5',
        'surface-light': '#EBEBEB',
        border: '#E0E0E0',
        'text-primary': '#1A1A1A',
        'text-secondary': '#555555',
        'text-muted': '#999999',
        accent: '#8B5CF6',
        'accent-light': '#A78BFA',
        'accent-dark': '#7C3AED',
        success: '#10B981',
        danger: '#EF4444',
        warning: '#F59E0B',
      },
      fontFamily: {
        display: ['"Instrument Serif"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      animation: {
        'fade-rise': 'fadeRise 0.8s ease-out forwards',
        'fade-rise-delay': 'fadeRise 0.8s ease-out 0.2s forwards',
        'fade-rise-delay-2': 'fadeRise 0.8s ease-out 0.4s forwards',
        'flip': 'flip 0.6s ease-in-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeRise: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        flip: {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(180deg)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
