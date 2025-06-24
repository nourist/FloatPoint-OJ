import { useEffect } from 'react';
import { ThemeProvider } from '@material-tailwind/react';
import { useTranslation } from 'react-i18next';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';

import './styles/main.css';
import './styles/toast.css';
import 'react-autocomplete-input/dist/bundle.css';
import './styles/autocomplete.css';
import '@mdxeditor/editor/style.css';
import './styles/editor.css';

import AppRouter from './components/AppRouter';
import { auth, logout } from './services/auth';
import useLoadingStore from './stores/loadingStore';
import Loading from './components/Loading';
import useDebounce from './hooks/useDebounce';
import useThemeStore from './stores/themeStore';
import themeValue from './config/theme';

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 1, refetchInterval: 180000 } } });

const App = () => {
	const { i18n } = useTranslation();
	const { loading } = useLoadingStore();
	const { theme, updateSystemTheme } = useThemeStore();

	const isLoading = useDebounce(loading, 50);

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
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

		mediaQuery.addEventListener('change', updateSystemTheme);
		return () => mediaQuery.removeEventListener('change', updateSystemTheme);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		auth().catch((err) => {
			if (err === 'You are not Admin') {
				logout();
			}
		});
	}, []);

	if (isLoading) {
		return <Loading />;
	}

	return (
		<ThemeProvider value={themeValue}>
			<QueryClientProvider client={queryClient}>
				<AppRouter />
				<ToastContainer
					position="bottom-right"
					autoClose={5000}
					hideProgressBar={false}
					newestOnTop
					closeOnClick
					rtl={false}
					pauseOnFocusLoss
					draggable
					pauseOnHover
					className="!bg-transparent"
					toastClassName="toast-modern toast-luxury toast-glass"
				/>
			</QueryClientProvider>
		</ThemeProvider>
	);
};

export default App;
