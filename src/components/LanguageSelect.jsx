import { languages } from '../i18n/locales.js';
import { useI18n } from '../i18n/I18nProvider.jsx';

export default function LanguageSelect() {
  const { lang, setLang, t } = useI18n();
  return (
    <select
      id="language"
      className="form-select form-select-sm lang"
      value={lang}
      onChange={(e) => setLang(e.target.value)}
      aria-label={t('language')}
      title={t('language')}
    >
      {languages.map((l) => (
        <option key={l.code} value={l.code} lang={l.code}>
          {l.name}
        </option>
      ))}
    </select>
  );
}
