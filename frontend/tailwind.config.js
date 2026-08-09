/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "tertiary-container": "#3a3a3c",
        "surface-container-high": "#2c2c2e",
        "on-primary-fixed": "#ffffff",
        "error": "#ff453a",
        "on-tertiary": "#ffffff",
        "on-primary-container": "#ffffff",
        secondary: "#8e8e93",
        "on-surface": "#ffffff",
        "surface-variant": "#2c2c2e",
        "on-primary": "#ffffff",
        background: "#161616",
        "surface-tint": "#ff3b30",
        "surface-container": "#242426",
        "surface-container-low": "#1c1c1e",
        "surface-dim": "#161616",
        primary: "#ff3b30",
        "primary-container": "#d7261b",
        surface: "#161616",
        "surface-container-highest": "#3a3a3c",
        tertiary: "#8e8e93",
        "surface-bright": "#48484a",
        outline: "#3a3a3c",
        "on-surface-variant": "#a1a1a6",
        "surface-container-lowest": "#121212",
        "primary-fixed": "#ff453a"
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
        full: "9999px"
      },
      spacing: {
        lg: "24px",
        "container-padding": "20px",
        md: "16px",
        xl: "32px",
        unit: "4px",
        "card-gutter": "12px",
        sm: "8px",
        xs: "4px"
      },
      fontFamily: {
        "headline-lg-mobile": ["Plus Jakarta Sans", "sans-serif"],
        "headline-lg": ["Plus Jakarta Sans", "sans-serif"],
        "label-bold": ["Plus Jakarta Sans", "sans-serif"],
        "headline-xl": ["Plus Jakarta Sans", "sans-serif"],
        "title-md": ["Plus Jakarta Sans", "sans-serif"],
        "price-display": ["Plus Jakarta Sans", "sans-serif"],
        "body-lg": ["Be Vietnam Pro", "sans-serif"],
        "body-sm": ["Be Vietnam Pro", "sans-serif"]
      }
    }
  },
  plugins: [],
}
