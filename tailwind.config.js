/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        saathi: {
          bg: '#FAF8F2',        // warm ivory
          text: '#30352F',      // soft charcoal
          muted: '#77786F',     // secondary text
          border: '#EAE9E2',    // warm subtle border
          card: '#FFFFFF',      // card background
          sage: {
            DEFAULT: '#789B7D', // primary accent
            light: '#E6F1E8',   // soft green background
            dark: '#587A5D',
            hover: '#698B6E',
          },
          peach: {
            DEFAULT: '#FCE8D8', // warm peach
            dark: '#E09B75',
            light: '#FFF5ED',
          },
          lavender: {
            DEFAULT: '#E8EAF7', // soft lavender
            dark: '#7A83B8',
            light: '#F4F5FB',
          },
          yellow: {
            DEFAULT: '#F5E9B9', // soft warm yellow
            dark: '#C8A336',
            light: '#FDFBEF',
          },
          coral: {
            DEFAULT: '#FAD8D8', // gentle alert
            dark: '#D95C5C',
            light: '#FFF0F0',
          }
        }
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
      },
      boxShadow: {
        'soft': '0 2px 8px -2px rgba(48, 53, 47, 0.05), 0 1px 3px -1px rgba(48, 53, 47, 0.03)',
        'card': '0 4px 16px -4px rgba(48, 53, 47, 0.06), 0 2px 6px -2px rgba(48, 53, 47, 0.04)',
        'elevated': '0 12px 32px -8px rgba(48, 53, 47, 0.1), 0 4px 12px -2px rgba(48, 53, 47, 0.05)',
      },
      borderRadius: {
        'xl': '14px',
        '2xl': '18px',
        '3xl': '24px',
      }
    },
  },
  plugins: [],
}
