export const SPACING = {
  // Section padding (vertical)
  section: {
    mobile: '40px',
    desktop: '60px'
  },

  // Container padding (horizontal)
  container: {
    mobile: '20px',
    desktop: '40px'
  },

  // Component spacing
  component: {
    xs: '8px',
    sm: '12px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px'
  },

  // Grid gaps
  grid: {
    mobile: '10px',
    desktop: '20px'
  },

  // Hero sections
  hero: {
    mobile: '60px',
    desktop: '80px'
  }
} as const

export const MAX_WIDTH = {
  container: '1400px',
  content: '1200px',
  narrow: '800px'
} as const

export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1440
} as const
