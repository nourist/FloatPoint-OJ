import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, Link } from 'react-router';
import { LoaderCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Chart from 'react-apexcharts';

import ProblemSetting from '~/components/ProblemSetting';
import { getProblem, editProblem } from '~/services/problem';
import { getProblemStat } from '~/services/stat';
import Error from '~/components/Error';
import statusColors from '~/config/statusColor';
import useThemeStore from '~/stores/themeStore';
import { capitalize } from '~/utils/string';

const ProblemId = () => {
	const { t } = useTranslation('problem');
	const { id } = useParams();
	const queryClient = useQueryClient();
	const { theme } = useThemeStore();

	const {
		data,
		isLoading: loading,
		error,
	} = useQuery({
		queryKey: ['problem', id],
		queryFn: () => getProblem(id),
	});

	const {
		data: stat,
		isLoading: statLoading,
		error: statErr,
	} = useQuery({
		queryKey: ['problemstat', id],
		queryFn: () => getProblemStat(id),
	});

	if (loading || statLoading) {
		return (
			<div className="flex-center h-[calc(100vh-100px)]">
				<LoaderCircle className="text-base-content/15 mx-auto size-32 animate-spin" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="h-[calc(100vh-100px)]">
				<Error keys={[['problem', id]]}>{error}</Error>
			</div>
		);
	}

	if (statErr) {
		return (
			<div className="h-[calc(100vh-100px)]">
				<Error keys={[['problemstat', id]]}>{statErr}</Error>
			</div>
		);
	}

	return (
		<>
			<h2 className="text-base-content mb-1 text-xl font-semibold capitalize">{t('stat')}</h2>
			<div className="mb-6 flex flex-wrap gap-6">
				<div className="bg-base-100 flex-center shadow-shadow-color/3 shadow-clg min-w-80 flex-1 flex-col gap-2 rounded-xl px-2 py-4">
					<h2 className="text-base-content text-center text-lg font-semibold capitalize">{t('status')}</h2>
					<Chart
						width={'100%'}
						type="pie"
						series={stat?.status?.map((item) => item.count)}
						options={{
							labels: stat?.status?.map((item) => item._id),
							colors: stat?.status?.map((item) => statusColors[item._id.toLowerCase()]),
							legend: {
								labels: {
									colors: Array(stat?.status?.length).fill('var(--color-base-content)'),
								},
							},
						}}
					/>
				</div>
				<div className="bg-base-100 flex-center shadow-shadow-color/3 shadow-clg min-w-80 flex-1 flex-col gap-2 rounded-xl px-2 py-4 pb-0">
					<h2 className="text-base-content mb-auto text-center text-lg font-semibold capitalize">{t('language')}</h2>
					<Chart
						width="100%"
						type="bar"
						series={[{ name: capitalize(t('language')), data: stat?.language?.map((item) => item.count) }]}
						options={{
							xaxis: {
								categories: stat?.language?.map((item) => capitalize(item._id)),
								labels: {
									style: {
										colors: 'var(--color-base-content)',
									},
								},
							},
							yaxis: {
								labels: {
									style: {
										colors: 'var(--color-base-content)',
									},
								},
							},
							tooltip: {
								theme,
							},
							chart: {
								toolbar: {
									show: false,
								},
							},
						}}
					/>
				</div>
			</div>
			<h2 className="text-base-content mb-4 text-xl font-semibold capitalize">
				{t('submission')}{' '}
				<Link className="text-secondary text-base hover:underline" to={`/submission?problem=${id}`}>
					{t('view')}
				</Link>
			</h2>
			<h2 className="text-base-content mb-1 text-xl font-semibold capitalize">{t('setting')}</h2>
			<ProblemSetting
				defaultData={data}
				handler={(data) => editProblem(id, data)}
				finallyHandler={() => {
					queryClient.invalidateQueries({ queryKey: ['problem', id] });
				}}
			/>
		</>
	);
};

export default ProblemId;
