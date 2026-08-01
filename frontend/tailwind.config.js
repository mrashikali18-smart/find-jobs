/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          50: '#f2f6f5',
          100: '#dce6e4',
          400: '#4d7573',
          600: '#1e4e4c',
          700: '#153938',
          800: '#0f2b2a',
          900: '#0a1f1e',
        },
        amber: {
          400: '#f5a623',
          500: '#e8930f',
          600: '#c97a08',
        },
        paper: '#f8f6f1',
        ink900: '#12201f',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      borderRadius: {
        loop: '2rem',
      },
      boxShadow: {
        card: '0 1px 2px rgba(15,43,42,0.06), 0 8px 24px -12px rgba(15,43,42,0.18)',
      },
    },
  },
  plugins: [],
};
