import { createRoot } from 'react-dom/client';

import App from './App.jsx';
import './i18n';

console.log('%cHello! \ud83d\ude4b', 'color: #3486eb;font-size: 16px; font-weight: 600;');
console.log('%cFloatPoint Admin Dashboard was built with Javascript, React, Tailwind, Material-Tailwind, Recharts, Apexcharts...', 'color: #29c4a9;font-size: 14px;');
console.log('%cWith lots of loves', 'color: #f43098;font-size: 14px;');

createRoot(document.getElementById('root')).render(<App />);
