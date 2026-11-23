import { Moon, PhilippinePeso, Sun } from 'lucide-react';
import { BRAND_GRADIENT } from '../constants';
import type { ResolvedTheme, ThemeMode } from '../types';

interface HeaderProps {
  now: Date;
  themeMode: ThemeMode;
  resolvedTheme: ResolvedTheme;
  onThemeModeChange: (mode: ThemeMode) => void;
}

const THEME_MODES: ThemeMode[] = ['auto', 'light', 'dark'];

/** Logo, app name, clock badge, and the Auto / Light / Dark switch. */
export function Header({ now, themeMode, resolvedTheme, onThemeModeChange }: HeaderProps) {
  const isDark = resolvedTheme === 'dark';
  const clock = now.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' });

  // NOTE: `sticky` does nothing without a `top-*` class, so this header scrolls away with
  // the page (same as before). To pin it to the top, use "sticky top-0 z-30".
  return (
    <header
      className="sticky z-30"
      style={{ background: 'color-mix(in srgb, var(--bg) 88%, transparent)', backdropFilter: 'blur(14px)' }}
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
        {/* Logo + title. The long title parts are hidden on small phones. */}
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-11 h-11 rounded-[16px] flex items-center justify-center shrink-0"
            style={{ background: BRAND_GRADIENT, boxShadow: '0 8px 20px rgba(124,58,237,.35)' }}
          >
            <PhilippinePeso className="w-6 h-6 text-white" />
          </div>
          <div className="min-w-0">
            <p className="font-extrabold text-[17px] leading-tight truncate">
              LoanCalc PH <span className="hidden sm:inline font-medium" style={{ color: 'var(--muted)' }}>— Employer Edition</span>
            </p>
            <p className="hidden sm:block text-[12px] font-medium truncate" style={{ color: 'var(--muted)' }}>
              Clear payroll-deduction estimates for your team
            </p>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2 shrink-0">
          {/* Clock badge: only shown on tablets and larger (md = 768px+). */}
          <span
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-[12px] font-bold"
            style={{ background: isDark ? 'var(--surface-2)' : '#E8EFFE', color: isDark ? '#C7D2FE' : '#1D4ED8' }}
          >
            {isDark ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />} Auto • {isDark ? 'Dark (6PM–6AM)' : 'Light'} • {clock}
          </span>

          {/* Auto / Light / Dark switch */}
          <div className="flex p-1 rounded-full" style={{ background: 'var(--surface-2)' }}>
            {THEME_MODES.map((mode) => (
              <button
                key={mode}
                onClick={() => onThemeModeChange(mode)}
                className="px-3 py-2 sm:py-1.5 rounded-full text-[12px] font-bold capitalize"
                style={
                  themeMode === mode
                    ? { background: 'var(--surface)', boxShadow: 'var(--shadow)', color: 'var(--text)' }
                    : { color: 'var(--muted)' }
                }
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
