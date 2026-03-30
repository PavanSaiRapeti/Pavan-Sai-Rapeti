/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}', './pages/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'ubuntu': ['Ubuntu', 'sans-serif'],
        'fontbutton': ['FontButton', 'sans-serif'],
        'child':['special', 'sans-serif'] ,
        'logo':['logo', 'sans-serif'] 
      },
    },
  plugins: [],
}
}