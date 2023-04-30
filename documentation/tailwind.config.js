/** @type {import('tailwindcss').Config} */
module.exports = {
  corePlugins: {
    preflight: false
  },
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(153, 47%, 49%)',
        secondary: 'hsl(0deg 0% 94.9%)',
        error: 'hsla(3, 100%, 61%, 1)',
        success: 'hsla(162, 95%, 41%, 1)',
        white: '#ffffff',
        transparent: 'transparent',
        gray: {
          100: 'hsla(260,11%,85%,1)'
        }
      }
    }
  },
  plugins: []
}
