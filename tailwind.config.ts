// @ts-nocheck
import { nextui } from "@nextui-org/theme";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {},
      colors: {
        'chatBg': '#232735',
        'leftBarBg': '#19202E',
        'darkGray': '#888888',
        'darkBlue': '#1566A3',
        'lightBlue': '#60CDFF',
        'mainGreen': '#6CCB5F'
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
    },
    nextui({
      themes: {
        light: {
          colors: {
            primary: {
              DEFAULT: "#60CDFF",
              foreground: "#FFFFFF",
            },
            focus: "#YOUR_FOCUS_COLOR",
          },
        },
      },
    }),
  ],
};
export default config;
