/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#FF7043', // Vibrant Orange
        'primary-light': '#FFE0B2',
        'food': '#FFB74D', // Orange accent
        'shopping': '#EC407A', // Pink
        'sightseeing': '#26A69A', // Teal
        'lodging': '#5C6BC0', // Indigo
        'travel': '#42A5F5', // Blue
        
        'neutral-100': '#F9F9F9',
        'neutral-200': '#F0F0F0',
        'neutral-300': '#E5E5E5',
        'neutral-400': '#CFCFCF',
        'neutral-500': '#AFAFAF',
        'neutral-600': '#8A8A8A',
        'neutral-700': '#6F6F6F',
        'neutral-800': '#555555',
        'neutral-900': '#3C3C3C',
      }
    },
  },
  plugins: [],
}
