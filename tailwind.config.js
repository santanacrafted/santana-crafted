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
      },
      screens: {
        'mobile-se': '375px',
        'mobile': '400px',
        'minitablet': '535px',
      },
    },
  },
  plugins: [],
}

