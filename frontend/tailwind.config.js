export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a'
        }
      },
      boxShadow: {
        glass: '0 8px 32px rgba(31, 38, 135, 0.18)'
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, rgba(59,130,246,0.18), rgba(16,185,129,0.16), rgba(168,85,247,0.14))'
      }
    }
  },
  plugins: []
};
