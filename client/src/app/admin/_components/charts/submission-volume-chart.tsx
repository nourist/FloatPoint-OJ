'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import useSWR from 'swr';

import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { ChartContainer } from '~/components/ui/chart';
import { createClientService } from '~/lib/service-client';
import { statisticsServiceInstance } from '~/services/statistics';

const chartConfig = {
	submissions: {
		label: 'Total Submissions',
		color: '#3B82F6',
	},
	accepted: {
		label: 'Accepted',
		color: '#10B981',
	},
};

const SubmissionVolumeChart = () => {
	const t = useTranslations('admin.chart');
	const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('7d');
	const { getSubmissionVolume } = createClientService(statisticsServiceInstance);

	const { data, isLoading } = useSWR(['/statistics/submission-volume', period], () => getSubmissionVolume(period), { keepPreviousData: true });

	if (isLoading || !data) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>{t('submission_volume')}</CardTitle>
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
						<CardTitle>{t('submission_volume')}</CardTitle>
						<CardDescription>{t('submission_volume_description')}</CardDescription>
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
				<div className="overflow-x-auto">
					<ChartContainer config={chartConfig} className="h-80 min-w-[600px]">
						<ResponsiveContainer width="100%" height="100%">
							<AreaChart data={data?.data}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
								<YAxis />
								<Tooltip
									content={({ active, payload, label }) => {
										if (!active || !payload?.length) return null;
										const total = Number(payload.find((p) => p.dataKey === 'submissions')?.value || 0);
										const accepted = Number(payload.find((p) => p.dataKey === 'accepted')?.value || 0);
										const rate = total > 0 ? ((accepted / total) * 100).toFixed(1) : '0';

										return (
											<div className="bg-background border-border/50 rounded-lg border p-3 shadow-xl">
												<p className="mb-2 font-medium">
													{new Date(label).toLocaleDateString('en-US', {
														weekday: 'long',
														month: 'long',
														day: 'numeric',
													})}
												</p>
												<div className="space-y-1">
													<div className="flex items-center justify-between gap-4">
														<div className="flex items-center gap-2">
															<div className="h-2 w-2 rounded-full bg-blue-500" />
															<span className="text-sm">{t('total_submissions')}</span>
														</div>
														<span className="font-mono font-medium">{total.toLocaleString()}</span>
													</div>
													<div className="flex items-center justify-between gap-4">
														<div className="flex items-center gap-2">
															<div className="h-2 w-2 rounded-full bg-green-500" />
															<span className="text-sm">{t('accepted')}</span>
														</div>
														<span className="font-mono font-medium">{accepted.toLocaleString()}</span>
													</div>
													<div className="text-muted-foreground flex items-center justify-between gap-4 pt-1 text-xs">
														<span>{t('success_rate')}</span>
														<span>{rate}%</span>
													</div>
												</div>
											</div>
										);
									}}
								/>
								<defs>
									<linearGradient id="submissionsGradient" x1="0" y1="0" x2="0" y2="1">
										<stop offset="5%" stopColor={chartConfig.submissions.color} stopOpacity={0.3} />
										<stop offset="95%" stopColor={chartConfig.submissions.color} stopOpacity={0.1} />
									</linearGradient>
								</defs>
								<Area
									type="monotone"
									dataKey="submissions"
									stroke={chartConfig.submissions.color}
									strokeWidth={2}
									fill="url(#submissionsGradient)"
									dot={{ fill: chartConfig.submissions.color, strokeWidth: 2, r: 4 }}
									activeDot={{ r: 6, stroke: chartConfig.submissions.color, strokeWidth: 2 }}
								/>
								<Area
									type="monotone"
									dataKey="accepted"
									stroke={chartConfig.accepted.color}
									strokeWidth={2}
									fill="transparent"
									dot={{ fill: chartConfig.accepted.color, strokeWidth: 2, r: 4 }}
									activeDot={{ r: 6, stroke: chartConfig.accepted.color, strokeWidth: 2 }}
								/>
							</AreaChart>
						</ResponsiveContainer>
					</ChartContainer>
				</div>
			</CardContent>
		</Card>
	);
};

export default SubmissionVolumeChart;
