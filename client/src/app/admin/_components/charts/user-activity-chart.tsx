'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import useSWR from 'swr';

import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '~/components/ui/chart';
import { ScrollArea, ScrollBar } from '~/components/ui/scroll-area';
import { createClientService } from '~/lib/service-client';
import { statisticsServiceInstance } from '~/services/statistics';

const chartConfig = {
	new_registrations: {
		label: 'New Registrations',
		color: '#10B981',
	},
};

const UserActivityChart = () => {
	const t = useTranslations('admin.chart');
	const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d');
	const { getUserActivity } = createClientService(statisticsServiceInstance);

	const { data, isLoading } = useSWR(['/statistics/user-activity', period], () => getUserActivity(period), { keepPreviousData: true });

	if (isLoading || !data) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>{t('user_registrations')}</CardTitle>
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

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<CardTitle>{t('user_registrations')}</CardTitle>
						<CardDescription>{t('user_registrations_description')}</CardDescription>
					</div>
					<div className="flex gap-2">
						{['7d', '30d', '90d'].map((p) => (
							<Button key={p} variant={period === p ? 'default' : 'outline'} size="sm" onClick={() => setPeriod(p as '7d' | '30d' | '90d')}>
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
									<LineChart data={data?.data}>
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
										<YAxis />
										<Tooltip
											content={({ active, payload, label }) => {
												if (!active || !payload?.length) return null;
												return (
													<ChartTooltipContent
														active={active}
														payload={payload}
														label={new Date(label).toLocaleDateString('en-US', {
															weekday: 'long',
															year: 'numeric',
															month: 'long',
															day: 'numeric',
														})}
													/>
												);
											}}
										/>
										<Line
											type="monotone"
											dataKey="new_registrations"
											stroke={chartConfig.new_registrations.color}
											strokeWidth={2}
											dot={{ fill: chartConfig.new_registrations.color, strokeWidth: 2, r: 4 }}
											activeDot={{ r: 6, stroke: chartConfig.new_registrations.color, strokeWidth: 2 }}
										/>
									</LineChart>
								</ResponsiveContainer>
							</ChartContainer>
						</div>
						<ScrollBar orientation="horizontal" />
					</ScrollArea>
				</div>
			</CardContent>
		</Card>
	);
};

export default UserActivityChart;
