import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        data: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        truth: {
          red: '#CC0000',
          dark: '#1A0A0A',
          cream: '#F5F0E8',
        },
        score: {
          ghost: '#E53E3E',
          partial: '#D97706',
          genuine: '#059669',
          verified: '#065F46',
        },
        accent: {
          leaf: '#34D399',
          warning: '#FBBF24',
        },
        surface: {
          bg: '#0D0908',
          card: '#1A120F',
          elevated: '#231812',
        },
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '20px',
        pill: '9999px',
      },
      boxShadow: {
        card: '0 4px 24px rgba(0, 0, 0, 0.08)',
        score: '0 8px 32px rgba(0, 0, 0, 0.16)',
        'glow-green': '0 0 32px rgba(52, 211, 153, 0.25)',
        'glow-red': '0 0 32px rgba(229, 62, 62, 0.25)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease both',
        'slide-in-right': 'slideInRight 0.4s ease both',
        'score-pop': 'scorePop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        'leaf-float': 'leafFloat 4s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'scan-pulse': 'scanPulse 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
