import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import Chart from 'react-apexcharts';

import { getMonthlySubmissions } from '~/services/stat';
import statusColors from '~/config/statusColor';
import Error from './Error';

const MonthlySubmissionsCard = () => {
	const { t } = useTranslation('dashboard');

	const {
		data: monthlySubmissions,
		isLoading: monthlySubmissionsLoading,
		error: monthlySubmissionsErr,
	} = useQuery({
		queryKey: ['monthlySubmissions'],
		queryFn: getMonthlySubmissions,
		refetchInterval: 180000,
		retry: 3,
	});

	return (
		<div className="bg-base-100 shadow-shadow-color/5 h-[445px] w-full rounded-xl p-8 pt-5 shadow-lg md:w-[360px]">
			{monthlySubmissionsErr ? (
				<Error keys={['monthlySubmissions']}>{monthlySubmissionsErr}</Error>
			) : (
				<>
					<h2 className="text-base-content pb-3 text-center text-[15px] font-semibold capitalize">{t('monthly-submissions')}</h2>
					{monthlySubmissionsLoading && !monthlySubmissions ? (
						<>
							<div className="skeleton mx-auto mb-6 size-[290px] rounded-full md:size-[272px]"></div>
							<div className="skeleton mx-auto mb-[6px] h-5 w-full rounded-lg"></div>
							<div className="skeleton mx-auto h-5 w-full rounded-lg"></div>
						</>
					) : (
						<div className="flex-center h-[360px]">
							<Chart
								width={'100%'}
								height={'100%'}
								type="pie"
								series={monthlySubmissions?.map((item) => item.count)}
								options={{
									labels: monthlySubmissions?.map((item) => item._id),
									colors: monthlySubmissions?.map((item) => statusColors[item._id.toLowerCase()]),
									legend: {
										position: 'bottom',
										labels: {
											colors: Array(monthlySubmissions?.length).fill('var(--color-base-content)'),
										},
									},
								}}
							/>
						</div>
					)}
				</>
			)}
		</div>
	);
};

export default MonthlySubmissionsCard;
