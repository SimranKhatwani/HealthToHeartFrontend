import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Automatically import all JSON files in locales/en/ and locales/fr/
const enModules = import.meta.glob('./locales/en/*.json', { eager: true });
const frModules = import.meta.glob('./locales/fr/*.json', { eager: true });

const combineNamespaces = (modules) => {
  const translation = {};
  for (const path in modules) {
    const ns = path.split('/').pop().replace('.json', '');
    translation[ns] = modules[path].default || modules[path];
  }
  return { translation };
};

const resources = {
    en: combineNamespaces(enModules),
    fr: combineNamespaces(frModules),
};

const savedLanguage = localStorage.getItem("i18nextLng") || "en";

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: savedLanguage,
        fallbackLng: "en",
        interpolation: {
            escapeValue: false,
        },
        defaultNS: 'translation',
    });

export default i18n;