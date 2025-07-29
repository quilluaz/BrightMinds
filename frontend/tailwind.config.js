/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Core System Colors */
        background: 'var(--color-background)', // soft-white
        foreground: 'var(--color-foreground)', // gray-800
        border: 'var(--color-border)', // gray-200
        input: 'var(--color-input)', // gray-50
        ring: 'var(--color-ring)', // coral-500
        
        /* Card Colors */
        card: {
          DEFAULT: 'var(--color-card)', // white
          foreground: 'var(--color-card-foreground)' // gray-800
        },
        
        /* Popover Colors */
        popover: {
          DEFAULT: 'var(--color-popover)', // white
          foreground: 'var(--color-popover-foreground)' // gray-800
        },
        
        /* Muted Colors */
        muted: {
          DEFAULT: 'var(--color-muted)', // gray-50
          foreground: 'var(--color-muted-foreground)' // gray-500
        },
        
        /* Primary Colors */
        primary: {
          DEFAULT: 'var(--color-primary)', // coral-500
          foreground: 'var(--color-primary-foreground)' // white
        },
        
        /* Secondary Colors */
        secondary: {
          DEFAULT: 'var(--color-secondary)', // teal-400
          foreground: 'var(--color-secondary-foreground)' // white
        },
        
        /* Accent Colors */
        accent: {
          DEFAULT: 'var(--color-accent)', // yellow-300
          foreground: 'var(--color-accent-foreground)' // gray-800
        },
        
        /* Success Colors */
        success: {
          DEFAULT: 'var(--color-success)', // green-400
          foreground: 'var(--color-success-foreground)' // white
        },
        
        /* Warning Colors */
        warning: {
          DEFAULT: 'var(--color-warning)', // orange-400
          foreground: 'var(--color-warning-foreground)' // white
        },
        
        /* Error/Destructive Colors */
        error: {
          DEFAULT: 'var(--color-error)', // red-400
          foreground: 'var(--color-error-foreground)' // white
        },
        destructive: {
          DEFAULT: 'var(--color-destructive)', // red-400
          foreground: 'var(--color-destructive-foreground)' // white
        },
        
        /* Surface Color */
        surface: 'var(--color-surface)', // gray-50
        
        /* Text Colors */
        'text-primary': 'var(--color-text-primary)', // gray-800
        'text-secondary': 'var(--color-text-secondary)' // gray-500
      },
      fontFamily: {
        'display': ['Fredoka One', 'cursive'],
        'body': ['Nunito', 'sans-serif'],
        'caption': ['Poppins', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
        'sans': ['Nunito', 'sans-serif'],
        'serif': ['ui-serif', 'Georgia'],
        'monospace': ['JetBrains Mono', 'monospace']
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }]
      },
      borderRadius: {
        'none': '0',
        'sm': '0.125rem',
        'DEFAULT': '0.5rem',
        'md': '0.5rem',
        'lg': '0.75rem',
        'xl': '1rem',
        '2xl': '1.5rem',
        'full': '9999px',
        'card': '8px',
        'button': '12px',
        'container': '16px'
      },
      boxShadow: {
        'warm': '0 4px 12px rgba(255, 107, 107, 0.15)',
        'warm-sm': '0 2px 6px rgba(255, 107, 107, 0.12)',
        'warm-lg': '0 8px 24px rgba(255, 107, 107, 0.18)',
        'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'DEFAULT': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        'inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
        'none': 'none'
      },
      animation: {
        'bounce-gentle': 'bounce-gentle 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'scale-celebration': 'scale-celebration 0.4s ease-out',
        'slide-in': 'slide-in 0.3s ease-out',
        'cross-fade': 'cross-fade 0.25s ease-out',
        'spin': 'spin 1s linear infinite',
        'ping': 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce': 'bounce 1s infinite'
      },
      keyframes: {
        'bounce-gentle': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' }
        },
        'scale-celebration': {
          '0%': { transform: 'scale(0.95)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' }
        },
        'slide-in': {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        },
        'cross-fade': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        }
      },
      spacing: {
        '0': '0px',
        'px': '1px',
        '0.5': '0.125rem',
        '1': '0.25rem',
        '1.5': '0.375rem',
        '2': '0.5rem',
        '2.5': '0.625rem',
        '3': '0.75rem',
        '3.5': '0.875rem',
        '4': '1rem',
        '5': '1.25rem',
        '6': '1.5rem',
        '7': '1.75rem',
        '8': '2rem',
        '9': '2.25rem',
        '10': '2.5rem',
        '11': '2.75rem',
        '12': '3rem',
        '14': '3.5rem',
        '16': '4rem',
        '20': '5rem',
        '24': '6rem',
        '28': '7rem',
        '32': '8rem',
        '36': '9rem',
        '40': '10rem',
        '44': '11rem',
        '48': '12rem',
        '52': '13rem',
        '56': '14rem',
        '60': '15rem',
        '64': '16rem',
        '72': '18rem',
        '80': '20rem',
        '96': '24rem'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwindcss-animate')
  ],
}