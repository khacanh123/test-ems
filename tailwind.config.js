const plugin = require('tailwindcss/plugin');
const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './index.html'],
  theme: {
    colors: {
      ...colors,
      'ct-primary': '#0A194E',
      'ct-secondary': '#017EFA',

      'ct-blue-100': '#E6F2FE',
      'ct-blue-200': '#B6E9FF',
      'ct-blue-300': '#51CBFF',
      'ct-blue-400': '#254BD1',
      'ct-blue-500': '#445BFF',

      'ct-purple-100': '#F3F0FF',
      'ct-purple-200': '#7659FF',
      'ct-purple-300': '#6342FF',

      'ct-green-300': '#30D987',
      'ct-green-400': '#1EC574',

      'ct-red-300': '#FF5A5A',
      'ct-red-400': '#DD405F',
      'ct-red-500': '#EF4444',

      'ct-pink-100': '#FFEAF6',
      'ct-pink-400': '#FD1F9B',

      'ct-gray-100': '#F5F7FB',
      'ct-gray-200': '#A9ABB0',
      'ct-gray-300': '#979797',
      'ct-gray-400': '#8E8E8E',
      'ct-gray-500': '#828282',
      'ct-gray-600': '#F3F3F3',

      'ct-neutral-300': '#2A2D44',
      'ct-neutral-400': '#1C1F37',
      'ct-neutral-500': '#313131',
    },
    extend: {
      dropShadow: {
        df: '0px 5px 10px 0px #F1F2FA',
      },
      minHeight: {
        'screen-75': '75vh',
      },
      fontSize: {
        55: '55rem',
      },
      opacity: {
        80: '.8',
      },
      zIndex: {
        2: 2,
        3: 3,
      },
      inset: {
        '-100': '-100%',
        '-225-px': '-225px',
        '-160-px': '-160px',
        '-150-px': '-150px',
        '-94-px': '-94px',
        '-50-px': '-50px',
        '-29-px': '-29px',
        '-20-px': '-20px',
        '25-px': '25px',
        '40-px': '40px',
        '95-px': '95px',
        '145-px': '145px',
        '195-px': '195px',
        '210-px': '210px',
        '260-px': '260px',
      },
      height: {
        '95-px': '95px',
        '70-px': '70px',
        '350-px': '350px',
        '500-px': '500px',
        '600-px': '600px',
      },
      maxHeight: {
        '860-px': '860px',
      },
      maxWidth: {
        '100-px': '100px',
        '120-px': '120px',
        '150-px': '150px',
        '180-px': '180px',
        '200-px': '200px',
        '210-px': '210px',
        '580-px': '580px',
      },
      minWidth: {
        '140-px': '140px',
        48: '12rem',
      },
      backgroundSize: {
        full: '100%',
      },
    },
  },
  variants: [
    'responsive',
    'group-hover',
    'focus-within',
    'first',
    'last',
    'odd',
    'even',
    'hover',
    'focus',
    'active',
    'visited',
    'disabled',
  ],
  plugins: [
    require('@tailwindcss/line-clamp'),
    plugin(function ({ addComponents, theme }) {
      const screens = theme('screens', {});
      addComponents([
        {
          '.container': { width: '100%' },
        },
        {
          [`@media (min-width: ${screens.sm})`]: {
            '.container': {
              'max-width': '640px',
            },
          },
        },
        {
          [`@media (min-width: ${screens.md})`]: {
            '.container': {
              'max-width': '768px',
            },
          },
        },
        {
          [`@media (min-width: ${screens.lg})`]: {
            '.container': {
              'max-width': '1024px',
            },
          },
        },
        {
          [`@media (min-width: ${screens.xl})`]: {
            '.container': {
              'max-width': '1280px',
            },
          },
        },
        {
          [`@media (min-width: ${screens['2xl']})`]: {
            '.container': {
              'max-width': '1280px',
            },
          },
        },
      ]);
    }),
  ],
};
