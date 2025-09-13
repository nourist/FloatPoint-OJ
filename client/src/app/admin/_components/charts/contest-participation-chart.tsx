'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import useSWR from 'swr';

import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { ChartContainer } from '~/components/ui/chart';
import { ScrollArea, ScrollBar } from '~/components/ui/scroll-area';
import { createClientService } from '~/lib/service-client';
import { statisticsServiceInstance } from '~/services/statistics';

const chartConfig = {
	contests: {
		label: 'Number of Contests',
		color: '#3B82F6',
	},
	participants: {
		label: 'Total Participants',
		color: '#10B981',
	},
};

const ContestParticipationChart = () => {
	const t = useTranslations('admin.chart');
	const [period, setPeriod] = useState<'3m' | '6m' | '1y'>('6m');
	const { getContestParticipation } = createClientService(statisticsServiceInstance);

	const { data, isLoading } = useSWR(['/statistics/contest-participation', period], () => getContestParticipation(period), {
		keepPreviousData: true,
	});

	if (isLoading || !data) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>{t('contest_participation_trends')}</CardTitle>
					<CardDescription>{t('loading')}</CardDescription>
				</CardHeader>
				<CardContent className="h-80">
					<div className="flex h-full items-center justify-center">
						<div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
					</div>
				</CardContent>
			</Card>
		);
	}

	// Format data for display
	const formattedData = data?.data.map((item) => ({
		...item,
		monthDisplay: new Date(item.month + '-01').toLocaleDateString('en-US', {
			month: 'short',
			year: 'numeric',
		}),
	}));

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<CardTitle>{t('contest_participation_trends')}</CardTitle>
						<CardDescription>{t('contest_participation_description')}</CardDescription>
					</div>
					<div className="flex gap-2">
						{['3m', '6m', '1y'].map((p) => (
							<Button key={p} variant={period === p ? 'default' : 'outline'} size="sm" onClick={() => setPeriod(p as '3m' | '6m' | '1y')}>
								{p}
							</Button>
						))}
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<div className="h-80">
					<ScrollArea className="h-full w-full overflow-y-hidden">
						<div className="h-full min-w-[600px]">
							<ChartContainer config={chartConfig} className="h-full w-full">
								<ResponsiveContainer width="100%" height="100%">
									<LineChart data={formattedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis dataKey="monthDisplay" fontSize={12} />
										<YAxis yAxisId="left" orientation="left" fontSize={12} />
										<YAxis yAxisId="right" orientation="right" fontSize={12} />
										<Tooltip
											content={({ active, payload, label }) => {
												if (!active || !payload?.length) return null;

												return (
													<div className="bg-background border-border/50 rounded-lg border p-3 shadow-xl">
														<p className="mb-2 font-medium">{label}</p>
														<div className="space-y-1">
															{payload.map((item) => (
																<div key={item.dataKey} className="flex items-center justify-between gap-4">
																	<div className="flex items-center gap-2">
																		<div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
																		<span className="text-sm">{item.name === 'contests' ? t('contests') : t('participants')}</span>
																	</div>
																	<span className="font-mono font-medium">{item.value?.toLocaleString()}</span>
																</div>
															))}
														</div>
													</div>
												);
											}}
										/>
										<Line
											yAxisId="left"
											type="monotone"
											dataKey="contests"
											stroke={chartConfig.contests.color}
											strokeWidth={3}
											dot={{ fill: chartConfig.contests.color, strokeWidth: 2, r: 5 }}
											activeDot={{ r: 7, stroke: chartConfig.contests.color, strokeWidth: 2 }}
										/>
										<Line
											yAxisId="right"
											type="monotone"
											dataKey="participants"
											stroke={chartConfig.participants.color}
											strokeWidth={3}
											dot={{ fill: chartConfig.participants.color, strokeWidth: 2, r: 5 }}
											activeDot={{ r: 7, stroke: chartConfig.participants.color, strokeWidth: 2 }}
										/>
									</LineChart>
								</ResponsiveContainer>
							</ChartContainer>
						</div>
						<ScrollBar orientation="horizontal" />
					</ScrollArea>
				</div>

				{/* Legend */}
				<div className="mt-4 flex items-center justify-center gap-6">
					<div className="flex items-center gap-2">
						<div className="h-3 w-3 rounded-full bg-blue-500" />
						<span className="text-sm font-medium">{t('number_of_contests')}</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="h-3 w-3 rounded-full bg-green-500" />
						<span className="text-sm font-medium">{t('total_participants')}</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default ContestParticipationChart;
