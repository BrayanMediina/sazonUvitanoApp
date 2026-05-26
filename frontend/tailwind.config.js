/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          950: '#5F290F',
          900: '#7D3A14',
          700: '#C45E21',
          500: '#CF9E55',
          300: '#E8C27C',
          100: '#FEFEFE'
        }
      },
      boxShadow: {
        soft: '0 12px 32px rgba(95, 41, 15, 0.12)'
      }
    }
  },
  plugins: []
}
