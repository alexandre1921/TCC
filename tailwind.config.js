/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
      'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}',
    ],
    theme: {
      extend: {
        fontFamily: {
            'VT323': ['VT323', 'monospace'],
        },
      },
    },
    plugins: [
        require('@tailwindcss/container-queries'),
        require('flowbite/plugin'),
    ],
  }