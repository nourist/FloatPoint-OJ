import { UserPlus, UserRoundCheck, Send, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';

import { getStat } from '~/services/stat';
import Error from '~/components/Error';

const Dashboard = () => {
	const { t } = useTranslation('dashboard');

	const {
		data: stat,
		isLoading: statLoading,
		error: statErr,
	} = useQuery({
		queryKey: ['stat'],
		queryFn: getStat,
		refetchInterval: 180000,
		retry: 3,
	});

	if (statErr) return <Error>{statErr}</Error>;

	return (
		<div className="h-[100vh]">
			<div className="grid grid-cols-4 grid-rows-4 gap-6">
				{[
					{
						title: t('today-submissions'),
						value: '896',
						rate: 12,
						icon: Send,
					},
					{
						title: t('today-accepted'),
						value: '896',
						rate: 12,
						icon: Check,
					},
					{
						title: t('today-users'),
						value: '896',
						rate: -8,
						icon: UserRoundCheck,
					},
					{
						title: t('new-users'),
						value: '896',
						rate: 0,
						icon: UserPlus,
					},
				].map((item, index) => (
					<div
						key={index}
						className="bg-base-100 flex-center shadow-shadow-color/3 col-span-4 h-24 rounded-xl p-4 shadow-xl sm:col-span-2 sm:row-span-2 xl:col-span-1 xl:row-span-4"
					>
						<div className="flex-1">
							<h3 className="text-base-content/70 text-sm font-semibold capitalize">{item.title}</h3>
							{statLoading ? (
								<div className="skeleton mt-1 h-8 w-24 rounded-lg"></div>
							) : (
								<p className="text-base-content text-3xl font-bold">
									{item.value}
									<span
										data-worse={item.rate < 0}
										className="text-success data-[worse=true]:text-error ml-2 text-sm"
									>{`${item.rate >= 0 ? '+' : ''}${item.rate}%`}</span>
								</p>
							)}
						</div>
						<div className="bg-primary flex-center size-12 rounded-lg text-white shadow-md">
							<item.icon />
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default Dashboard;
