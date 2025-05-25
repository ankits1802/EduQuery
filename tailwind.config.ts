
import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))',
          rgb: 'var(--primary-rgb)'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
      boxShadow: {
        'pink-glow-md': '0 4px 6px -1px rgba(var(--primary-rgb), 0.15), 0 2px 4px -2px rgba(var(--primary-rgb), 0.15)',
      },
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
        'shimmer-glow': {
          '0%, 100%': { opacity: '0.7', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        'fade-in-up': {
          'from': { opacity: '0', transform: 'translateY(10px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
        'shimmer-glow': 'shimmer-glow 2s infinite ease-in-out',
        'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
        'fade-in-up-delayed': 'fade-in-up 0.5s ease-out 0.2s forwards',
  		},
      typography: (theme: (path: string) => string) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': theme('colors.foreground / 1'),
            '--tw-prose-headings': theme('colors.foreground / 1'),
            '--tw-prose-lead': theme('colors.muted.foreground / 1'),
            '--tw-prose-links': theme('colors.primary / 1'),
            '--tw-prose-bold': theme('colors.foreground / 1'),
            '--tw-prose-counters': theme('colors.muted.foreground / 1'),
            '--tw-prose-bullets': theme('colors.muted.foreground / 1'),
            '--tw-prose-hr': theme('colors.border / 1'),
            '--tw-prose-quotes': theme('colors.foreground / 1'),
            '--tw-prose-quote-borders': theme('colors.primary / 1'),
            '--tw-prose-captions': theme('colors.muted.foreground / 1'),
            '--tw-prose-code': theme('colors.foreground / 1'), 
            '--tw-prose-pre-code': theme('colors.gray[200] / 1'), 
            '--tw-prose-pre-bg': theme('colors.gray[800] / 1'), 
            '--tw-prose-th-borders': theme('colors.border / 1'),
            '--tw-prose-td-borders': theme('colors.border / 1'),
            '--tw-prose-invert-body': theme('colors.foreground / 1'),
            '--tw-prose-invert-headings': theme('colors.foreground / 1'),
            '--tw-prose-invert-lead': theme('colors.muted.foreground / 1'),
            '--tw-prose-invert-links': theme('colors.primary / 1'),
            '--tw-prose-invert-bold': theme('colors.foreground / 1'),
            '--tw-prose-invert-counters': theme('colors.muted.foreground / 1'),
            '--tw-prose-invert-bullets': theme('colors.muted.foreground / 1'),
            '--tw-prose-invert-hr': theme('colors.border / 1'),
            '--tw-prose-invert-quotes': theme('colors.foreground / 1'),
            '--tw-prose-invert-quote-borders': theme('colors.primary / 1'),
            '--tw-prose-invert-captions': theme('colors.muted.foreground / 1'),
            '--tw-prose-invert-code': theme('colors.foreground / 1'), // For inline code
            '--tw-prose-invert-pre-code': theme('colors.gray[300] / 1'), // For code blocks
            '--tw-prose-invert-pre-bg': theme('colors.gray[700] / 1'), // For code blocks
            '--tw-prose-invert-th-borders': theme('colors.border / 1'),
            '--tw-prose-invert-td-borders': theme('colors.border / 1'),
            p: { marginTop: '0.5em', marginBottom: '0.5em' },
            h1: { marginTop: '0.75em', marginBottom: '0.25em', fontSize: '1.25em' },
            h2: { marginTop: '0.75em', marginBottom: '0.25em', fontSize: '1.125em' },
            h3: { marginTop: '0.5em', marginBottom: '0.25em', fontSize: '1.0em' },
            ul: { marginTop: '0.5em', marginBottom: '0.5em' },
            ol: { marginTop: '0.5em', marginBottom: '0.5em' },
            li: { marginTop: '0.1em', marginBottom: '0.1em' },
            pre: { marginTop: '0.5em', marginBottom: '0.5em', backgroundColor: 'var(--tw-prose-pre-bg)', color: 'var(--tw-prose-pre-code)' }, 
            code: { 
              backgroundColor: 'hsl(var(--muted) / 0.5)', 
              padding: '0.2em 0.4em',
              margin: '0',
              fontSize: '85%',
              borderRadius: '3px',
            },
            'code::before': {
              content: '"" !important', 
            },
            'code::after': {
              content: '"" !important', 
            },
            'pre code': { 
              backgroundColor: 'transparent !important',
              padding: '0 !important',
              fontSize: 'inherit !important',
              color: 'inherit !important',
            },
          },
        },
        sm: { 
          css: {
            p: { marginTop: '0.25em', marginBottom: '0.25em' },
            h1: { marginTop: '0.5em', marginBottom: '0.15em', fontSize: '1.15em' },
            h2: { marginTop: '0.5em', marginBottom: '0.15em', fontSize: '1.05em' },
            h3: { marginTop: '0.4em', marginBottom: '0.15em', fontSize: '0.95em' },
            ul: { marginTop: '0.25em', marginBottom: '0.25em' },
            ol: { marginTop: '0.25em', marginBottom: '0.25em' },
            li: { marginTop: '0.05em', marginBottom: '0.05em' },
            pre: { marginTop: '0.4em', marginBottom: '0.4em' },
          }
        }
      }),
  	}
  },
  plugins: [
    require("tailwindcss-animate"),
    require('@tailwindcss/typography')
  ],
} satisfies Config;
