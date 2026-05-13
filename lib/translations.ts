import en from "../locales/en.json";
import hi from "../locales/hi.json";
import bn from "../locales/bn.json";

export type Language = "en" | "hi" | "bn";

export const translations = {
  en,
  hi,
  bn
};

export type TranslationKey = keyof typeof translations.en | string;
