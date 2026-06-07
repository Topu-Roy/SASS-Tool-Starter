import en from "./en";
import de from "./de";
import fr from "./fr";
import ja from "./ja";
import es from "./es";

export const locales = ["en", "de", "fr", "ja", "es"] as const;
export type Locale = (typeof locales)[number];

const localeToHrefLang: Record<Locale, string> = {
  en: "en-US",
  de: "de-DE",
  fr: "fr-FR",
  ja: "ja-JP",
  es: "es-ES",
};

export function getHrefLang(locale: string): string {
  return localeToHrefLang[locale as Locale] ?? locale;
}

const contentMap: Record<Locale, typeof en> = { en, de, fr, ja, es };

export function getContent(locale: string): (typeof en) | undefined {
  return contentMap[locale as Locale];
}
