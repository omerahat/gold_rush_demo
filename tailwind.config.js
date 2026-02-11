/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          300: '#F5D280',
          400: '#DDB34C',
          500: '#D4AF37',
          600: '#B8860B',
        },
        danger: {
          500: '#DC143C',
          600: '#8B0000',
        },
        saloon: {
          900: '#2A1A0F',
          800: '#3F2614',
          700: '#5B3620',
        },
      },
      fontFamily: {
        display: ['Bebas Neue', 'serif'],
      },
      boxShadow: {
        saloon: '0 10px 25px rgba(0, 0, 0, 0.65)',
      },
      backgroundImage: {
        parchment: 'radial-gradient(circle at top, rgba(255,255,255,0.15), transparent)',
      },
    },
  },
  plugins: [],
};
