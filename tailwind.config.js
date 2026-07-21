/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17231f",
        mist: "#fffbf9",
        sage: "#4f7f6a",
        teal: "#237a73",
        coral: "#d96858",
        "dark-green": {
          900: "#173f35",
        },
      },
      fontFamily: {
        sans: ["Basis Grotesque", "Fellix", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["Quincy", "Georgia", "serif"],
      },
      boxShadow: {
        soft: "0 8px 30px rgba(23, 35, 31, 0.08)",
      },
    },
  },
  plugins: [],
};
