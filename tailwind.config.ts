import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  daisyui: {
    themes: [
      {
        mytheme: {

          "primary": "#a855f7",

          "secondary": "#ede9fe",

          "accent": "#5b21b6",

          "neutral": "#ff00ff",

          "base-100": "#1f2937",

          "info": "#38bdf8",

          "success": "#4ade80",

          "warning": "#facc15",

          "error": "#ef4444",
        },
      },
    ],
  },
  plugins: [require('daisyui')],
} satisfies Config;
