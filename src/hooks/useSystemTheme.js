import { useEffect } from 'react';

const QUERY = '(prefers-color-scheme: dark)';

function applyTheme(isDark) {
  document.documentElement.setAttribute('data-bs-theme', isDark ? 'dark' : 'light');
}

// Houdt het Bootstrap-thema gelijk aan de systeeminstelling, ook als die tijdens het gebruik wisselt.
export function useSystemTheme() {
  useEffect(() => {
    const media = window.matchMedia(QUERY);
    applyTheme(media.matches);
    const onChange = (event) => applyTheme(event.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);
}
