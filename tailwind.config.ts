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
        bg: {
          0: "#070A12",
          1: "#0B1020",
          2: "#0F1730",
        },
        text: {
          0: "#EAF0FF",
          1: "#B8C3E6",
          muted: "#7D89B0",
        },
        primary: {
          DEFAULT: "#7C5CFF",
          2: "#B26BFF",
        },
        accent: "#31D7FF",
        success: "#2EE59D",
        warning: "#FFCC66",
        danger: "#FF5470",
      },
      fontFamily: {
        display: ["Space Grotesk", "Inter", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      borderRadius: {
        DEFAULT: "16px",
      },
      boxShadow: {
        glow: "0 0 24px rgba(124, 92, 255, 0.35)",
      },
    },
  },
  plugins: [],
};
export default config;
