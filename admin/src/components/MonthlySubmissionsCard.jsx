import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import Chart from 'react-apexcharts';
import { LoaderCircle } from 'lucide-react';

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
	});

	return (
		<div className="bg-base-100 shadow-shadow-color/5 h-[445px] w-full rounded-xl px-8 pb-16 pt-5 shadow-lg xl:max-w-[360px]">
			{monthlySubmissionsErr ? (
				<Error keys={[['monthlySubmissions']]}>{monthlySubmissionsErr}</Error>
			) : (
				<>
					<h2 className="text-base-content pb-3 text-center font-semibold capitalize">{t('monthly-submissions')}</h2>
					{monthlySubmissionsLoading && !monthlySubmissions ? (
						<LoaderCircle className="text-base-content/15 mx-auto mt-16 size-32 animate-spin" />
					) : (
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
					)}
				</>
			)}
		</div>
	);
};

export default MonthlySubmissionsCard;
