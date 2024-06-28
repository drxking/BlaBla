/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.ejs"],
  theme: {
    extend: {
      keyframes: {
        popup: {
          "0%": {
            transform: 'translateY(-100%) scale(0.5)',
            opacity: 0
          },
          "15%": {
            transform: "translateY(0%)",
            opacity: 1
          },
          "85%": {
            opacity: 1,
            transform: "translateY(0%) scale(1)",
          },
          "100%": {
            opacity: 0,
            transform: " translateY(-100%)"
          }

        }
      },
      animation:{
        popup:"popup 3s"
      }
    },
  },
  plugins: [],
}