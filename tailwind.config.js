/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      animation: {
        'marquee': 'marquee 60s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      }
    },
  },
  plugins: [],
}

