/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cosmic: {
          black: '#03020a',
          navy: '#070b1a',
          deep: '#0a0f2e',
          purple: '#6b21a8',
          indigo: '#4338ca',
          violet: '#7c3aed',
          gold: '#f59e0b',
          amber: '#d97706',
          neon: '#818cf8',
          glow: '#a78bfa',
        }
      },
      fontFamily: {
        serif: ['"Cinzel"', '"Playfair Display"', 'Georgia', 'serif'],
        body: ['"Raleway"', '"Nunito"', 'sans-serif'],
      },
      animation: {
        'twinkle': 'twinkle 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'orbit': 'orbit 20s linear infinite',
        'spin-slow': 'spin 30s linear infinite',
        'fade-in': 'fade-in 0.8s ease-out forwards',
      },
      keyframes: {
        twinkle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.3', transform: 'scale(0.8)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(167, 139, 250, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(167, 139, 250, 0.8)' },
        },
        orbit: {
          '0%': { transform: 'rotate(0deg) translateX(150px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(150px) rotate(-360deg)' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      backgroundImage: {
        'cosmic-gradient': 'linear-gradient(135deg, #03020a 0%, #070b1a 40%, #0a0f2e 70%, #1a0a2e 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(107,33,168,0.15) 0%, rgba(67,56,202,0.1) 100%)',
        'gold-gradient': 'linear-gradient(90deg, #f59e0b, #d97706, #f59e0b)',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
