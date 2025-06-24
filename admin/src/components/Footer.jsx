import { useTranslation } from 'react-i18next';

const Footer = () => {
	const { t } = useTranslation();

	return (
		<div className="text-base-content/70 flex items-center gap-1 py-5">
			© 2025, {t('made-with')}
			<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M3.17157 5.17157C4.73367 3.60948 7.26633 3.60948 8.82843 5.17157L10 6.34315L11.1716 5.17157C12.7337 3.60948 15.2663 3.60948 16.8284 5.17157C18.3905 6.73367 18.3905 9.26633 16.8284 10.8284L10 17.6569L3.17157 10.8284C1.60948 9.26633 1.60948 6.73367 3.17157 5.17157Z"
					fill="#f5222d"
				></path>
			</svg>
			{t('by')}{' '}
			<a
				className="from-primary to-secondary bg-gradient-to-r bg-clip-text font-semibold transition-all duration-100 hover:text-transparent"
				href="https://github.com/nourist"
			>
				Nourist
			</a>
			<a href="https://github.com/nourist/Float-Point-Admin/blob/main/LICENSE" className="hover:text-base-content ml-auto capitalize">
				{t('license')}
			</a>
		</div>
	);
};

export default Footer;
