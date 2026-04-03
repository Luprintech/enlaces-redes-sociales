'use client';

import { useTheme } from './ThemeProvider';

interface Props {
  primaryColor?: string;
}

export default function ThemeToggle({ primaryColor = '#EC4899' }: Props) {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
      title={isDark ? 'Tema claro' : 'Tema oscuro'}
      className="relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 hover:scale-110 active:scale-95"
      style={{
        background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'}`,
        color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
      }}
    >
      <span
        className="text-lg transition-all duration-300"
        style={{
          filter: isDark ? `drop-shadow(0 0 6px ${primaryColor}88)` : 'none',
          transform: isDark ? 'rotate(0deg)' : 'rotate(180deg)',
          display: 'inline-block',
        }}
      >
        {isDark ? '🌙' : '☀️'}
      </span>
    </button>
  );
}
