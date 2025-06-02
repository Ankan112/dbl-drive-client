/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        floatMedium: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        floatFast: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        floatDelay: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
      animation: {
        float: 'float 2s ease-in-out infinite',
        floatSlow: 'floatSlow 3s ease-in-out infinite',
        floatMedium: 'floatMedium 2s ease-in-out infinite',
        floatFast: 'floatFast 1.5s ease-in-out infinite',
        floatDelay: 'floatDelay 2.5s ease-in-out infinite 1s',
      },
    },
  },
  plugins: [require("daisyui")],
  corePlugins: {
    preflight: false,
  },
};
