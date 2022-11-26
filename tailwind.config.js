const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ['./src/**/*.{html,js,jsx,ts,tsx,vue}'],
  theme: {
    fontFamily: {
      sans: ['Red Hat Display', 'Roboto', ...defaultTheme.fontFamily.sans]
    }
  },
  plugins: []
}
