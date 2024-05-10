const {
   hasSelectionSupport,
} = require("@testing-library/user-event/dist/utils");


const withMT = require("@material-tailwind/html/utils/withMT");

/** @type {import('tailwindcss').Config} */
module.exports = {
   content: ["./src/**/*.{js,jsx,ts,tsx}"],
   theme: {
      screens: {
         sm: "480px",
         md: "768px",
         lg: "976px",
         xl: "1440px",
      },
      extend: {
         fontFamily: {
            alegreya: ["ui-serif", "Alegreya"],
            trocchi: ["ui-serif", "Trocchi"],
            playfair: ["ui-serif", "Playfair Display"],
            proza: ["ui-serif", "Proza Libre"]
         },
         colors: {
            brightRed: "hsl(12, 88%, 59%)",
            brightRedLight: "hsl(12, 88%, 69%)",
            brightRedSupLight: "hsl(12, 88%, 95%)",
            darkBlue: "hsl(228, 39%, 23%)",
            darkGrayishBlue: "hsl(227, 12%, 61%)",
            veryDarkBlue: "hsl(233, 12%, 13%)",
            veryPaleRed: "hsl(13, 100%, 96%)",
            veryLightGray: "hsl(0, 0%, 98%)",
         },
      },
   },
   plugins: [require("daisyui"), require('@headlessui/tailwindcss')({ prefix: 'ui' })],
   daisyui: {
      themes: ["light", "dark", "cupcake", "bumblebee", "emerald", "corporate", "synthwave", "retro", "cyberpunk", "valentine", "halloween", "garden", "forest", "aqua", "lofi", "pastel", "fantasy", "wireframe", "black", "luxury", "dracula", "cmyk", "autumn", "business", "acid", "lemonade", "night", "coffee", "winter"],
   },
};
