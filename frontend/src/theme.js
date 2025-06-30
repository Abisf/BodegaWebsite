// =============================================================================
// 🎨 BROOKLYN BODEGA DESIGN SYSTEM
// =============================================================================
// Centralized theme tokens for consistent styling across the entire app

export const theme = {
  // =============================================================================
  // 🎨 COLOR PALETTE
  // =============================================================================
  colors: {
    // Base colors - authentic Brooklyn deli aesthetic
    primary: {
      charcoal: '#0D0D0F',        // Main background - dark charcoal
      concrete: '#1A1A1D',        // Secondary background - concrete texture
      lightConcrete: '#2D2D30',   // Lighter concrete for cards
      darkConcrete: '#0A0A0C',    // Darker concrete for depth
    },
    
    // Neon accents - minimal and purposeful
    accent: {
      neonRed: '#FF2D55',         // Primary CTA and logo accent
      neonGold: '#FFD60A',        // Secondary accent for highlights
      neonRedGlow: 'rgba(255, 45, 85, 0.4)',
      neonGoldGlow: 'rgba(255, 214, 10, 0.4)',
    },
    
    // Text hierarchy
    text: {
      primary: '#FFFFFF',         // Main text - pure white
      secondary: '#E5E5E7',       // Secondary text - slightly dimmed
      tertiary: '#98989A',        // Tertiary text - muted
      inverse: '#000000',         // Text on light backgrounds
    },
    
    // Functional colors
    functional: {
      success: '#30D158',         // Success states
      warning: '#FF9F0A',         // Warning states
      error: '#FF453A',           // Error states
      info: '#007AFF',            // Info states
    },
    
    // Surface colors
    surface: {
      card: 'rgba(29, 29, 32, 0.8)',           // Card backgrounds
      cardHover: 'rgba(44, 44, 47, 0.9)',      // Card hover states
      overlay: 'rgba(0, 0, 0, 0.7)',           // Modal overlays
      border: 'rgba(255, 255, 255, 0.1)',      // Subtle borders
      borderAccent: 'rgba(255, 45, 85, 0.3)',  // Accent borders
    }
  },

  // =============================================================================
  // 📝 TYPOGRAPHY
  // =============================================================================
  typography: {
    // Font families
    fonts: {
      heading: '"Inter Tight", "SF Pro Display", system-ui, sans-serif',
      body: '"Inter", "SF Pro Text", system-ui, sans-serif',
      mono: '"SF Mono", "Monaco", "Inconsolata", monospace',
    },
    
    // Font weights
    weights: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900,
    },
    
    // Font sizes - responsive scale
    sizes: {
      xs: '0.75rem',     // 12px
      sm: '0.875rem',    // 14px
      base: '1rem',      // 16px
      lg: '1.125rem',    // 18px  
      xl: '1.25rem',     // 20px
      '2xl': '1.5rem',   // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
      '5xl': '3rem',     // 48px
      '6xl': '3.75rem',  // 60px
      '7xl': '4.5rem',   // 72px
    },
    
    // Line heights
    lineHeights: {
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    }
  },

  // =============================================================================
  // 📐 SPACING & LAYOUT
  // =============================================================================
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '3rem',    // 48px
    '3xl': '4rem',    // 64px
    '4xl': '6rem',    // 96px
    '5xl': '8rem',    // 128px
  },

  // Border radius
  borderRadius: {
    none: '0',
    sm: '0.25rem',    // 4px
    md: '0.5rem',     // 8px
    lg: '0.75rem',    // 12px
    xl: '1rem',       // 16px
    '2xl': '1.5rem',  // 24px
    full: '9999px',   // pill shape
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    neon: '0 0 20px rgba(255, 45, 85, 0.4), 0 0 40px rgba(255, 45, 85, 0.2)',
    neonGold: '0 0 20px rgba(255, 214, 10, 0.4), 0 0 40px rgba(255, 214, 10, 0.2)',
  },

  // =============================================================================
  // 🎬 ANIMATIONS
  // =============================================================================
  animations: {
    // Duration
    duration: {
      fast: '150ms',
      normal: '250ms',
      slow: '350ms',
      slower: '500ms',
    },
    
    // Easing
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    }
  },

  // =============================================================================
  // 📱 BREAKPOINTS
  // =============================================================================
  breakpoints: {
    sm: '640px',
    md: '768px', 
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // =============================================================================
  // 🎯 COMPONENT VARIANTS
  // =============================================================================
  components: {
    button: {
      primary: {
        background: 'linear-gradient(135deg, #FF2D55 0%, #FF6B6B 100%)',
        color: '#FFFFFF',
        shadow: '0 4px 15px rgba(255, 45, 85, 0.3)',
        hoverShadow: '0 6px 20px rgba(255, 45, 85, 0.4)',
      },
      secondary: {
        background: 'rgba(255, 255, 255, 0.1)',
        color: '#FFFFFF',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        hoverBackground: 'rgba(255, 255, 255, 0.15)',
      }
    },
    
    card: {
      default: {
        background: 'rgba(29, 29, 32, 0.8)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        hoverBackground: 'rgba(44, 44, 47, 0.9)',
      }
    }
  }
}

// =============================================================================
// 🛠️ UTILITY FUNCTIONS
// =============================================================================
export const getColor = (path) => {
  return path.split('.').reduce((obj, key) => obj?.[key], theme.colors)
}

export const getSpacing = (size) => {
  return theme.spacing[size] || size
}

export const getFontSize = (size) => {
  return theme.typography.sizes[size] || size
}

export const getBreakpoint = (size) => {
  return theme.breakpoints[size] || size
}