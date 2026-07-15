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
        // Official INEC Emerald Green Theme
        inec: {
          dark: "#021c11",
          primary: "#0d5c3d",
          medium: "#167853",
          light: "#1a9963",
          accent: "#22c55e",
          pale: "#dcfce7",
        },
        ballot: {
          cream: "#f9f7f3",
          tan: "#f5f1e8",
        },
      },
      fontFamily: {
        mono: ["JetBrains Mono", "Courier New", "monospace"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
