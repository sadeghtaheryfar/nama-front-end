/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'header': "url('/Images/home/HomeHeader.svg')",
        'header-masjed': "url('/Images/masajed/header.svg')",
        'header-masjed-desktop': "url('/Images/masajed/header-desktop-msj.svg')",
        'background': "url('/Images/vector.svg')",
      },
      dropShadow: {
        '3xl': '0 0 20px rgba(0, 0, 0, 0.12)',
      }
    },
  },
  plugins: [],
};
