import { cva } from 'class-variance-authority';

/**
 * Color psychology principles applied in this healthcare application:
 * 
 * - Blue: Trust, reliability, calmness - used for primary actions and medical information
 * - Green: Health, growth, success - used for positive status and confirmations
 * - Red: Urgency, importance, alerts - used for critical information and warnings
 * - Orange: Energy, warmth, caution - used for moderate warnings and attention-grabbing elements
 * - Purple: Wisdom, dignity, quality - used for premium features and specialized medical content
 * - Teal: Balance, clarity, restoration - used for navigation and secondary elements
 */

// Card color variants based on emotional mood and elevation
export const cardColors = cva('', {
  variants: {
    mood: {
      neutral: 'bg-white',
      calm: 'bg-white',
      reassuring: 'bg-health-green-light/20',
      energetic: 'bg-health-orange-light/20',
      alert: 'bg-health-red-light/20',
      professional: 'bg-health-blue-light/20',
      premium: 'bg-health-purple-light/20',
    },
    elevation: {
      flat: 'shadow-none',
      raised: 'shadow-md',
      prominent: 'shadow-lg',
    },
  },
  defaultVariants: {
    mood: 'neutral',
    elevation: 'flat',
  },
});

// Status indicator colors with semantic meaning
export const healthStatusColors = cva('px-2 py-0.5 rounded-full flex items-center justify-center font-medium', {
  variants: {
    intent: {
      positive: 'bg-health-green-light text-health-green',
      info: 'bg-health-blue-light text-health-blue',
      warning: 'bg-health-orange-light text-health-orange',
      caution: 'bg-health-orange-light text-health-orange',
      critical: 'bg-health-red-light text-health-red',
      neutral: 'bg-secondary text-secondary-foreground',
    },
    emphasis: {
      low: 'opacity-80',
      medium: '',
      high: 'font-semibold',
    },
    size: {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    },
  },
  defaultVariants: {
    intent: 'neutral',
    emphasis: 'medium',
    size: 'md',
  },
});

// Text colors with semantic meanings for healthcare context
export const healthTextColors = cva('', {
  variants: {
    intent: {
      neutral: 'text-foreground',
      success: 'text-health-green',
      info: 'text-health-blue',
      caution: 'text-health-orange',
      danger: 'text-health-red',
      premium: 'text-health-purple',
      muted: 'text-muted-foreground',
    },
    weight: {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
  },
  defaultVariants: {
    intent: 'neutral',
    weight: 'normal',
  },
});

// Action button colors with semantic meanings
export const actionButtonColors = cva('', {
  variants: {
    intent: {
      primary: 'bg-health-blue text-white hover:bg-health-blue/90',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      tertiary: 'bg-white text-foreground border hover:bg-secondary/50',
      success: 'bg-health-green text-white hover:bg-health-green/90',
      danger: 'bg-health-red text-white hover:bg-health-red/90',
      warning: 'bg-health-orange text-white hover:bg-health-orange/90',
      info: 'bg-health-teal text-white hover:bg-health-teal/90',
    },
    weight: {
      light: 'font-normal',
      regular: 'font-medium',
      bold: 'font-semibold',
    },
  },
  defaultVariants: {
    intent: 'secondary',
    weight: 'regular',
  },
});

// Background colors for different sections with emotional associations
export const sectionBackgroundColors = cva('', {
  variants: {
    mood: {
      calm: 'bg-white',
      soothing: 'bg-health-teal-light/50',
      energizing: 'bg-health-orange-light/30',
      reassuring: 'bg-health-green-light/30',
      authoritative: 'bg-health-blue-light/30',
      cautionary: 'bg-health-red-light/20',
      premium: 'bg-health-purple-light/30',
    },
  },
  defaultVariants: {
    mood: 'calm',
  },
});

// Border colors with semantic meanings for healthcare
export const healthBorderColors = cva('border', {
  variants: {
    intent: {
      neutral: 'border-border',
      primary: 'border-primary',
      success: 'border-health-green',
      caution: 'border-health-orange',
      danger: 'border-health-red',
      info: 'border-health-blue',
      premium: 'border-health-purple',
    },
    emphasis: {
      low: 'border-opacity-30',
      medium: '',
      high: 'border-2',
    },
  },
  defaultVariants: {
    intent: 'neutral',
    emphasis: 'medium',
  },
});