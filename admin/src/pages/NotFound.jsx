import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Heart } from 'lucide-react';
import { Link } from 'react-router';

import Ghost from '~/assets/ghost.svg';

const NotFound = () => {
	const { t } = useTranslation('notFound');

	const [love, setLove] = useState(false);

	return (
		<div className="flex-center h-[100vh] w-full flex-col">
			<div className="text-blue-gray-800 dark:text-blue-gray-50 flex-center text-shadow-[.05em_.05em_0_rgba(0,0,0,0.25)] max-h-[252px] gap-4 text-[168px] font-bold">
				4
				<div className="animate-bounce">
					<div
						data-love={love}
						className="bg-blue-gray-100 data-[love=true]:flex-center text-blue-gray-800 text-shadow-none mx-auto w-full overflow-hidden whitespace-nowrap rounded-md py-1 text-center text-base transition-all duration-150 data-[love=true]:size-8"
					>
						{love ? <Heart className="size-5" color="#fb6f92" fill="#fb6f92" /> : t('smash')}
					</div>
					<div className="border-t-blue-gray-100 mx-auto mb-4 h-0 w-0 border-l-4 border-r-4 border-t-4 border-transparent"></div>
					<Link to="/">
						<Ghost
							onMouseEnter={() => setLove(true)}
							onMouseLeave={() => setLove(false)}
							className="text-primary size-32 cursor-pointer drop-shadow-[.05em_.05em_0_rgba(0,0,0,0.25)]"
						/>
					</Link>
				</div>
				4
			</div>
			<h2 className="text-blue-gray-700 dark:text-blue-gray-100 text-lg">{t('msg')}</h2>
		</div>
	);
};

export default NotFound;
