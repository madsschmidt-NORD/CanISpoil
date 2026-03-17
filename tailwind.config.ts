import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#05030a",
        panel: "#0b0813",
        line: "rgba(255,255,255,0.11)",
        maxblue: "#4b5cff",
        maxviolet: "#8557ff",
        maxlavender: "#cbb7ff"
      },
      boxShadow: {
        soft: "0 20px 60px rgba(0,0,0,0.35)"
      },
      backgroundImage: {
        hero: "radial-gradient(circle at top, rgba(97,76,255,0.28), transparent 36%), linear-gradient(180deg, #120b22 0%, #06030b 55%, #05030a 100%)"
      }
    }
  },
  plugins: []
};

export default config;
