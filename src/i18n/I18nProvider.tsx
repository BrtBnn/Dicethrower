import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  DEFAULT_LANGUAGE,
  isLanguageCode,
  languages,
  locales,
  type Direction,
  type LanguageCode,
  type MessageKey,
} from './locales';

const STORAGE_KEY = 'dicethrower.lang';

export type TranslateVars = Record<string, string | number>;

interface I18nValue {
  lang: LanguageCode;
  dir: Direction;
  /** Neemt elke tekst als `string`; ongeldige codes worden genegeerd. */
  setLang: (code: string) => void;
  /** Vertaalt een sleutel en vult {plaatshouders} in. */
  t: (key: MessageKey, vars?: TranslateVars) => string;
  /** Geeft de zin met de {plaatshouders} er nog in. */
  tRaw: (key: MessageKey) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

// Bewaarde keuze, anders de taal van de browser, anders het standaard.
function detectLanguage(): LanguageCode {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && isLanguageCode(saved)) return saved;
  } catch {
    /* localStorage kan geblokkeerd zijn */
  }
  const preferred = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language];
  for (const tag of preferred) {
    const base = tag.toLowerCase().split('-')[0];
    if (isLanguageCode(base)) return base;
  }
  return DEFAULT_LANGUAGE;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LanguageCode>(detectLanguage);
  const dir: Direction = languages.find((l) => l.code === lang)?.dir ?? 'ltr';

  const setLang = useCallback((code: string) => {
    if (!isLanguageCode(code)) return;
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

  const tRaw = useCallback(
    (key: MessageKey): string => locales[lang][key] || locales[DEFAULT_LANGUAGE][key] || key,
    [lang]
  );

  const t = useCallback(
    (key: MessageKey, vars?: TranslateVars): string => {
      const template = tRaw(key);
      if (!vars) return template;
      return template.replace(/\{(\w+)\}/g, (match, name: string) => (name in vars ? String(vars[name]) : match));
    },
    [tRaw]
  );

  const value = useMemo<I18nValue>(() => ({ lang, setLang, t, tRaw, dir }), [lang, setLang, t, tRaw, dir]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const value = useContext(I18nContext);
  if (!value) throw new Error('useI18n moet binnen een I18nProvider worden gebruikt');
  return value;
}
