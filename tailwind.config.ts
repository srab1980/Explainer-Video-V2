import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'oklch(0.45 0.15 290)', // Deep Purple
          foreground: 'oklch(1 0 0)', // White text
        },
        secondary: {
          DEFAULT: 'oklch(0.65 0.12 200)', // Teal
          foreground: 'oklch(1 0 0)', // White text
        },
        accent: {
          DEFAULT: 'oklch(0.70 0.15 30)', // Coral
          foreground: 'oklch(1 0 0)', // White text
        },
        amber: {
          DEFAULT: 'oklch(0.75 0.15 80)', // Amber (AI features)
          foreground: 'oklch(0.20 0 0)', // Dark text
        },
        muted: {
          DEFAULT: 'oklch(0.95 0.02 290)', // Light Purple
          foreground: 'oklch(0.45 0 0)', // Medium text
        },
        background: 'oklch(0.98 0 0)', // Light Gray
        foreground: 'oklch(0.20 0 0)', // Dark text
        card: {
          DEFAULT: 'oklch(1 0 0)', // White
          foreground: 'oklch(0.20 0 0)', // Dark text
        },
        border: 'oklch(0.90 0 0)', // Light gray border
        destructive: {
          DEFAULT: 'oklch(0.55 0.20 25)', // Red
          foreground: 'oklch(1 0 0)', // White text
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
