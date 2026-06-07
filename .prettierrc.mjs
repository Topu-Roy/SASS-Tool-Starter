export default {
  plugins: [
    "prettier-plugin-astro",
    "prettier-plugin-svelte",
    "prettier-plugin-tailwindcss", // must be last
  ],
  overrides: [
    { files: "*.astro", options: { parser: "astro" } },
    { files: "*.svelte", options: { parser: "svelte" } },
  ],
  singleQuote: false,
  semi: true,
  tabWidth: 2,
  printWidth: 115,
  arrowParens: "avoid",
  trailingComma: "es5",
};
