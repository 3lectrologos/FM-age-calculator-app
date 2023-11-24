import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        purple: 'hsl(259 100% 65%)',
        lightred: 'hsl(0 100% 67%)',
        offwhite: 'hsl(0 0% 94%)',
        lightgray: 'hsl(0, 0% 86%)',
        smokeygray: 'hsl(0 1% 44%)',
        offblack: 'hsl(0 0% 8%)'
      }
    },
  },
  plugins: [],
}
export default config
