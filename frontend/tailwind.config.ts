import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dacan Tour brand — Kyrgyz lakes, mountains, Silk Road sun
        ink: "#0B1512", // deep near-black forest (dark bg / text)
        pine: "#12362B", // deep forest green
        lake: {
          DEFAULT: "#0E9C93", // signature turquoise (Kel-Suu / Song-Köl)
          light: "#8FD3CC",
          dark: "#0A6E68",
        },
        sun: "#E3A84E", // warm gold / sunset over the steppe
        clay: "#B85C38", // terracotta / Silk Road
        sand: {
          DEFAULT: "#F6F1E6", // warm light background
          deep: "#ECE3D2",
        },
        stone: {
          50: "#F7F6F3",
          100: "#EDEBE5",
          200: "#DAD6CC",
          300: "#BBB4A6",
          400: "#8F8779",
          500: "#6B6355",
          600: "#4E4739",
          700: "#3A342A",
          800: "#26221B",
          900: "#171410",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.04em",
        overline: "0.22em",
      },
      maxWidth: {
        content: "1200px",
        wide: "1440px",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slow-zoom": {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.12)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.9s cubic-bezier(0.22,1,0.36,1) forwards",
        "slow-zoom": "slow-zoom 20s ease-out forwards",
        marquee: "marquee 40s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
