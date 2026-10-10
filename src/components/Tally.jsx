import { useI18n } from '../i18n/I18nProvider.jsx';

export default function Tally({ rolls }) {
  const { t } = useI18n();
  const counts = [0, 0, 0, 0, 0, 0];
  for (const roll of rolls) {
    for (const n of roll.values) counts[n - 1]++;
  }
  const max = Math.max(...counts);

  // dir="ltr": de zes kanten blijven ook in rechts-naar-links talen van 1 tot 6 lopen.
  return (
    <div className="tally" dir="ltr" role="img" aria-label={t('tallyAria', { counts: counts.join(', ') })}>
      {counts.map((c, i) => {
        const pct = max === 0 ? 0 : Math.round((c / max) * 100);
        const isTop = c > 0 && c === max;
        return (
          <div className="col-tally" key={i}>
            <span className="small text-body-secondary lh-1">{c}</span>
            <div className="barwrap">
              <div className={'bar ' + (isTop ? 'bg-danger' : 'bg-secondary-subtle')} style={{ height: pct + '%' }} />
            </div>
            <span className="fw-semibold small lh-1">{i + 1}</span>
          </div>
        );
      })}
    </div>
  );
}
