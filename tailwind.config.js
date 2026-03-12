module.exports = {
  purge: [
    './styles/globals.css',
    './node_modules/video.js/dist/video-js.min.css',
    './node_modules/@silvermine/videojs-quality-selector/dist/css/quality-selector.css',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './services/**/*.{js,ts,jsx,tsx}',
    './utils/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: false, // or 'media' or 'class'
  mode: 'jit',
  theme: {
    fontFamily: {
      helvetica: ['Helvetica', 'Arial', 'sans-serif'],
      mono: ['SpaceMono', 'monospace'],
      sans: ['PublicSans', 'sans-serif'],
    },
    screens: {
      sm: '375px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
      '3xl': '1920px',
    },
    extend: {
      animation: {
        push: 'push 0.3s linear 1',
      },
      blur: {
        xs: '2px',
      },
      borderWidth: {
        2.5: '2.5px',
        3: '3px',
        6: '6px',
      },
      colors: {
        primary: {
          DEFAULT: 'var(--primary-DEFAULT)',
          dark: 'var(--primary-dark)',
        },
        gray: {
          lightest: 'var(--gray-lightest)',
          lighter: 'var(--gray-lighter)',
          light: 'var(--gray-light)',
          DEFAULT: 'var(--gray-DEFAULT)',
          dark: 'var(--gray-dark)',
        },
        border: {
          DEFAULT: 'var(--border)'
        }
      },
      height: {
        120: '30rem', // for larger images
      },
      keyframes: {
        push: {
          '50%': { transform: 'scale(0.8)' },
        },
      },
      outline: {
        primary: '2px dotted var(--primary-DEFAULT)',
      },
      transitionProperty: {
        height: 'height',
      },
    },
  },
  variants: {
    extend: {
      animation: ['hover'],
      backgroundColor: ['selection'],
      blur: ['hover'],
      borderWidth: ['first'],
      borderRadius: ['last'],
      display: ['group-hover', 'hover'],
      filter: ['hover'],
      transitionDuration: ['group-hover'],
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwindcss-selection-variant'),
  ],
};
