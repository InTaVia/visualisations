/** @typedef {import('tailwindcss').Config} TailwindConfig */

/** @type {TailwindConfig} */
const config = {
  content: ['./@(src|stories)/**/*.@(css|ts|tsx)'],
  corePlugins: {
    backgroundOpacity: false,
    borderOpacity: false,
    divideOpacity: false,
    placeholderOpacity: false,
    ringOpacity: false,
    textOpacity: false,
  },
  plugins: [],
  theme: {
    extend: {},
  },
}

module.exports = config
