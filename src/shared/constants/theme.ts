export const colors = {
  // 主色
  primary: '#6366f1',
  secondary: '#10b981',
  danger: '#ef4444',
  warning: '#f59e0b',
  success: '#10b981',
  
  // 安全评分颜色
  safetyHigh: '#4ade80',
  safetyMedium: '#fbbf24',
  safetyLow: '#f87171',
  
  // 中性色
  background: '#ffffff',
  surface: '#f5f5f5',
  text: '#1f2937',
  textSecondary: '#6b7280',
  border: '#e5e7eb',
  
  // 透明度
  overlay: 'rgba(0, 0, 0, 0.5)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  h1: { fontSize: 32, fontWeight: 'bold' as const },
  h2: { fontSize: 24, fontWeight: 'bold' as const },
  h3: { fontSize: 20, fontWeight: '600' as const },
  body: { fontSize: 16, fontWeight: 'normal' as const },
  caption: { fontSize: 14, fontWeight: 'normal' as const },
  small: { fontSize: 12, fontWeight: 'normal' as const },
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

