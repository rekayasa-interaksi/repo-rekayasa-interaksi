/** @type {import('tailwindcss').Config} */
const colors = require('./src/constants/colorConstant').colors;

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        plusJakartaSans: ['Plus Jakarta Sans', 'sans-serif'],
        openSans: ['Open Sans', 'sans-serif']
      },
      colors: {
        primary: colors.primary,
        secondary: colors.secondary,
        accent: colors.accent,
        background: colors.background,
        light: colors.light,
        dark: colors.dark
      }
    }
  },
  plugins: []
};
