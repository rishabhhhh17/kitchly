export const tokens = {
  color: {
    bg: '#FBF6EF',
    bgSoft: '#F4ECDD',
    surface: '#FFFFFF',
    accent: '#B65A38',
    accentDeep: '#7C3818',
    text: '#27190F',
    textMuted: '#6B5A4D',
    line: '#E5D7C0',
    moss: '#566039',
    butter: '#F2C25B'
  },
  font: {
    display: 'var(--font-display)',
    sans: 'var(--font-sans)'
  },
  radius: {
    sm: '8px',
    md: '14px',
    lg: '24px',
    pill: '999px'
  },
  shadow: {
    warm: '0 8px 24px -12px rgba(122, 56, 24, 0.18)',
    lift: '0 20px 50px -20px rgba(38, 25, 15, 0.25)'
  },
  space: {
    section: 'py-20 md:py-28',
    wrap: 'mx-auto max-w-wrap px-5 md:px-8'
  }
} as const;
