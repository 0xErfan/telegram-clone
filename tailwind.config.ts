// @ts-nocheck
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {},
      colors: {
        'chatBg': '#232735',
        'leftBarBg': '#19202E',
        'darkGray': '#888888',
        'darkBlue': '#1566A3',
        'lightBlue': '#60CDFF'
      },
      fontFamily: {
        'segoeRegular': 'segoeRegular',
        'segoeBold': 'segoeBold',
        'segoeLight': 'segoeLight'
      }
    },
  },
  plugins: [
    function ({ addVariant }) {
      addVariant('ch', '& > *');
      addVariant('ch-hover', '& > *:hover');
    }
  ],
};
export default config;
