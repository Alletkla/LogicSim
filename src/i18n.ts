import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

export const supportedLngs = ['en', 'de']

console.log("Base URL: ", import.meta.env.VITE_BASE_URL)
//setting up i18n
i18n
  .use(Backend)           //for loading translation files
  .use(LanguageDetector)  //Detect browser language
  .use(initReactI18next)  //i18next goodies for react
  .init({
    debug: false,
    fallbackLng: 'en',
    backend: {
      loadPath: import.meta.env.VITE_BASE_URL + "/locales/{{lng}}/{{ns}}.json",
    },
    load: 'languageOnly',
    supportedLngs: supportedLngs, // Add the supported languages here
  });
export default i18n;