import { useEffect } from 'react';
import { ThemeProvider } from '@material-tailwind/react';
import { useTranslation } from 'react-i18next';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';

import './styles/main.css';
import './styles/toast.css';

import AppRouter from './components/AppRouter';
import { auth, logout } from './services/auth';
import useLoadingStore from './stores/loadingStore';
import Loading from './components/Loading';
import useDebounce from './hooks/useDebounce';

const queryClient = new QueryClient();

const App = () => {
	const { i18n } = useTranslation();
	const { loading } = useLoadingStore();

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
		<ThemeProvider>
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
