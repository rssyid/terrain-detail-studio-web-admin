/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brutal: {
          bg: '#F4F0EA',
          darkBg: '#121214',
          yellow: '#FFE600',
          pink: '#FF007A',
          cyan: '#00F0FF',
          green: '#00FF66',
          purple: '#B877FF',
          orange: '#FF6B00',
          black: '#000000',
          card: '#FFFFFF',
          darkCard: '#1A1A1E',
        },
      },
      boxShadow: {
        'brutal-sm': '3px 3px 0px 0px #000000',
        'brutal': '5px 5px 0px 0px #000000',
        'brutal-lg': '8px 8px 0px 0px #000000',
        'brutal-pink': '5px 5px 0px 0px #FF007A',
        'brutal-cyan': '5px 5px 0px 0px #00F0FF',
        'brutal-yellow': '5px 5px 0px 0px #FFE600',
        'brutal-white': '5px 5px 0px 0px #FFFFFF',
      },
      borderWidth: {
        '3': '3px',
        '4': '4px',
      },
      fontFamily: {
        mono: ['"Space Mono"', '"JetBrains Mono"', 'monospace'],
        sans: ['"Space Grotesk"', '"Plus Jakarta Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
