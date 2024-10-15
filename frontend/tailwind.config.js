module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Indique que Tailwind doit être appliqué à tous les fichiers JS/JSX/TS/TSX dans src/
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1E40AF', // Indigo
        secondary: '#FBBF24', // Jaune
        accent: '#10B981',   // Vert
        background: '#F3F4F6', // Gris clair pour les arrière-plans
        danger: '#EF4444',   // Rouge pour les alertes ou erreurs
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Utilisation de la police Inter comme font par défaut
      },
      spacing: {
        '128': '32rem', // Ajout d'une plus grande taille de padding/margin
        '144': '36rem',
      },
      borderRadius: {
        'xl': '1.5rem', // Ajout de tailles supplémentaires pour les bordures arrondies
      },
      animation: {
        bounce200: 'bounce 1s infinite 200ms', // Animation de rebond plus lente
        pulse400: 'pulse 2s infinite 400ms',   // Animation de pulsation personnalisée
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'), // Plugin pour styliser facilement les formulaires
    require('@tailwindcss/typography'), // Plugin pour améliorer la typographie
  ],
}
