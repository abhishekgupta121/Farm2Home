import en from "../locales/en.json";
import hi from "../locales/hi.json";

export type Language = "en" | "hi";

export const translations = {
  en,
  hi
};

export type TranslationKey = keyof typeof translations.en | string;
