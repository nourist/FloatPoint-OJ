import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';

export const locales = {
	en: 'English',
	vi: 'Tiếng Việt',
};

i18next
	.use(initReactI18next)
	.use(HttpApi)
	.init({
		lng: 'en',
		defaultNS: 'layout',
		interpolation: {
			excapeValue: false,
		},
		debug: true,
		saveMissing: true,
		missingKeyHandler: function (lng, ns, key) {
			console.warn(`[i18next] Missing key: '${key}' in namespace: '${ns}', language: '${lng}'`);
		},
	});
