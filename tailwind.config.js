/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        base: "var(--color-base)",
        base1: "var(--color-base1)",
        base2: "var(--color-base2)",
        base3: "var(--color-base3)",
        baseText: "var(--color-baseText)",
        baseText1: "var(--color-baseText1)",
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        accent: "var(--color-accent)",
        baseShadow: "var(--color-baseShadow)",
      },
    },
  },
  plugins: [require("@tailwindcss/aspect-ratio")],
};
