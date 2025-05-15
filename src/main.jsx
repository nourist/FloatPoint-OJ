import { createRoot } from 'react-dom/client';

import './styles/main.css';
import App from './App.jsx';
import './i18n';

createRoot(document.getElementById('root')).render(<App />);
