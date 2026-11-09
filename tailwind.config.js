/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#0066FF',
          cyan: '#00F0FF',
          red: '#FF0033',
          darkRed: '#E50914',
          bg: '#0D0D0D',
          card: '#121212',
          cardHover: '#1E1E1E',
          surface: '#181818',
        }
      }
    },
  },
  plugins: [],
}