import containerQueries from '@tailwindcss/container-queries';
import type { Config } from 'tailwindcss';
import Animate from 'tailwindcss-animate';
import flattenColorPalette from 'tailwindcss/lib/util/flattenColorPalette';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      transitionTimingFunction: {
        'quart-out': 'cubic-bezier(0.23, 1, 0.32, 1)',
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        glow: '0 0 20px rgba(59, 130, 246, 0.5)',
        'glow-lg': '0 0 30px rgba(59, 130, 246, 0.6)',
        'glow-xl': '0 0 50px rgba(59, 130, 246, 0.4)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.1)' },
        },
        twinkle: {
          '0%': { opacity: '0.2', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
          '100%': { opacity: '0.2', transform: 'scale(0.8)' },
        },
        'shooting-star': {
          '0%': { 
            transform: 'translateX(0) translateY(0) rotate(-45deg)',
            opacity: '0'
          },
          '10%': {
            opacity: '1'
          },
          '100%': { 
            transform: 'translateX(-500px) translateY(-500px) rotate(-45deg)',
            opacity: '0'
          },
        },
        'star-float': {
          '0%': { transform: 'translateY(0px) scale(1)' },
          '25%': { transform: 'translateY(-1px) scale(1.1)' },
          '50%': { transform: 'translateY(0px) scale(1)' },
          '75%': { transform: 'translateY(1px) scale(0.9)' },
          '100%': { transform: 'translateY(0px) scale(1)' },
        },
        shine: {
          '0%': { transform: 'rotate(-45deg) translateY(-50%) translateX(-100%)' },
          '50%, 100%': { transform: 'rotate(-45deg) translateY(-50%) translateX(100%)' },
        },
        particle1: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(100px, 50px)' },
        },
        particle2: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(-100px, -50px)' },
        },
        particle3: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(50px, -100px)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        float: 'float 6s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 4s ease-in-out infinite',
        twinkle: 'twinkle 4s ease-in-out infinite',
        'shooting-star': 'shooting-star 4s ease-out forwards',
        'star-float': 'star-float 8s ease-in-out infinite',
        shine: 'shine 8s ease-in-out infinite',
        particle1: 'particle1 4s ease-in-out infinite',
        particle2: 'particle2 5s ease-in-out infinite',
        particle3: 'particle3 6s ease-in-out infinite',
        shimmer: 'shimmer 1.8s infinite',
      },
    },
  },
  plugins: [Animate, addVariablesForColors, containerQueries],
  corePlugins: {
    container: true,
  },
};
export default config;

function addVariablesForColors({ addBase, theme }: any) {
  const allColors = flattenColorPalette(theme('colors'));
  const newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val]),
  );

  addBase({
    ':root': newVars,
  });
}
