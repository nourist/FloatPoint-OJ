import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { TooltipProvider } from '~/components/ui/tooltip';

import AppRouter from './components/AppRouter';
import useThemeStore from './stores/themeStore';

const App = () => {
	const { i18n } = useTranslation();
	const { theme } = useThemeStore();

	useEffect(() => {
		i18n.changeLanguage(localStorage.getItem('lang') || 'en');
		i18n.on('languageChanged', (lng) => {
			localStorage.setItem('lang', lng);
		});
		return () =>
			i18n.off('languageChanged', (lng) => {
				localStorage.setItem('lang', lng);
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		document.documentElement.classList.remove('light', 'dark');
		document.documentElement.classList.add(theme);
	}, [theme]);

	return (
		<TooltipProvider>
			<AppRouter />
		</TooltipProvider>
	);
};

export default App;
