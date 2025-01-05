import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import routesConfig from '~/config/routes';
import HexagonIcon from '~/components/HexagonIcon';

const Welcome = () => {
	const { t } = useTranslation('welcome');

	return (
		<div className="dark:bg-gray-900 h-full overflow-auto relative">
			<div
				className="absolute top-0 inset-0 m-auto max-w-xs h-[357px] blur-[118px] sm:max-w-md md:max-w-lg"
				style={{
					background:
						'linear-gradient(106.89deg, rgba(192, 132, 252, 0.11) 15.73%, rgba(14, 165, 233, 0.41) 15.74%, rgba(232, 121, 249, 0.26) 56.49%, rgba(79, 70, 229, 0.4) 115.91%)',
				}}
			></div>
			<header className="w-full h-20 flex justify-between items-center py-6 px-12">
				<Link to={routesConfig.welcome}>
					<img src="./logo.png" alt="" className="size-9" />
				</Link>
				<div>
					<button className="font-semibold text-gray-900 text-sm mx-6 transition-all hover:text-gray-700 dark:text-gray-50 dark:hover:text-gray-300">
						{t('home')}
					</button>
					<button className="font-semibold text-gray-900 text-sm mx-6 transition-all hover:text-gray-700 dark:text-gray-50 dark:hover:text-gray-300">
						{t('product')}
					</button>
					<button className="font-semibold text-gray-900 text-sm mx-6 transition-all hover:text-gray-700 dark:text-gray-50 dark:hover:text-gray-300">
						{t('developer')}
					</button>
					<a
						className="font-semibold text-gray-900 text-sm mx-6 transition-all hover:text-gray-700 dark:text-gray-50 dark:hover:text-gray-300"
						href="https://github.com/nourist"
					>
						{t('about-me')}
					</a>
				</div>
				<Link className="font-semibold text-gray-900 text-sm transition-all dark:text-gray-50 hover:text-sky-500">
					{t('login')}
					<FontAwesomeIcon icon="fa-solid fa-arrow-right" className="ml-1 mb-[-1px]" />
				</Link>
			</header>
			<div className="w-full h-[80%] space-y-10 text-center py-36 relative">
				<h1 className="text-4xl text-gray-800 font-extrabold mx-auto md:text-5xl dark:text-white">
					{(() => {
						const arr = t('slogan')
							.split(' ')
							.map((item) => ` ${item}`);
						arr[arr.length - 1] = (
							<span
								key={arr.length - 1}
								className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#E114E5]"
							>
								{arr[arr.length - 1]}
							</span>
						);
						return arr;
					})()}
				</h1>
				<p className="max-w-2xl mx-auto text-gray-500 dark:text-gray-400">{t('description')}</p>
				<div className="space-x-2">
					<Link className="px-3.5 py-2.5 bg-sky-500 rounded-md font-semibold text-white text-sm transition-all hover:bg-sky-400">
						{t('get-started')}
					</Link>
					<a
						className="px-3.5 py-2.5 font-semibold text-sm transition-all hover:text-gray-700 dark:text-gray-50 dark:hover:text-gray-300"
						href="https://github.com/nourist/Float-Point"
					>
						{t('learn-more')}
						<FontAwesomeIcon icon="fa-solid fa-arrow-right" className="ml-1 mb-[-1px]" />
					</a>
				</div>
			</div>
			<div className="w-full h-[70%]">
				<div className="flex flex-row space-x-[-12px]">
					<HexagonIcon className="z-20">
						<p className="text-sky-500 font-bold text-xs">7749</p>
					</HexagonIcon>
					<HexagonIcon bg="linear-gradient(to bottom right, #cddc39 0%, #8bc34a 100%)" className="z-10">
						<FontAwesomeIcon className="text-lime-400" icon="fa-solid fa-users" />
					</HexagonIcon>
					<HexagonIcon bg="linear-gradient(to bottom right, #ffeb3b 0%, #fbc02d 100%)" className="z-0">
						<FontAwesomeIcon className="text-yellow-400" icon="fa-solid fa-trophy" />
					</HexagonIcon>
				</div>
			</div>
		</div>
	);
};

export default Welcome;
