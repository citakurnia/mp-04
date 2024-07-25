import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],

  theme: {
    extend: {
      colors: {
        'red-primary': '#d32f23',
        'orange-primary': '#ffae4b',
        'blue-light': '#d9f8ff',
        'black-blue': '#022033',
        'blue-med': '#107faa',
        'cream-primary': '#f1efe7',
      },
    },
  },
  plugins: [],
};
export default config;
