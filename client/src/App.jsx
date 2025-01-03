import { useTranslation } from 'react-i18next';

import AppRouter from './components/AppRouter';
import useThemeStore from './stores/themeStore';
import { useEffect } from 'react';

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

	return (
		<div className={`${theme == 'dark' && 'dark'} h-full w-full`}>
			<AppRouter />
		</div>
	);
};

export default App;
