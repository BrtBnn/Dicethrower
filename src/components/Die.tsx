import { useI18n } from '../i18n/I18nProvider';
import type { Face } from '../types';

// Welke van de 9 vakjes (3x3, rij voor rij) een oog krijgen.
const PIPS: Record<Face, number[]> = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};
const CELLS = [0, 1, 2, 3, 4, 5, 6, 7, 8];

interface DieProps {
  value: Face;
  rolling: boolean;
  index: number;
}

export default function Die({ value, rolling, index }: DieProps) {
  const { t } = useI18n();
  return (
    <div
      className={'die' + (rolling ? ' rolling' : '')}
      style={rolling ? { animationDelay: `${-index * 0.07}s` } : undefined}
      role="img"
      aria-label={t('dieAria', { n: value })}
    >
      <div className="face">
        {CELLS.map((i) => (
          <span key={i} className="cell">
            {PIPS[value].includes(i) && <i className="pip" />}
          </span>
        ))}
      </div>
    </div>
  );
}
