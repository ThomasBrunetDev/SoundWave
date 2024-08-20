/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        tanker: "Tanker",
        supremeBold: "Supreme-Bold",
        supremeMedium: "Supreme-Medium",
        supremeRegular: "Supreme-Regular",
        supremeBoldItalic: "Supreme-BoldItalic",
        heavitas: "Heavitas",
      },
      colors: {
        'perso-mauveFonce': '#492F75',
        'perso-mauve': '#5F3C96',
        'perso-mauvePale': '#955EED',
        'perso-mauveLecteur': '#A67FE7',
        'perso-bleuPale' : '#76AACE',
        'perso-bleu' : '#1F75C4',
        'perso-bleuFonce' : '#154F85',
        'perso-grisPale' : '#919191',
        'perso-grisFonce' : '#434343',
        'perso-orangePale' : '#ED9F40',


      }
    },
  },
  screens: {
    xl: "1200px",
  },
  plugins: [],
};
