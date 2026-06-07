// @ts-check
import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import sitemap from "@astrojs/sitemap";
import partytown from "@astrojs/partytown";
import tailwindcss from "@tailwindcss/vite";
import robotsTxt from "astro-robots-txt";

// https://astro.build/config
export default defineConfig({
  site: "https://your-domain.com",
  output: "static",
  compressHTML: true,

  i18n: {
    defaultLocale: "en",
    locales: ["en", "de", "fr", "ja", "es"],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  integrations: [
    svelte(),
    sitemap({
      i18n: {
        defaultLocale: "en",
        locales: {
          en: "en-US",
          de: "de-DE",
          fr: "fr-FR",
          ja: "ja-JP",
          es: "es-ES",
        },
      },
    }),
    robotsTxt(),
    partytown({ config: { forward: ["dataLayer.push"] } }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
