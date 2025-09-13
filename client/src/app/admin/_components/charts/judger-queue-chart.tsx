'use client';

import { useTranslations } from 'next-intl';
import { CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { ChartContainer } from '~/components/ui/chart';

interface JudgerQueueData {
	time: string;
	queue_size: number;
	processing_time: number;
}

interface JudgerQueueChartProps {
	data: JudgerQueueData[];
	isLoading?: boolean;
}

const chartConfig = {
	queue_size: {
		label: 'Queue Size',
		color: '#3B82F6',
	},
	processing_time: {
		label: 'Processing Time (s)',
		color: '#10B981',
	},
};

const JudgerQueueChart = ({ data, isLoading }: JudgerQueueChartProps) => {
	const t = useTranslations('admin.chart');
	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>{t('judger_queue_performance')}</CardTitle>
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
	const formattedData = data.map((item) => ({
		...item,
		timeDisplay: new Date(item.time).toLocaleTimeString('en-US', {
			hour: '2-digit',
			minute: '2-digit',
		}),
	}));

	const maxQueueSize = Math.max(...data.map((d) => d.queue_size));
	const threshold = 30; // Queue size threshold

	return (
		<Card>
			<CardHeader>
				<CardTitle>{t('judger_queue_performance')}</CardTitle>
				<CardDescription>{t('judger_queue_description')}</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig} className="h-80">
					<ResponsiveContainer width="100%" height="100%">
						<LineChart data={formattedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="timeDisplay" fontSize={12} />
							<YAxis yAxisId="left" orientation="left" fontSize={12} domain={[0, Math.max(maxQueueSize, threshold) + 10]} />
							<YAxis yAxisId="right" orientation="right" fontSize={12} />

							{/* Threshold line for queue size */}
							<ReferenceLine yAxisId="left" y={threshold} stroke="#EF4444" strokeDasharray="5 5" strokeWidth={2} />

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
															<span className="text-sm">{item.dataKey === 'queue_size' ? t('queue_size') : t('processing_time')}</span>
														</div>
														<span className="font-mono font-medium">
															{item.dataKey === 'processing_time' ? `${Number(item.value || 0).toFixed(1)}s` : item.value?.toString()}
														</span>
													</div>
												))}
												{payload.some((p) => p.dataKey === 'queue_size') &&
													(payload.find((p) => p.dataKey === 'queue_size')?.value as number) > threshold && (
														<div className="flex items-center gap-2 pt-1 text-xs text-red-600">
															<div className="h-2 w-2 rounded-full bg-red-500" />
															<span>{t('queue_size_threshold_warning')}</span>
														</div>
													)}
											</div>
										</div>
									);
								}}
							/>
							<Line
								yAxisId="left"
								type="monotone"
								dataKey="queue_size"
								stroke={chartConfig.queue_size.color}
								strokeWidth={2}
								dot={{ fill: chartConfig.queue_size.color, strokeWidth: 2, r: 3 }}
								activeDot={{ r: 5, stroke: chartConfig.queue_size.color, strokeWidth: 2 }}
							/>
							<Line
								yAxisId="right"
								type="monotone"
								dataKey="processing_time"
								stroke={chartConfig.processing_time.color}
								strokeWidth={2}
								dot={{ fill: chartConfig.processing_time.color, strokeWidth: 2, r: 3 }}
								activeDot={{ r: 5, stroke: chartConfig.processing_time.color, strokeWidth: 2 }}
							/>
						</LineChart>
					</ResponsiveContainer>
				</ChartContainer>

				{/* Legend */}
				<div className="mt-4 flex items-center justify-center gap-6">
					<div className="flex items-center gap-2">
						<div className="h-3 w-3 rounded-full bg-blue-500" />
						<span className="text-sm font-medium">{t('queue_size_left')}</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="h-3 w-3 rounded-full bg-green-500" />
						<span className="text-sm font-medium">{t('processing_time_right')}</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="h-3 w-3 border-2 border-dashed border-red-500" />
						<span className="text-muted-foreground text-xs">
							{t('threshold')} ({threshold})
						</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default JudgerQueueChart;
