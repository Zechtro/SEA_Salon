import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    container: {
      padding: {
        DEFAULT: '15px',
      }
    },
    screens: {
      sm: '640px',
      md: '768px',
      lg: '960px',
      xl: '1200px',
      '2xl': '1500px'
    },
    fontFamily: {
      primary: 'DM Serif Display',
      secondary: 'Jost',
    },
    backgroundImage: {
      hero: 'url(/assets/hero/bg.jpeg)'
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#292F36',
          hover: '#B88C5D'
        },
        secondary: '#4D5053',
        accent: {
          DEFAULT: '#CDA274',
          secondary: '#F4F0EC',
          hover: '#B88C5D'
        }
      }
    },
  },
  plugins: [],
} satisfies Config;
