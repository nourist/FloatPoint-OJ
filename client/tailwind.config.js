/** @type {import('tailwindcss').Config} */
import animate from 'tailwindcss-animate';

export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			colors: {
				primary: '#0ea5e9',
				secondary: '#ffaf16',
			},
		},
		fontFamily: {
			poppins: ['Poppins', 'sans-serif'],
		},
	},
	darkMode: ['class'],
	plugins: [animate],
};
