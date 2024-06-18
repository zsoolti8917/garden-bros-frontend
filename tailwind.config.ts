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
          
          500: "#348E38",
          700: "#0F4229",
          800: "#072A19",
          
        },
        fontFamily: {
          spaceMono: "Space Mono", 
          lexendDeca: { "": "Lexend Deca" },
        },
        
      },
    },
  },
  plugins: [],
};
export default config;
