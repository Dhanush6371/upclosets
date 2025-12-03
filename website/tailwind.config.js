/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: '#D4AF37',
        'gold-dark': '#B8941D',
        'gold-light': '#F0D878',
        'dark-text': '#1A1A1A',
        'light-bg': '#FAFAFA',
        primary: {
          50: '#FFF9E6',
          100: '#FFF3CC',
          200: '#FFE799',
          300: '#FFDB66',
          400: '#FFCF33',
          500: '#D4AF37',
          600: '#B8941D',
          700: '#8B6F14',
          800: '#5E4A0C',
          900: '#312503',
        },
        secondary: {
          50: '#F5F7FA',
          100: '#E4E9F0',
          200: '#C8D3E1',
          300: '#A0B3CB',
          400: '#7893B5',
          500: '#5A7CA0',
          600: '#465F7C',
          700: '#33475C',
          800: '#1F2F3D',
          900: '#0C181E',
        },
        accent: {
          rose: '#FF6B9D',
          teal: '#14B8A6',
          violet: '#8B5CF6',
          amber: '#F59E0B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-gold': 'linear-gradient(135deg, #D4AF37 0%, #F0D878 100%)',
        'gradient-dark': 'linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 100%)',
        'gradient-light': 'linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%)',
        'gradient-elegant': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'shimmer': 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
      },
      boxShadow: {
        'elegant': '0 10px 40px -10px rgba(0, 0, 0, 0.15)',
        'elegant-lg': '0 20px 60px -15px rgba(0, 0, 0, 0.3)',
        'gold': '0 10px 40px -10px rgba(212, 175, 55, 0.3)',
        'gold-lg': '0 20px 60px -15px rgba(212, 175, 55, 0.5)',
        'inner-elegant': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      },
      animation: {
        'shimmer': 'shimmer 2s infinite',
        'float': 'float 6s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.6s ease-out',
        'scale-in': 'scaleIn 0.5s ease-out',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
