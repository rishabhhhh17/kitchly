import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FBF6EF',
          100: '#F4ECDD',
          200: '#EAD9BE',
          300: '#DCC299'
        },
        clay: {
          400: '#C97B5C',
          500: '#B65A38',
          600: '#9A4724',
          700: '#7C3818'
        },
        ink: {
          700: '#3A2A1F',
          800: '#27190F',
          900: '#160C05'
        },
        moss: {
          500: '#6F7A4B',
          600: '#566039'
        },
        butter: '#F2C25B'
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif']
      },
      borderRadius: {
        soft: '14px',
        pebble: '24px'
      },
      boxShadow: {
        warm: '0 8px 24px -12px rgba(122, 56, 24, 0.18)',
        lift: '0 20px 50px -20px rgba(38, 25, 15, 0.25)'
      },
      maxWidth: {
        wrap: '1240px'
      }
    }
  },
  plugins: []
};

export default config;
