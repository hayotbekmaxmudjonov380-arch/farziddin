/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#02050e',
          900: '#050b1e',
          800: '#0a1530',
          700: '#122146',
          600: '#1a2f63',
          500: '#244183',
        },
        accent: {
          300: '#5fffc8',
          400: '#2dffb0',
          500: '#10e68a',
          600: '#08c271',
          700: '#049957',
        },
        gold: {
          300: '#ffd966',
          400: '#f5c842',
          500: '#e0a823',
          600: '#b8861a',
        },
        neon: {
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
        },
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        heading: ['Unbounded', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        'float-slow': 'float-slow 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'spin-slow': 'spin-slow 20s linear infinite',
        'spin-slower': 'spin-slow 40s linear infinite',
        shimmer: 'shimmer 3s linear infinite',
      },
    },
  },
  plugins: [],
};
