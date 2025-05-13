import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@material-tailwind/react';
import './styles/main.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
	<ThemeProvider>
		<App />
	</ThemeProvider>,
);
