export const Colors = {
  background: '#0A0A1A',
  surface: '#12122A',
  surfaceLight: '#1A1A35',
  surfaceCard: '#1E1E40',
  primary: '#7B5EA7',
  primaryLight: '#9B7EC8',
  accent: '#00D4FF',
  accentGlow: 'rgba(0, 212, 255, 0.3)',
  accentGreen: '#00FF88',
  accentGreenGlow: 'rgba(0, 255, 136, 0.3)',
  text: '#FFFFFF',
  textSecondary: '#8888AA',
  textMuted: '#444466',
  error: '#FF4466',
  warning: '#FFB800',
  success: '#00FF88',
  border: '#2A2A4A',
  borderLight: '#3A3A5A',
  overlay: 'rgba(10, 10, 26, 0.85)',
} as const;

export const Gradients = {
  primary: ['#7C3AED', '#06B6D4'] as string[],
  accent: ['#00D4FF', '#7B5EA7'] as string[],
  dark: ['#0A0A1A', '#12122A'] as string[],
  success: ['#00FF88', '#00D4FF'] as string[],
  result: ['#1A1A35', '#12122A'] as string[],
  scanOverlay: ['transparent', 'rgba(10, 10, 26, 0.6)'] as string[],
  button: ['#7C3AED', '#4F46E5'] as string[],
  buttonGreen: ['#059669', '#10B981'] as string[],
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  round: 999,
} as const;

export const Typography = {
  h1: {
    fontSize: 32,
    fontWeight: '800' as const,
    color: Colors.text,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    color: Colors.text,
  },
  bodyBold: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  caption: {
    fontSize: 13,
    fontWeight: '400' as const,
    color: Colors.textSecondary,
  },
  math: {
    fontSize: 26,
    fontWeight: '700' as const,
    color: Colors.accent,
    letterSpacing: 0.5,
  },
  result: {
    fontSize: 56,
    fontWeight: '800' as const,
    color: Colors.accentGreen,
    letterSpacing: -1,
  },
} as const;

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 16,
  },
  accent: {
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 12,
  },
  green: {
    shadowColor: Colors.accentGreen,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 12,
  },
} as const;
