import { useTheme } from '../components/ThemeProvider';

export const useChartTheme = () => {
  const { theme } = useTheme();
  
  // We determine the actual theme (handling 'system' preference)
  const isDark = theme === 'dark' || 
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  return {
    grid: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
    text: isDark ? '#94a3b8' : '#64748b',
    tooltipBg: isDark ? '#0f172a' : '#ffffff',
    tooltipBorder: isDark ? '#1e293b' : '#e2e8f0',
    primary: '#3b82f6',
    secondary: isDark ? '#1e293b' : '#f1f5f9',
    rose: isDark ? '#fb7185' : '#e11d48',
    emerald: isDark ? '#34d399' : '#10b981',
    amber: isDark ? '#fbbf24' : '#d97706',
    isDark
  };
};
