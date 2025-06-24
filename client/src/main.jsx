// import React from 'react';
import ReactDOM from 'react-dom/client';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';
import { loader } from '@monaco-editor/react';
import blackboard from 'monaco-themes/themes/Blackboard.json';

import './i18n';
import './assets/css/main.css';
import App from './App.jsx';

library.add(fab, far, fas);

ChartJS.register(ArcElement, Tooltip);

loader.init().then((monacoInstance) => {
	monacoInstance.editor.defineTheme('blackboard', blackboard);
});

console.log('%cHello! \ud83d\ude4b', 'color: #3486eb;font-size: 16px; font-weight: 600;');
console.log(
	`%cFloatPoint front-end was built with Javascript, React, Tailwind...
FloatPoint back-end was built with NodeJS, ExpressJS, MongoDB...`,
	'color: #29c4a9;font-size: 14px;',
);
console.log('%cNote: This project inspired by LeetCode, DMOJ, Codeforces...', 'color: #f4a261;font-size: 14px; font-weight: 600;');

ReactDOM.createRoot(document.getElementById('root')).render(
	// <React.StrictMode>
	<App />,
	// </React.StrictMode>,
);
