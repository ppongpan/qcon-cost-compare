/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'primary-brand': '#f97316',
        'primary-dark': '#ea580c',
        'primary-light': '#fff7ed',
        'accent-black': '#1f2937',
      },
      keyframes: {
        'fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        'slide-in-from-bottom': { '0%': { transform: 'translateY(10px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
      },
      animation: { 'in': 'fade-in 0.3s ease-out, slide-in-from-bottom 0.4s ease-out' }
    },
  },
  plugins: [],
}
