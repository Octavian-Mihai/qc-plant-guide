/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#2D6A4F',
          light: '#40916C',
          lighter: '#52B788',
          dark: '#1B4332',
        },
        cream: '#FFFDF7',
        offwhite: '#F8F9FA',
        darkbg: {
          DEFAULT: '#0d2818',
          card: '#1e3a2f',
          text: '#e8f5e9',
          muted: '#95d5b2',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
