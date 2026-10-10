import { useLayoutEffect, useRef, useState } from 'react';

export const GAP = 16;
const MAX_SIZE = 320;
const MIN_SIZE = 60;

// Kies het aantal kolommen waarbij de dobbelstenen zo groot mogelijk worden.
export function bestLayout(count, width, height) {
  let best = { cols: 1, rows: count, size: 0 };
  for (let cols = 1; cols <= count; cols++) {
    const rows = Math.ceil(count / cols);
    const size = Math.min((width - GAP * (cols - 1)) / cols, (height - GAP * (rows - 1)) / rows);
    if (size > best.size) best = { cols, rows, size };
  }
  best.size = Math.max(MIN_SIZE, Math.min(Math.floor(best.size), MAX_SIZE));
  return best;
}

// Meet het speelveld en geeft de beste indeling voor het aantal dobbelstenen.
export function useStageLayout(count) {
  const ref = useRef(null);
  const [box, setBox] = useState({ w: 0, h: 0 });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const measure = () => {
      const r = el.getBoundingClientRect();
      setBox((prev) =>
        Math.abs(prev.w - r.width) < 1 && Math.abs(prev.h - r.height) < 1
          ? prev
          : { w: r.width, h: r.height }
      );
    };

    measure();
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    if (observer) observer.observe(el);
    window.addEventListener('resize', measure);
    return () => {
      if (observer) observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  return { ref, layout: bestLayout(count, box.w || 320, box.h || 320) };
}
