/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // PCB substrate / enclosure
        board: {
          900: '#050807',
          800: '#080d0b',
          700: '#0c1310',
          600: '#111a16',
          500: '#16211c',
        },
        // etched silkscreen lines & panel borders
        etch: {
          DEFAULT: '#1d2e26',
          bright: '#2c4638',
        },
        // P1 phosphor — primary signal color
        phos: {
          DEFAULT: '#4dff9f',
          dim: '#2f9e66',
          deep: '#0f3d27',
        },
        // secondary rails
        amber: { DEFAULT: '#ffb454', dim: '#a8712c' },
        copper: { DEFAULT: '#c87137', dim: '#7d4722' },
        fault: { DEFAULT: '#ff5f56', dim: '#9e3630' },
        probe: { DEFAULT: '#57c7ff', dim: '#2c7ba8' },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Share Tech Mono"', 'ui-monospace', 'monospace'],
        display: ['"VT323"', '"Share Tech Mono"', 'monospace'],
        tech: ['"Share Tech Mono"', 'monospace'],
        // legacy aliases kept so no view falls back to a proportional face
        orbitron: ['"VT323"', '"Share Tech Mono"', 'monospace'],
        rajdhani: ['"JetBrains Mono"', '"Share Tech Mono"', 'monospace'],
      },
      boxShadow: {
        panel: '0 0 0 1px rgba(29,46,38,1), 0 18px 40px -24px rgba(0,0,0,0.9)',
        glow: '0 0 12px rgba(77,255,159,0.28)',
        'glow-sm': '0 0 6px rgba(77,255,159,0.35)',
        inset: 'inset 0 1px 0 rgba(77,255,159,0.06)',
      },
      borderRadius: {
        // hardware has chamfers, not pillows
        term: '2px',
      },
      keyframes: {
        blink: { '0%,49%': { opacity: '1' }, '50%,100%': { opacity: '0' } },
        scan: { '0%': { transform: 'translateY(-100%)' }, '100%': { transform: 'translateY(100%)' } },
        flicker: {
          '0%,100%': { opacity: '0.97' },
          '8%': { opacity: '0.88' },
          '9%': { opacity: '1' },
          '43%': { opacity: '0.93' },
          '44%': { opacity: '1' },
        },
        blip: {
          '0%,100%': { opacity: '0.15', transform: 'scale(0.7)' },
          '50%': { opacity: '0.9', transform: 'scale(1)' },
        },
        trace: { '0%': { strokeDashoffset: '24' }, '100%': { strokeDashoffset: '0' } },
        flagWave: {
          '0%,100%': { transform: 'rotate(0deg) translateY(0)' },
          '50%': { transform: 'rotate(2deg) translateY(-2px)' },
        },
      },
      animation: {
        blink: 'blink 1.05s step-end infinite',
        scan: 'scan 7s linear infinite',
        flicker: 'flicker 4s infinite',
        blip: 'blip 4s ease-in-out infinite',
        trace: 'trace 1.2s linear infinite',
        'flag-wave': 'flagWave 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
