/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'rgb(229 231 235)', // equivalent to gray-200
        foreground: 'rgb(17 24 39)', // equivalent to gray-900
      },
    },
  },
  plugins: [],
};