/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
        mono: ['var(--font-mono)'],
      },
      colors: {
        stone: {
          ink: '#1a1614',
          bone: '#ede4d3',
          ash: '#8a7f71',
          ochre: '#c97b3c',
          rust: '#8b3a1f',
          moss: '#4a5d3a',
        },
      },
    },
  },
  plugins: [],
};
