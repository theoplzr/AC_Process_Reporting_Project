module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", 
  ],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 1.5s ease-in-out',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      animation: {
        fadeIn: 'fadeIn 0.4s ease-in-out',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'), // Plugin pour styliser facilement les formulaires
    require('@tailwindcss/typography'), // Plugin pour améliorer la typographie
  ],
}
