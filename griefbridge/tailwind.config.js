/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#EEEDFE',
          100: '#CECBF6',
          200: '#AFA9EC',
          400: '#7F77DD',
          600: '#534AB7',
          800: '#3C3489',
          900: '#26215C',
        },
        stone: {
          50:  '#F8F7F4',
          100: '#EDECEA',
          200: '#D3D1C7',
          400: '#888780',
          600: '#5F5E5A',
          800: '#2C2C2A',
        },
        memory: {
          50:  '#E1F5EE',
          200: '#5DCAA5',
          600: '#0F6E56',
          800: '#085041',
        }
      },
      fontFamily: {
        serif: ['var(--font-lora)', 'Georgia', 'serif'],
        sans:  ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'scroll-line': 'scrollLine 1.5s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in-up': 'fadeInUp 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        'draw-line': 'drawLine 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        'orb-drift': 'orbDrift 18s ease-in-out infinite alternate',
        'typing-bob': 'typingBob 1.2s ease-in-out infinite',
        'message-in': 'messageIn 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) both',
        'highlight-fade': 'highlightFade 1.5s 0.8s ease-out both',
        'attention-pulse': 'attentionPulse 2.5s ease-in-out infinite',
      },
      keyframes: {
        scrollLine: {
          '0%, 100%': { opacity: '0', transform: 'scaleY(0)', transformOrigin: 'top' },
          '50%': { opacity: '1', transform: 'scaleY(1)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        drawLine: {
          '0%': { transform: 'scaleX(0)', transformOrigin: 'left' },
          '100%': { transform: 'scaleX(1)' },
        },
        orbDrift: {
          'from': { transform: 'translate(0, 0)' },
          'to': { transform: 'translate(24px, -24px)' },
        },
        typingBob: {
          '0%, 60%, 100%': { transform: 'translateY(0)' },
          '30%': { transform: 'translateY(-5px)' },
        },
        messageIn: {
          'from': { opacity: '0', transform: 'translateY(12px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        attentionPulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.65' },
        },
        highlightFade: {
          '0%': { backgroundColor: '#CECBF6' },
          '100%': { backgroundColor: '#EEEDFE' },
        },
      },
    },
  },
  plugins: [],
};
