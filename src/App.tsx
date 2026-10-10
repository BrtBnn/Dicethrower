import { useEffect, useRef, useState } from 'react';
import Die from './components/Die';
import Tally from './components/Tally';
import LanguageSelect from './components/LanguageSelect';
import { FullscreenIcon } from './components/Icons';
import { useStageLayout, GAP } from './hooks/useStageLayout';
import { useSystemTheme } from './hooks/useSystemTheme';
import { useI18n } from './i18n/I18nProvider';
import type { Face, Roll } from './types';

const MIN_DICE = 1;
const MAX_DICE = 6;
const ROLL_TICKS = 10;
const TICK_MS = 70;

const randomFace = (): Face => (1 + Math.floor(Math.random() * 6)) as Face;
const sum = (arr: number[]): number => arr.reduce((a, b) => a + b, 0);

interface EmphasisProps {
  template: string;
  token: string;
  value: number;
}

// Zet één waarde vet in een vertaalde zin, op de plek waar de taal die hoort.
function Emphasis({ template, token, value }: EmphasisProps) {
  const [before, after = ''] = template.split(`{${token}}`);
  return (
    <span>
      {before}
      <strong className="fs-4 fw-semibold text-body">{value}</strong>
      {after}
    </span>
  );
}

export default function App() {
  useSystemTheme();
  const { t, tRaw } = useI18n();
  const [values, setValues] = useState<Face[]>([5, 3]);
  const [rolling, setRolling] = useState(false);
  const [rolls, setRolls] = useState<Roll[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const nextId = useRef(0);
  const count = values.length;
  const { ref: stageRef, layout } = useStageLayout(count);

  useEffect(() => () => window.clearInterval(timer.current), []);

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  function setCount(n: number) {
    if (rolling || n < MIN_DICE || n > MAX_DICE) return;
    setValues((prev) => {
      if (n > prev.length) {
        const extra = Array.from({ length: n - prev.length }, randomFace);
        return prev.concat(extra);
      }
      return prev.slice(0, n);
    });
  }

  function roll() {
    if (rolling) return;
    const final = values.map(randomFace);

    const finish = () => {
      setValues(final);
      setRolling(false);
      nextId.current += 1;
      const entry: Roll = { id: nextId.current, values: final, sum: sum(final) };
      setRolls((prev) => [entry, ...prev]);
    };

    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      finish();
      return;
    }

    setRolling(true);
    let ticks = 0;
    timer.current = window.setInterval(() => {
      ticks += 1;
      if (ticks >= ROLL_TICKS) {
        window.clearInterval(timer.current);
        finish();
      } else {
        setValues((prev) => prev.map(randomFace));
      }
    }, TICK_MS);
  }

  function toggleFullscreen() {
    try {
      const p = document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
      if (p && p.catch) p.catch(() => {});
    } catch {
      /* volledig scherm wordt niet overal toegestaan */
    }
  }

  const last = rolls[0];
  let status;
  if (rolling) {
    status = t(count === 1 ? 'rollingOne' : 'rollingMany');
  } else if (!last) {
    status = t('notRolledYet');
  } else if (last.values.length === 1) {
    status = <Emphasis template={tRaw('rolledOne')} token="n" value={last.sum} />;
  } else {
    status = (
      <span>
        <Emphasis template={tRaw('rolledTotal')} token="total" value={last.sum} />{' '}
        <bdi className="parts">({last.values.join(' + ')})</bdi>
      </span>
    );
  }

  const thrown = rolls.reduce((a, r) => a + r.values.length, 0);
  const fullscreenLabel = t(isFullscreen ? 'exitFullscreen' : 'fullscreen');

  return (
    <div className="app">
      <div className="stage" ref={stageRef}>
        <div
          className="dice"
          style={{
            gridTemplateColumns: `repeat(${layout.cols}, ${layout.size}px)`,
            gridAutoRows: `${layout.size}px`,
            gap: `${GAP}px`,
          }}
        >
          {values.map((v, i) => (
            <Die key={i} index={i} value={v} rolling={rolling} />
          ))}
        </div>
      </div>

      <section className="card panel">
        <div className="card-body d-flex flex-column gap-3 overflow-auto">
          <div className="d-flex align-items-center justify-content-between gap-2 top">
            <p className="result mb-0 text-body-secondary" aria-live="polite">
              {status}
            </p>
            <div className="d-flex align-items-center gap-2 flex-shrink-0">
              <LanguageSelect />
              {document.fullscreenEnabled && (
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm icon-btn d-flex align-items-center justify-content-center p-0"
                  onClick={toggleFullscreen}
                  aria-label={fullscreenLabel}
                  title={fullscreenLabel}
                >
                  <FullscreenIcon on={isFullscreen} />
                </button>
              )}
            </div>
          </div>

          <div>
            <h2 className="section-title">{t('recentRolls')}</h2>
            {rolls.length === 0 ? (
              <p className="text-body-secondary small mb-0">{t('rollsAppearHere')}</p>
            ) : (
              <div className="recent d-flex gap-2 overflow-x-auto align-items-center">
                {rolls.slice(0, 12).map((r, i) => (
                  <span
                    key={r.id}
                    className={'badge fs-6 fw-semibold flex-shrink-0 ' + (i === 0 ? 'text-bg-danger' : 'bg-body-secondary text-body-emphasis border')}
                    title={r.values.join(' + ')}
                  >
                    {r.sum}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="section-title">{t('perSide') + (thrown ? ' · ' + t('thrownCount', { n: thrown }) : '')}</h2>
            <Tally rolls={rolls} />
          </div>

          <div className="d-flex gap-2 mt-auto controls">
            <div className="input-group stepper" role="group" aria-label={t('diceCount')}>
              <button
                id="fewer"
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setCount(count - 1)}
                disabled={rolling || count <= MIN_DICE}
                aria-label={t('fewer')}
              >
                −
              </button>
              <span className="input-group-text flex-column justify-content-center lh-1 px-2 stepper-n" aria-live="polite">
                <b className="fs-5">{count}</b>
                <small className="text-body-secondary">{t('diceUnit')}</small>
              </span>
              <button
                id="more"
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setCount(count + 1)}
                disabled={rolling || count >= MAX_DICE}
                aria-label={t('more')}
              >
                +
              </button>
            </div>
            <button id="roll" type="button" className="btn btn-danger btn-lg flex-grow-1 fw-semibold" onClick={roll} disabled={rolling}>
              {rolling ? t('rolling') : t('roll')}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
