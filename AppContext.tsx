import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { PageKey, ProgressState } from '@/types';
import {
  loadProgress,
  saveProgress,
  loadSettings,
  saveSettings,
  type Settings,
} from '@/lib/storage';

interface AppContextValue {
  page: PageKey;
  pageParam: string | null;
  navigate: (page: PageKey, param?: string | null) => void;
  progress: ProgressState;
  setProgress: (p: ProgressState) => void;
  settings: Settings;
  setSettings: (s: Settings) => void;
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [page, setPage] = useState<PageKey>('home');
  const [pageParam, setPageParam] = useState<string | null>(null);
  const [progress, setProgressState] = useState<ProgressState>(() => loadProgress());
  const [settings, setSettingsState] = useState<Settings>(() => loadSettings());

  // Apply theme
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
  }, [settings.theme]);

  // Scroll to top on navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page, pageParam]);

  const navigate = (p: PageKey, param: string | null = null) => {
    setPage(p);
    setPageParam(param);
  };

  const setProgress = (p: ProgressState) => {
    setProgressState(p);
    saveProgress(p);
  };

  const setSettings = (s: Settings) => {
    setSettingsState(s);
    saveSettings(s);
  };

  const toggleTheme = () => {
    setSettings({ ...settings, theme: settings.theme === 'dark' ? 'light' : 'dark' });
  };

  const value = useMemo(
    () => ({
      page,
      pageParam,
      navigate,
      progress,
      setProgress,
      settings,
      setSettings,
      toggleTheme,
    }),
    [page, pageParam, progress, settings],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
