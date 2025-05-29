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
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1.16' }],
        '6xl': ['3.75rem', { lineHeight: '1.16' }],
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
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