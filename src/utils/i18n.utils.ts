import { langConstants } from "@/constants";
import { enTranslations, esTranslations } from "@/resources";
import i18n from "i18n";
i18n.configure({
  locales: langConstants.locale,
  defaultLocale: langConstants.default_locale,
  staticCatalog: {
    en: enTranslations,
    es: esTranslations,
  },
  header: "accept-language",
  extension: ".ts",
  retryInDefaultLocale: true,
});

// Set it as a global variable
globalThis.i18n = i18n;

export { i18n };
