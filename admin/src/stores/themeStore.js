import { create } from 'zustand';

const useThemeStore = create((set) => {
	const mode = localStorage.getItem('mode') || 'system';

	const getSystemTheme = () => (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

	const theme = mode === 'system' ? getSystemTheme() : mode;

	return {
		mode,
		theme,
		getSystemTheme,
		updateSystemTheme: () => {
			if (mode === 'system') {
				set({ theme: getSystemTheme() });
			}
		},
		setMode: (newMode) => {
			localStorage.setItem('mode', newMode);
			set({ mode: newMode, theme: newMode === 'system' ? getSystemTheme() : newMode });
		},
	};
});

export default useThemeStore;
