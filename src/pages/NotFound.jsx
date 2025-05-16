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
			<div className="text-blue-gray-800 flex-center max-h-[252px] gap-4 text-[168px] font-bold text-shadow-[.05em_.05em_0_rgba(0,0,0,0.25)]">
				4
				<div className="animate-bounce">
					<div
						data-love={love}
						className="bg-blue-gray-100 data-[love=true]:flex-center mx-auto w-full overflow-hidden rounded-md py-1 text-center text-base whitespace-nowrap transition-all duration-150 text-shadow-none data-[love=true]:size-8"
					>
						{love ? <Heart className="size-5" color="#fb6f92" fill="#fb6f92" /> : t('smash')}
					</div>
					<div className="border-t-blue-gray-100 mx-auto mb-4 h-0 w-0 border-t-4 border-r-4 border-l-4 border-transparent"></div>
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
			<h2 className="text-blue-gray-700 text-lg">{t('msg')}</h2>
		</div>
	);
};

export default NotFound;
