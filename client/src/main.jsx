import React from 'react';
import ReactDOM from 'react-dom/client';

import './i18n';
import './assets/css/main.css';
import App from './App.jsx';

console.log('%cHello! \ud83d\ude4b', 'color: #3486eb;font-size: 16px; font-weight: 600;');
console.log(
	`%cFloatPoint front-end was built with Javascript, React, Tailwind...
FloatPoint back-end was built with NodeJS, ExpressJS, MongoDB...`,
	'color: #29c4a9;font-size: 14px;',
);

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);
