/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        // Premium Dark Palette
        bg: {
          primary: '#09090b',   // Zinc 950
          secondary: '#18181b', // Zinc 900
          tertiary: '#27272a',  // Zinc 800
        },
        accent: {
          primary: '#6366f1',   // Indigo 500
          secondary: '#4f46e5', // Indigo 600
          hover: '#4338ca',     // Indigo 700
        },
        surface: {
          card: 'rgba(24, 24, 27, 0.7)',
          hover: 'rgba(39, 39, 42, 0.5)',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
