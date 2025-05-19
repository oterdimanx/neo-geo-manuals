/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'neo-geo-blue': '#0055A4',
                'neo-geo-red': '#E60012',
              },
              fontFamily: {
                pixel: ['"Press Start 2P"', 'cursive'],
                roboto: ['Roboto', 'sans-serif'],
                noto: ['"Noto Sans"', 'sans-serif'],
              },
              animation: {
                "fade-in": "fadeIn 0.5s ease-out",
              },
              keyframes: {
                fadeIn: {
                  "0%": { opacity: 0 },
                  "100%": { opacity: 1 },
                },
              },
        },
    },
    plugins: [],
}