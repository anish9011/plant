/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        whiteSmoke: '#f5f5f5', // Add whiteSmoke color
      },
    },
  },
  plugins: [require('@tailwindcss/aspect-ratio'),],
}