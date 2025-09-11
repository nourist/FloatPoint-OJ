'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { ChartContainer } from '~/components/ui/chart';

interface SystemResourceData {
	time: string;
	cpu: number;
	memory: number;
	disk: number;
}

interface SystemResourceChartProps {
	data: SystemResourceData[];
	isLoading?: boolean;
}

const chartConfig = {
	cpu: {
		label: 'CPU Usage (%)',
		color: '#3B82F6',
	},
	memory: {
		label: 'Memory Usage (%)',
		color: '#10B981',
	},
	disk: {
		label: 'Disk Usage (%)',
		color: '#F59E0B',
	},
};

const SystemResourceChart = ({ data, isLoading }: SystemResourceChartProps) => {
	const t = useTranslations('admin.chart');
	const [period, setPeriod] = useState('1h');

	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>{t('system_resource_usage')}</CardTitle>
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

	// Sample data for the last hour (every 5 minutes)
	const displayData = data.slice(-12); // Last 12 data points

	// Format data for display
	const formattedData = displayData.map((item) => ({
		...item,
		timeDisplay: new Date(item.time).toLocaleTimeString('en-US', {
			hour: '2-digit',
			minute: '2-digit',
		}),
	}));

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<CardTitle>{t('system_resource_usage')}</CardTitle>
						<CardDescription>{t('system_resource_description')}</CardDescription>
					</div>
					<div className="flex gap-2">
						{['1h', '24h'].map((p) => (
							<Button key={p} variant={period === p ? 'default' : 'outline'} size="sm" onClick={() => setPeriod(p)}>
								{p}
							</Button>
						))}
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig} className="h-80">
					<ResponsiveContainer width="100%" height="100%">
						<LineChart data={formattedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="timeDisplay" fontSize={12} />
							<YAxis fontSize={12} domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
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
															<span className="text-sm capitalize">
																{item.dataKey === 'cpu' ? t('cpu') : item.dataKey === 'memory' ? t('memory') : t('disk')} {t('usage')}
															</span>
														</div>
														<span className="font-mono font-medium">{Number(item.value || 0).toFixed(1)}%</span>
													</div>
												))}
											</div>

											{/* Warning for high usage */}
											{payload.some((p) => Number(p.value || 0) > 85) && (
												<div className="flex items-center gap-2 pt-2 text-xs text-red-600">
													<div className="h-2 w-2 rounded-full bg-red-500" />
													<span>{t('high_resource_usage')}</span>
												</div>
											)}
										</div>
									);
								}}
							/>
							<Line
								type="monotone"
								dataKey="cpu"
								stroke={chartConfig.cpu.color}
								strokeWidth={2}
								dot={{ fill: chartConfig.cpu.color, strokeWidth: 2, r: 3 }}
								activeDot={{ r: 5, stroke: chartConfig.cpu.color, strokeWidth: 2 }}
							/>
							<Line
								type="monotone"
								dataKey="memory"
								stroke={chartConfig.memory.color}
								strokeWidth={2}
								dot={{ fill: chartConfig.memory.color, strokeWidth: 2, r: 3 }}
								activeDot={{ r: 5, stroke: chartConfig.memory.color, strokeWidth: 2 }}
							/>
							<Line
								type="monotone"
								dataKey="disk"
								stroke={chartConfig.disk.color}
								strokeWidth={2}
								dot={{ fill: chartConfig.disk.color, strokeWidth: 2, r: 3 }}
								activeDot={{ r: 5, stroke: chartConfig.disk.color, strokeWidth: 2 }}
							/>
						</LineChart>
					</ResponsiveContainer>
				</ChartContainer>

				{/* Legend */}
				<div className="mt-4 flex items-center justify-center gap-6">
					<div className="flex items-center gap-2">
						<div className="h-3 w-3 rounded-full bg-blue-500" />
						<span className="text-sm font-medium">
							{t('cpu')} {t('usage')}
						</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="h-3 w-3 rounded-full bg-green-500" />
						<span className="text-sm font-medium">
							{t('memory')} {t('usage')}
						</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="h-3 w-3 rounded-full bg-yellow-500" />
						<span className="text-sm font-medium">
							{t('disk')} {t('usage')}
						</span>
					</div>
				</div>

				{/* Current Values */}
				<div className="mt-4 grid grid-cols-3 gap-4">
					{formattedData.length > 0 && (
						<>
							<div className="text-center">
								<div className="text-muted-foreground text-xs">{t('cpu')}</div>
								<div className="font-mono text-lg font-semibold">{formattedData[formattedData.length - 1]?.cpu.toFixed(1)}%</div>
							</div>
							<div className="text-center">
								<div className="text-muted-foreground text-xs">{t('memory')}</div>
								<div className="font-mono text-lg font-semibold">{formattedData[formattedData.length - 1]?.memory.toFixed(1)}%</div>
							</div>
							<div className="text-center">
								<div className="text-muted-foreground text-xs">{t('disk')}</div>
								<div className="font-mono text-lg font-semibold">{formattedData[formattedData.length - 1]?.disk.toFixed(1)}%</div>
							</div>
						</>
					)}
				</div>
			</CardContent>
		</Card>
	);
};

export default SystemResourceChart;
