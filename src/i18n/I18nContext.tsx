import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { translations, type Lang } from './translations';

interface I18nContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: typeof translations.uz;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = typeof localStorage !== 'undefined' ? localStorage.getItem('lang') : null;
    return (saved as Lang) || 'uz';
  });

  const setLang = (newLang: Lang) => {
    setLangState(newLang);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('lang', newLang);
    }
  };

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value: I18nContextValue = {
    lang,
    setLang,
    t: translations[lang],
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
