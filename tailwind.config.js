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
                pixel: ['Press Start 2P', 'cursive'],
              },
        },
    },
    plugins: [],
}