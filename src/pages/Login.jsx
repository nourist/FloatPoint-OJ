import { useTranslation } from 'react-i18next';

import { login, logout } from '~/services/auth';

const Login = () => {
	const { t } = useTranslation('login');

	return (
		<div className="flex-center h-[100vh] w-full">
			<div className="bg-base-100 shadow-cxl grid aspect-video w-full max-w-4xl grid-cols-5 overflow-hidden rounded-2xl shadow-gray-300">
				<div className="bg-primary relative col-span-2 overflow-hidden px-12 py-14">
					<div className="absolute -bottom-14 -left-12 size-44 rounded-full bg-white opacity-20"></div>
					<div className="absolute -top-20 -right-14 size-48 rounded-full bg-[#0068c4] opacity-30"></div>
					<img src="/logo.png" alt="" className="mx-auto size-36" />
					<h2 className="text-neutral-content mt-4 mb-2 text-4xl font-bold uppercase">{t('welcome')}</h2>
					<h3 className="text-neutral-content mb-6 text-xl font-semibold">FloatPoint</h3>
					<p className="text-neutral-content/90 mb-8 text-sm">{t('description')}</p>
				</div>
				<div className="bg-base-100 col-span-3"></div>
			</div>
		</div>
	);
};

export default Login;
