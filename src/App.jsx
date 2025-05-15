import { useEffect } from 'react';
import { ThemeProvider } from '@material-tailwind/react';
import { useTranslation } from 'react-i18next';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import AppRouter from './components/AppRouter';
import { auth } from './services/auth';
import useLoadingStore from './stores/loadingStore';
import Loading from './components/Loading';

const queryClient = new QueryClient();

const App = () => {
	const { i18n } = useTranslation();
	const { loading } = useLoadingStore();

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
		auth();
	}, []);

	if (loading) {
		return <Loading></Loading>;
	}

	return (
		<ThemeProvider>
			<QueryClientProvider client={queryClient}>
				<AppRouter />
			</QueryClientProvider>
		</ThemeProvider>
	);
};

export default App;
