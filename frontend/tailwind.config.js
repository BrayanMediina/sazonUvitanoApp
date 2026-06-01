/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#fdf8f5',
          100: '#faeee4',
          200: '#f3d4bb',
          300: '#e8b48a',
          400: '#d98c55',
          500: '#c45e21',
          600: '#a34d1a',
          700: '#8f5b2a',
          800: '#7a4422',
          900: '#5f290f',
          950: '#3d1808',
        },
      },
      boxShadow: {
        soft: '0 12px 32px rgba(95, 41, 15, 0.12)',
      },
    },
  },
  plugins: [],
}
