import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { DEFAULT_LANGUAGE, languages, locales } from './locales.js';

const STORAGE_KEY = 'dicethrower.lang';
const I18nContext = createContext(null);

// Bewaarde keuze, anders de taal van de browser, anders het standaard.
function detectLanguage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && locales[saved]) return saved;
  } catch {
    /* localStorage kan geblokkeerd zijn */
  }
  const preferred = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language];
  for (const tag of preferred) {
    const base = String(tag).toLowerCase().split('-')[0];
    if (locales[base]) return base;
  }
  return DEFAULT_LANGUAGE;
}

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(detectLanguage);
  const dir = (languages.find((l) => l.code === lang) || {}).dir || 'ltr';

  const setLang = useCallback((code) => {
    if (!locales[code]) return;
    setLangState(code);
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch {
      /* niet erg: de keuze geldt dan alleen voor dit bezoek */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    document.title = locales[lang].title;
  }, [lang, dir]);

  // tRaw geeft de zin met de {plaatshouders} nog erin.
  const tRaw = useCallback(
    (key) => locales[lang][key] ?? locales[DEFAULT_LANGUAGE][key] ?? key,
    [lang]
  );

  const t = useCallback(
    (key, vars) => {
      const template = tRaw(key);
      if (!vars) return template;
      return template.replace(/\{(\w+)\}/g, (match, name) => (name in vars ? String(vars[name]) : match));
    },
    [tRaw]
  );

  const value = useMemo(() => ({ lang, setLang, t, tRaw, dir }), [lang, setLang, t, tRaw, dir]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const value = useContext(I18nContext);
  if (!value) throw new Error('useI18n moet binnen een I18nProvider worden gebruikt');
  return value;
}
