import { useTranslation } from 'react-i18next';
import React, { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { TooltipProvider } from '~/components/ui/tooltip';

import useThemeStore from './stores/themeStore';
import useAuthStore from './stores/authStore';
import useLoadingStore from './stores/loadingStore';
import useThemeListener from './hooks/useThemeListener';
import AppRouter from './components/AppRouter';
import Loading from './components/Loading';

const App = () => {
	const { i18n } = useTranslation();
	const { theme } = useThemeStore();
	const { getInfo } = useAuthStore();
	const { isLoading } = useLoadingStore();

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

	useThemeListener();

	if (isLoading) {
		return <Loading />;
	}

	return (
		<React.Suspense fallback={<Loading />}>
			<TooltipProvider>
				<AppRouter />
				<ToastContainer position="bottom-right" theme={theme} newestOnTop draggable></ToastContainer>
			</TooltipProvider>
		</React.Suspense>
	);
};

export default App;
