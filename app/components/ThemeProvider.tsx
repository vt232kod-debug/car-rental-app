'use client';

import { createContext, useContext, useEffect, useSyncExternalStore } from 'react';

type Theme = 'dark' | 'light';

const STORAGE_KEY = 'rentola-theme';
const THEME_EVENT = 'rentola-theme-change';

const ThemeCtx = createContext<{ theme: Theme; toggle: () => void }>({
  theme: 'dark',
  toggle: () => {},
});

export function useTheme() {
  return useContext(ThemeCtx);
}

function subscribe(callback: () => void) {
  window.addEventListener(THEME_EVENT, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(THEME_EVENT, callback);
    window.removeEventListener('storage', callback);
  };
}

function getSnapshot(): Theme {
  return (localStorage.getItem(STORAGE_KEY) as Theme | null) ?? 'dark';
}

function getServerSnapshot(): Theme {
  return 'dark';
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  // useSyncExternalStore reads the persisted theme without calling setState
  // inside an effect, and React handles the SSR/hydration transition for us.
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  function toggle() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem(STORAGE_KEY, next);
    window.dispatchEvent(new Event(THEME_EVENT));
  }

  return <ThemeCtx.Provider value={{ theme, toggle }}>{children}</ThemeCtx.Provider>;
}
