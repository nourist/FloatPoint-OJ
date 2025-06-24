import { UserPlus, Braces, Send, Check } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { getStat } from '~/services/stat';
import PercentChange from './PercentChange';
import Error from './Error';

const StatCard = () => {
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

	const {
		data: prevStat,
		isLoading: prevStatLoading,
		error: prevStatErr,
	} = useQuery({
		queryKey: ['prevStat'],
		queryFn: () => {
			const yesterday = new Date();
			yesterday.setDate(new Date().getDate() - 1);
			return getStat(yesterday);
		},
	});

	return (
		<div className="grid grid-cols-4 grid-rows-4 gap-6">
			{statErr || prevStatErr ? (
				<Error className="col-span-4 row-span-4 !h-[432px] sm:!h-[216px] xl:!h-[96px]" keys={[['stat'], ['prevStat']]}>
					{statErr || prevStatErr}
				</Error>
			) : (
				[
					{
						title: t('today-submissions'),
						value: stat?.countTodaySubmissions,
						prev: prevStat?.countTodaySubmissions,
						next: stat?.countTodaySubmissions,
						icon: Send,
					},
					{
						title: t('today-accepted'),
						value: stat?.countTodayAccepted,
						prev: prevStat?.countTodayAccepted,
						next: stat?.countTodayAccepted,
						icon: Check,
					},
					{
						title: t('today-problems'),
						value: stat?.countTodayProblem,
						prev: prevStat?.countTodayProblem,
						next: stat?.countTodayProblem,
						icon: Braces,
					},
					{
						title: t('new-users'),
						value: `+${stat?.countUserCreatedToday}`,
						prev: prevStat?.countUserCreatedToday,
						next: stat?.countUserCreatedToday,
						icon: UserPlus,
					},
				].map((item, index) => (
					<div
						key={index}
						className="bg-base-100 flex-center shadow-shadow-color/3 col-span-4 h-24 rounded-xl p-4 shadow-xl sm:col-span-2 sm:row-span-2 xl:col-span-1 xl:row-span-4"
					>
						<div className="flex-1">
							<h3 className="text-base-content/70 text-sm font-semibold capitalize">{item.title}</h3>
							{statLoading || prevStatLoading ? (
								<div className="skeleton mt-1 h-8 w-24 rounded-lg"></div>
							) : (
								<p className="text-base-content text-3xl font-bold">
									{item.value}
									<PercentChange prev={item.prev} next={item.next} className="ml-2" />
								</p>
							)}
						</div>
						<div className="bg-primary flex-center size-12 rounded-lg text-white shadow-md">
							<item.icon />
						</div>
					</div>
				))
			)}
		</div>
	);
};

export default StatCard;
