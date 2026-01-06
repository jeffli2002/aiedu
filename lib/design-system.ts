/**
 * Design System - Editorial Minimal for Youth AI Education
 *
 * Aesthetic: Magazine editorial meets playful youth energy
 * Based on frontend-design skill principles
 */

export const DESIGN = {
  colors: {
    // Primary palette
    primary: '#ff6b35', // Coral orange - main accent
    secondary: '#2ec4b6', // Teal - secondary accent
    dark: '#1a1a2e', // Headlines, primary text
    light: '#fafaf9', // Background
    white: '#ffffff',

    // Text colors
    text: {
      primary: '#1a1a2e',
      secondary: '#4a4a4a',
      muted: '#666666',
      light: '#999999',
    },

    // UI colors
    border: {
      default: '#e5e5e5',
      light: '#f0f0f0',
      hover: '#d0d0d0',
    },
  },

  fonts: {
    display: '"Instrument Serif", Georgia, serif',
    body: '"DM Sans", system-ui, sans-serif',
  },

  // Border radius scale
  radius: {
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.5rem',
    '2xl': '2rem',
    full: '9999px',
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.04)',
    md: '0 4px 12px rgba(0, 0, 0, 0.08)',
    lg: '0 12px 40px rgba(0, 0, 0, 0.12)',
    primary: '0 12px 40px -8px rgba(255, 107, 53, 0.4)',
  },

  // Transitions
  transitions: {
    fast: '150ms ease',
    normal: '300ms ease',
    slow: '500ms ease',
  },
} as const;

// CSS variable injection for use in stylesheets
export const cssVariables = `
  --color-primary: ${DESIGN.colors.primary};
  --color-secondary: ${DESIGN.colors.secondary};
  --color-dark: ${DESIGN.colors.dark};
  --color-light: ${DESIGN.colors.light};
  --font-display: ${DESIGN.fonts.display};
  --font-body: ${DESIGN.fonts.body};
`;

// Tailwind-compatible class helpers
export const tw = {
  // Text styles
  heading: 'font-normal text-[#1a1a2e]',
  body: 'text-[#4a4a4a]',
  muted: 'text-[#666]',

  // Button variants
  btnPrimary: `
    inline-flex items-center justify-center gap-2
    px-8 py-4 rounded-full
    bg-[#ff6b35] text-white font-semibold
    transition-all duration-300
    hover:bg-[#e55a2b] hover:scale-105
    active:scale-95
    shadow-lg
  `.replace(/\s+/g, ' ').trim(),

  btnSecondary: `
    inline-flex items-center justify-center gap-2
    px-8 py-4 rounded-full
    bg-white border-2 border-[#e5e5e5]
    text-[#1a1a2e] font-semibold
    transition-all duration-300
    hover:border-[#2ec4b6] hover:text-[#2ec4b6]
  `.replace(/\s+/g, ' ').trim(),

  // Link styles
  navLink: `
    text-[#4a4a4a] hover:text-[#ff6b35]
    transition-colors duration-200
    text-sm font-medium tracking-wide
  `.replace(/\s+/g, ' ').trim(),

  // Card styles
  card: `
    bg-white rounded-[1.5rem]
    border border-slate-100
    transition-all duration-300
    hover:shadow-lg hover:-translate-y-1
  `.replace(/\s+/g, ' ').trim(),
};

export default DESIGN;
