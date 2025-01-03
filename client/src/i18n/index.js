import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

export const locales = {
	en: 'English',
	vi: 'Tiếng Việt',
};

const resources = {
	en: {},
	vi: {},
};

i18next.use(initReactI18next).init({
	resources,
	lng: 'en',
	debug: false,
	defaultNS: 'layout',
	interpolation: {
		excapeValue: false,
	},
});
