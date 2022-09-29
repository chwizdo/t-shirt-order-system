/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        black: "#101010",
        "black-hover": "#363636",
        white: "#FFFFFF",
        "white-hover": "#F3F3F3",
        error: "#DE0000",
        "error-hover": "#F35B5B",
        grey: "#8A8A8A",
        "light-grey": "#C7C7C7",
      },
      spacing: {
        13: "3.25rem",
      },
      fontFamily: {
        sans: ["Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};
