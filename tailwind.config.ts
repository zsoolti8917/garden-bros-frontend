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
          50: '#f0f9f1',
          100: '#dbf0dd',
          200: '#b9e2bf',
          300: '#8bcb94',
          400: '#5baf67',
          500: '#348E38',
          600: '#287a2d',
          700: '#206125',
          800: '#1c4e21',
          900: '#0F4229',
          950: '#072A19'
        },
        secondary: {
          50: '#faf8f5',
          100: '#f5f0e8',
          200: '#ebe0d0',
          300: '#dcc9b0',
          400: '#c9ad89',
          500: '#ba956b',
          600: '#ad865f',
          700: '#906e4f',
          800: '#755944',
          900: '#5f4937',
          950: '#31241c'
        },
        accent: {
          50: '#fef7ee',
          100: '#fdecd6',
          200: '#fbd5ac',
          300: '#f8b877',
          400: '#f49440',
          500: '#f1761a',
          600: '#e25d10',
          700: '#bb4710',
          800: '#953815',
          900: '#782f14',
          950: '#411508'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
        mono: ['Space Mono', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
    },
  },
  plugins: [],
};
export default config;
