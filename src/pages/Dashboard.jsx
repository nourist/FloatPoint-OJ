import { UserPlus, Braces, Send, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Line, LineChart, CartesianGrid } from 'recharts';
import Chart from 'react-apexcharts';

import { getStat, getWeeklySubmissions, getWeeklyAccepted, getMonthlySubmissions } from '~/services/stat';
import Error from '~/components/Error';
import PercentChange from '~/components/PercentChange';
import statusColors from '~/config/statusColor';

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
		refetchInterval: 180000,
		retry: 3,
	});

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
		refetchInterval: 180000,
		retry: 3,
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
		refetchInterval: 180000,
		retry: 3,
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

	if (statErr || prevStatErr || weeklyAcceptedErr || lastWeekAcceptedErr || weeklySubmissionsErr || lastWeekSubmissionsErr || monthlySubmissionsErr)
		return <Error>{statErr || prevStatErr || weeklyAcceptedErr || lastWeekAcceptedErr || weeklySubmissionsErr || lastWeekSubmissionsErr || monthlySubmissionsErr}</Error>;

	const getWeeklySubmissionChartData = () => {
		if (!weeklySubmissions || !lastWeekSubmissions) return;
		return weeklySubmissions.map((item, index) => ({
			name: item.name,
			thisWeek: item.value,
			lastWeek: lastWeekSubmissions[index].value,
		}));
	};

	return (
		<div className="min-h-[100vh] space-y-6">
			<div className="grid grid-cols-4 grid-rows-4 gap-6">
				{[
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
									<PercentChange prev={item.prev} next={item.next} className="ml-2"></PercentChange>
								</p>
							)}
						</div>
						<div className="bg-primary flex-center size-12 rounded-lg text-white shadow-md">
							<item.icon />
						</div>
					</div>
				))}
			</div>
			<div className="flex flex-row flex-wrap gap-6">
				<div className="bg-base-100 shadow-shadow-color/5 w-full gap-6 rounded-xl p-4 shadow-lg xl:w-2/5">
					{weeklyAcceptedLoading || lastWeekAcceptedLoading ? (
						<div className="skeleton h-[244px] rounded-md"></div>
					) : (
						<div className="from-primary to-secondary rounded-md bg-gradient-to-r pt-6 pr-4">
							<ResponsiveContainer width="100%" height={220} style={{ marginLeft: '-5px' }}>
								<BarChart data={weeklyAccepted}>
									<XAxis style={{ textTransform: 'capitalize', fontSize: '14px' }} dataKey="name" stroke="#fff" />
									<YAxis style={{ fontSize: '13px' }} stroke="#fff" tickFormatter={(val) => val.toLocaleString()} />
									<Tooltip
										contentStyle={{
											backdropFilter: 'blur(10px)',
											backgroundColor: 'color-mix(in srgb, var(--color-base-content) 5%, transparent)',
											borderRadius: '6px',
											border: 'none',
										}}
										formatter={(value) => [value, 'Accepted']}
										labelStyle={{
											color: 'var(--color-neutral)',
											fontSize: '14px',
											textTransform: 'capitalize',
										}}
										itemStyle={{
											fontSize: '12px',
											color: 'var(--color-neutral)',
											opacity: '70%',
										}}
										cursor={false}
									/>
									<Bar dataKey="value" fill="#fff" radius={[8, 8, 8, 8]} barSize={24} />
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
				</div>
				<div className="bg-base-100 shadow-shadow-color/5 flex-1 rounded-xl p-4 !pl-0 shadow-lg">
					<h3 className="text-base-content mb-4 pl-6 text-[15px] font-semibold capitalize">
						{t('weekly-submissions')}
						<PercentChange
							data-loading={weeklyAcceptedLoading || lastWeekAcceptedLoading}
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
				</div>
			</div>
			<div className="flex">
				<div className="bg-base-100 shadow-shadow-color/5 h-[445px] w-full rounded-xl p-8 pt-5 shadow-lg md:w-[360px]">
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
				</div>
				<div className="flex-1"></div>
			</div>
		</div>
	);
};

export default Dashboard;
