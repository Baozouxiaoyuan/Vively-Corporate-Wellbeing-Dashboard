/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17231f",
        mist: "#f5f8f7",
        sage: "#4f7f6a",
        teal: "#237a73",
        coral: "#d96858",
      },
      boxShadow: {
        soft: "0 8px 30px rgba(23, 35, 31, 0.08)",
      },
    },
  },
  plugins: [],
};
