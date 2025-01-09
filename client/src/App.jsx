import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { TooltipProvider } from '~/components/ui/tooltip';

import AppRouter from './components/AppRouter';
import useThemeStore from './stores/themeStore';
import useAuthStore from './stores/authStore';

const App = () => {
	const { i18n } = useTranslation();
	const { theme } = useThemeStore();
	const { getInfo } = useAuthStore();

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

	useEffect(() => {
		getInfo();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<TooltipProvider>
			<AppRouter />
		</TooltipProvider>
	);
};

export default App;
