import { XAxis, YAxis, Tooltip, ResponsiveContainer, Line, LineChart, CartesianGrid } from 'recharts';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';

import PercentChange from '~/components/PercentChange';
import { getWeeklySubmissions } from '~/services/stat';
import Error from './Error';

const WeeklySubmissionsCard = () => {
	const { t } = useTranslation('dashboard');

	const weekdayShortNames = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

	const {
		data: weeklySubmissions,
		isLoading: weeklySubmissionsLoading,
		error: weeklySubmissionsErr,
	} = useQuery({
		queryKey: ['weeklySubmissions'],
		queryFn: () =>
			getWeeklySubmissions().then((res) => {
				const countMap = new Map(res.map((item) => [item.dayOfWeek, item.count]));
				return weekdayShortNames.map((_, day) => ({
					name: t(weekdayShortNames[day]),
					value: countMap.get(day) || 0,
				}));
			}),
	});

	const {
		data: lastWeekSubmissions,
		isLoading: lastWeekSubmissionsLoading,
		error: lastWeekSubmissionsErr,
	} = useQuery({
		queryKey: ['lastWeekSubmissions'],
		queryFn: () => {
			const lastWeek = new Date();
			lastWeek.setDate(new Date().getDate() - 7);
			return getWeeklySubmissions(lastWeek).then((res) => {
				const countMap = new Map(res.map((item) => [item.dayOfWeek, item.count]));
				return weekdayShortNames.map((_, day) => ({
					name: t(weekdayShortNames[day]),
					value: countMap.get(day) || 0,
				}));
			});
		},
		refetchInterval: 180000,
		retry: 3,
	});

	const getWeeklySubmissionChartData = () => {
		if (!weeklySubmissions || !lastWeekSubmissions) return;
		return weeklySubmissions.map((item, index) => ({
			name: item.name,
			thisWeek: item.value,
			lastWeek: lastWeekSubmissions[index].value,
		}));
	};

	return (
		<div className="bg-base-100 shadow-shadow-color/5 min-h-[350px] flex-1 rounded-xl p-4 !pl-0 shadow-lg">
			{weeklySubmissionsErr || lastWeekSubmissionsErr ? (
				<Error keys={[['weeklySubmissions'], ['lastWeekSubmissions']]}>{weeklySubmissionsErr || lastWeekSubmissionsErr}</Error>
			) : (
				<>
					<h3 className="text-base-content mb-4 pl-6 text-[15px] font-semibold capitalize">
						{t('weekly-submissions')}
						<PercentChange
							data-loading={weeklySubmissionsLoading || lastWeekSubmissionsLoading}
							className="data-[loading=true]:skeleton ml-3 rounded-md data-[loading=true]:text-transparent"
							prev={lastWeekSubmissions?.reduce((acc, cur) => acc + cur.value, 0)}
							next={weeklySubmissions?.reduce((acc, cur) => acc + cur.value, 0)}
						/>
					</h3>
					{weeklySubmissionsLoading || lastWeekSubmissionsLoading ? (
						<div className="skeleton ml-4 h-[280px] rounded-lg"></div>
					) : (
						<ResponsiveContainer width="100%" height={280} style={{ marginLeft: '-10px' }}>
							<LineChart data={getWeeklySubmissionChartData()}>
								<XAxis dataKey="name" style={{ fontSize: '14px', textTransform: 'capitalize' }} />
								<YAxis style={{ fontSize: '13px' }} />
								<CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
								<Tooltip
									contentStyle={{
										backdropFilter: 'blur(5px)',
										backgroundColor: 'color-mix(in srgb, var(--color-base-content) 5%, transparent)',
										textTransform: 'capitalize',
										borderRadius: '6px',
										border: 'none',
									}}
									labelStyle={{
										color: 'var(--color-base-content)',
										fontSize: '14px',
										textTransform: 'capitalize',
									}}
									itemStyle={{
										fontSize: '12px',
									}}
									formatter={(value, name) => [value, t(name)]}
								/>
								<Line type="monotone" dataKey="thisWeek" stroke="var(--color-primary)" strokeWidth={3} dot={false} />
								<Line type="monotone" dataKey="lastWeek" stroke="var(--color-secondary)" strokeWidth={3} dot={false} />
							</LineChart>
						</ResponsiveContainer>
					)}
				</>
			)}
		</div>
	);
};

export default WeeklySubmissionsCard;
