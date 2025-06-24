import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Line, LineChart, CartesianGrid } from 'recharts';
import { getWeeklyAccepted } from '~/services/stat';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';

import PercentChange from './PercentChange';
import Error from './Error';

const WeeklyAcceptedCard = () => {
	const { t } = useTranslation('dashboard');

	const weekdayShortNames = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

	const {
		data: weeklyAccepted,
		isLoading: weeklyAcceptedLoading,
		error: weeklyAcceptedErr,
	} = useQuery({
		queryKey: ['weeklyAccepted'],
		queryFn: () =>
			getWeeklyAccepted().then((res) => {
				const countMap = new Map(res.map((item) => [item.dayOfWeek, item.count]));
				return weekdayShortNames.map((_, day) => ({
					name: t(weekdayShortNames[day]),
					value: countMap.get(day) || 0,
				}));
			}),
	});

	const {
		data: lastWeekAccepted,
		isLoading: lastWeekAcceptedLoading,
		error: lastWeekAcceptedErr,
	} = useQuery({
		queryKey: ['lastWeekAccepted'],
		queryFn: () => {
			const lastWeek = new Date();
			lastWeek.setDate(new Date().getDate() - 7);
			return getWeeklyAccepted(lastWeek).then((res) => res.reduce((acc, cur) => acc + cur.count, 0));
		},
		refetchInterval: 180000,
		retry: 3,
	});

	return (
		<div className="bg-base-100 shadow-shadow-color/5 min-h-[350px] w-full gap-6 rounded-xl p-4 shadow-lg xl:w-2/5">
			{weeklyAcceptedErr || lastWeekAcceptedErr ? (
				<Error keys={[['weeklyAccepted'], ['lastWeekAccepted']]}>{weeklyAcceptedErr || lastWeekAcceptedErr}</Error>
			) : (
				<>
					{weeklyAcceptedLoading || lastWeekAcceptedLoading ? (
						<div className="skeleton h-[244px] rounded-md"></div>
					) : (
						<div className="from-primary to-secondary rounded-md bg-gradient-to-r pr-4 pt-6">
							<ResponsiveContainer width="100%" height={220} style={{ marginLeft: '-5px' }}>
								<BarChart data={weeklyAccepted}>
									<XAxis style={{ textTransform: 'capitalize', fontSize: '14px' }} dataKey="name" stroke="#fff" />
									<YAxis style={{ fontSize: '13px' }} stroke="#fff" tickFormatter={(val) => val.toLocaleString()} />
									<Tooltip
										contentStyle={{
											backgroundColor: 'var(--color-base-200)',
											borderRadius: '6px',
											border: 'none',
										}}
										formatter={(value) => [value, 'Accepted']}
										labelStyle={{
											color: 'var(--color-base-content)',
											fontSize: '14px',
											textTransform: 'capitalize',
										}}
										itemStyle={{
											fontSize: '12px',
											color: 'transparent',
											background: 'linear-gradient(90deg, var(--color-secondary), var(--color-primary))',
											backgroundClip: 'text',
										}}
										cursor={false}
									/>
									<Bar dataKey="value" fill="#fff" radius={[6, 6, 6, 6]} barSize={22} />
								</BarChart>
							</ResponsiveContainer>
						</div>
					)}
					<h3 className="text-base-content mt-6 text-[15px] font-semibold capitalize">{t('weekly-accepted')}</h3>
					<p className="text-base-content/50 mt-1 text-sm font-semibold">
						{t('than-last-week')}
						<PercentChange
							data-loading={weeklyAcceptedLoading || lastWeekAcceptedLoading}
							className="data-[loading=true]:skeleton ml-2 rounded-md data-[loading=true]:text-transparent"
							prev={lastWeekAccepted}
							next={weeklyAccepted?.reduce((acc, cur) => acc + cur.value, 0)}
						/>
					</p>
				</>
			)}
		</div>
	);
};

export default WeeklyAcceptedCard;
