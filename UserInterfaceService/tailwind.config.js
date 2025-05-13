/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2B3A55',
          light: '#3D4E6D',
          dark: '#1F2A3E',
        },
        secondary: {
          DEFAULT: '#A2D2FF',
          light: '#C1E3FF',
          dark: '#7EBDF7',
        },
        success: {
          DEFAULT: '#77DD77',
          light: '#9BE99B',
          dark: '#5BC25B',
        },
        gray: {
          50: '#F9FAFB',
          100: '#F1F1F1',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
      },
    },
  },
  plugins: [],
};