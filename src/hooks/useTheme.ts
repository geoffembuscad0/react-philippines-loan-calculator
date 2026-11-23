import { useEffect, useState } from 'react';
import { NIGHT_ENDS_AT_HOUR, NIGHT_STARTS_AT_HOUR } from '../constants';
import type { ResolvedTheme, ThemeMode } from '../types';

/**
 * Handles the Auto / Light / Dark theme.
 * In "auto" mode the theme follows the clock: dark from 6 PM to 6 AM.
 */
export function useTheme() {
  const [themeMode, setThemeMode] = useState<ThemeMode>('auto');

  // `now` is refreshed every minute so the clock badge and auto theme stay current.
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(timer); // stop the timer when the component unmounts
  }, []);

  const hour = now.getHours();
  const isNight = hour >= NIGHT_STARTS_AT_HOUR || hour < NIGHT_ENDS_AT_HOUR;
  const autoTheme: ResolvedTheme = isNight ? 'dark' : 'light';
  const resolvedTheme: ResolvedTheme = themeMode === 'auto' ? autoTheme : themeMode;

  return { now, themeMode, setThemeMode, resolvedTheme };
}
