/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        correct: '#FFCE00',
        present: '#CC0000',
        absent: '#4a4a4a',
        'de-black': '#1a1a1a',
        'de-red': '#CC0000',
        'de-gold': '#FFCE00',
        'cream': '#F5F2E8',
        'tile-border': '#C8C4B8',
        'key-bg': '#D0CCC0',
      },
      animation: {
        flip: 'flip 0.5s ease-in-out',
        bounce_once: 'bounce 0.6s ease-in-out',
        shake: 'shake 0.4s ease-in-out',
      },
      keyframes: {
        flip: {
          '0%': { transform: 'rotateX(0deg)' },
          '50%': { transform: 'rotateX(-90deg)' },
          '100%': { transform: 'rotateX(0deg)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-6px)' },
          '40%': { transform: 'translateX(6px)' },
          '60%': { transform: 'translateX(-4px)' },
          '80%': { transform: 'translateX(4px)' },
        },
      },
    },
  },
  plugins: [],
}

