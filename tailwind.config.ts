import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0077BE', // Ocean blue
          light: '#0088D6',
          dark: '#005C91',
        },
        secondary: {
          DEFAULT: '#00CC66', // Electric green
          light: '#00E673',
          dark: '#009F50',
        },
        accent: {
          DEFAULT: '#FF6B35', // Sunset orange
          light: '#FF855C',
          dark: '#E65422',
        },
        neutral: {
          DEFAULT: '#333333', // Charcoal gray
          light: '#F5F5F5', // Light gray
          'light-hover': '#E8E8E8',
          'dark-hover': '#404040',
        },
      },
      screens: {
        'mobile': '320px',
        'tablet': '769px',
        'desktop': '1025px',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          mobile: '1rem',
          tablet: '2rem',
          desktop: '4rem',
        },
      },
    },
  },
  plugins: [],
};

export default config; 