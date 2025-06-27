/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}', // App router support
    './pages/**/*.{js,ts,jsx,tsx}', // Pages if any
    './components/**/*.{js,ts,jsx,tsx}', // Components
    './src/**/*.{js,ts,jsx,tsx}', // Catch-all for shared or nested dirs
  ],
  theme: {
    extend: {},
  },
  darkMode: 'class', // if you're using next-themes
  plugins: [],
};
