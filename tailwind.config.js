/** @type {import('tailwindcss').Config} */
module.exports = {
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
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
      },
    },
  },
  plugins: [],
}