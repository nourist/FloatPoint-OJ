import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import WELCOME_EN from '../locales/en/welcome.json';

export const locales = {
	en: 'English',
	vi: 'Tiếng Việt',
};

const resources = {
	en: { welcome: WELCOME_EN },
	vi: {},
};

i18next.use(initReactI18next).init({
	resources,
	lng: 'en',
	debug: false,
	defaultNS: '',
	interpolation: {
		excapeValue: false,
	},
});
