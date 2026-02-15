import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF69B4',
          50: '#FFF0F5',
          100: '#FFE1EE',
          200: '#FFC3DD',
          300: '#FFA5CC',
          400: '#FF87BB',
          500: '#FF69B4',
          600: '#E75480',
          700: '#CF3F6C',
          800: '#B72A58',
          900: '#9F1544',
        },
        secondary: {
          DEFAULT: '#FFD700',
          50: '#FFFEF0',
          100: '#FFFBE1',
          200: '#FFF7C3',
          300: '#FFF3A5',
          400: '#FFEF87',
          500: '#FFD700',
          600: '#E7C300',
          700: '#CFAF00',
          800: '#B79B00',
          900: '#9F8700',
        },
        accent: {
          DEFAULT: '#FFF0F5',
          50: '#FFFAFC',
          100: '#FFF5F9',
          200: '#FFF0F5',
          300: '#FFE6F1',
          400: '#FFDCED',
          500: '#FFD2E9',
          600: '#FFC8E5',
          700: '#FFBEE1',
          800: '#FFB4DD',
          900: '#FFAAD9',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px rgba(0, 0, 0, 0.05)',
        'medium': '0 4px 20px rgba(0, 0, 0, 0.1)',
        'strong': '0 10px 40px rgba(0, 0, 0, 0.15)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
    },
  },
  plugins: [],
};

export default config;
