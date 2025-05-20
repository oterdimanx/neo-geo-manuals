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
                "flip": 'flip 1s ease-in-out forwards',
                'apptitle': 'apptitle 15s linear infinite',
                'drip': 'drip 20s ease-out infinite',
              },
              keyframes: {
                fadeIn: {
                  "0%": { opacity: 0 },
                  "100%": { opacity: 1 },
                },
                flip: {
                    '0%': { transform: 'rotateY(0deg)' },
                    '100%': { transform: 'rotateY(180deg)' },
                  },
                apptitle: {
                    '100%': {
                        backgroundPosition: '.5vh 0%',
                    },
                },
                drip: {
                    '0%': { transform: 'translateY(0)', opacity: 1 },
                    '80%': { opacity: 1 },
                    '100%': { transform: 'translateY(60px)', opacity: 0 },
                  },
              },
              transform: ['hover', 'focus'],
        },
    },
    plugins: [],
}