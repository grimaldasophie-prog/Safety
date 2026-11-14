/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#0B1D3A',
        deep: '#081530',
        blue: '#0B3D91',
        blueHi: '#14509F',
        red: '#FC3D21',
        mist: '#C9D3E3',
        stable: '#2BB673',
        watch: '#F5B700',
        losing: '#FC3D21',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
