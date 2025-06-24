import { useQuery } from '@tanstack/react-query';
import Chart from 'react-apexcharts';
import { useTranslation } from 'react-i18next';
import { LoaderCircle } from 'lucide-react';

import { getMonthlyLanguages } from '~/services/stat';
import Error from './Error';

const MonthlyLanguagesCard = () => {
	const { t } = useTranslation('dashboard');

	const {
		data: monthlyLanguages,
		isLoading: monthlyLanguagesLoading,
		error: monthlyLanguagesErr,
	} = useQuery({
		queryKey: ['monthlyLanguages'],
		queryFn: getMonthlyLanguages,
	});

	return (
		<div className="bg-base-100 shadow-shadow-color/5 h-[445px] w-full rounded-xl px-8 pb-16 pt-5 shadow-lg md:flex-1 xl:max-w-80">
			{monthlyLanguagesErr ? (
				<Error keys={[['monthlyLanguages']]}>{monthlyLanguagesErr}</Error>
			) : (
				<>
					<h2 className="text-base-content pb-3 text-center font-semibold capitalize">{t('monthly-languages')}</h2>
					{monthlyLanguagesLoading && !monthlyLanguages ? (
						<>
							<LoaderCircle className="text-base-content/15 mx-auto mt-16 size-32 animate-spin" />
						</>
					) : (
						<Chart
							type="polarArea"
							width="100%"
							height="100%"
							series={monthlyLanguages?.map((item) => item.count)}
							options={{
								labels: monthlyLanguages?.map((item) => item._id.toUpperCase()),
								legend: {
									position: 'bottom',
									labels: {
										colors: Array(monthlyLanguages?.length).fill('var(--color-base-content)'),
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

export default MonthlyLanguagesCard;
