import tailwindcssAnimate from 'tailwindcss-animate'
import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  darkMode: ['selector', '[data-theme="dark"]'],
  plugins: [tailwindcssAnimate, typography],
  prefix: '',
  safelist: [
    'lg:col-span-4',
    'lg:col-span-6',
    'lg:col-span-8',
    'lg:col-span-12',
    'border-border',
    'bg-card',
    'border-error',
    'bg-error/30',
    'border-success',
    'bg-success/30',
    'border-warning',
    'bg-warning/30',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        '2xl': '2rem',
        DEFAULT: '1rem',
        lg: '2rem',
        md: '2rem',
        sm: '1rem',
        xl: '2rem',
      },
      screens: {
        '2xl': '86rem',
        lg: '64rem',
        md: '48rem',
        sm: '40rem',
        xl: '80rem',
      },
    },
    extend: {
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        tertiary: 'var(--tertiary)',
        base: 'var(--base)',
        highlight: 'var(--highlight)',
        highlight2: 'var(--highlight-2)',
        accent: 'var(--accent-1)',
        accent2: 'var(--accent-2)',
        accent3: 'var(--accent-3)',
        border: 'var(--border)',
        neutral: 'var(--neutral)',
        neutral2: 'var(--neutral-2)',
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
      },
      fontSize: {
        display: [
          '4.375rem',
          { lineHeight: 'normal', fontWeight: '700', textTransform: 'uppercase' },
        ],
        h1: ['3.125rem', { lineHeight: 'normal', fontWeight: '700', textTransform: 'uppercase' }],
        h2: ['2.1875rem', { lineHeight: 'normal', fontWeight: '700', textTransform: 'uppercase' }],
        h3: ['1.375rem', { lineHeight: 'normal', fontWeight: '400' }],
        h3Hover: [
          '1.375rem',
          { lineHeight: 'normal', fontWeight: '400', textDecoration: 'underline' },
        ],
        h4: ['1.125rem', { lineHeight: 'normal', fontWeight: '600' }],
        body: ['1rem', { lineHeight: '1.5rem', fontWeight: '400' }],
        bodySemibold: ['1rem', { lineHeight: 'normal', fontWeight: '600' }],
        bodyUnderline: [
          '1rem',
          { lineHeight: '1.375rem', fontWeight: '600', textDecoration: 'underline' },
        ],
        helper: ['0.875rem', { lineHeight: 'normal', fontWeight: '400' }],
        button: ['1.125rem', { lineHeight: 'normal', fontWeight: '700' }],
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
      },
      typography: () => ({
        DEFAULT: {
          css: [
            {
              '--tw-prose-body': 'var(--text)',
              '--tw-prose-headings': 'var(--text)',
              h1: {
                fontWeight: 'normal',
                marginBottom: '0.25em',
              },
            },
          ],
        },
      }),
    },
  },
}

export default config
