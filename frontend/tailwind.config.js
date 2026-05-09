/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rose: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
        },
        airbnb: {
          red: '#FF385C',
          pink: '#E61E4D',
          dark: '#222222',
          gray: '#717171',
          light: '#F7F7F7',
        }
      },
      fontFamily: {
        sans: ['Circular Std', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'airbnb': '0 6px 16px rgba(0, 0, 0, 0.12)',
        'airbnb-hover': '0 6px 20px rgba(0, 0, 0, 0.2)',
      }
    },
  },
  plugins: [],
}