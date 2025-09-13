'use client';

import { useTranslations } from 'next-intl';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { ChartContainer } from '~/components/ui/chart';
import { getSubmissionStatusVarColor } from '~/lib/status-utils';
import { SubmissionStatus } from '~/types/submission.type';

interface SubmissionResultData {
	status: string;
	count: number;
}

interface SubmissionResultsChartProps {
	data: SubmissionResultData[];
	isLoading?: boolean;
}

const chartConfig = {
	status: {
		label: 'Status',
	},
};

const SubmissionResultsChart = ({ data, isLoading }: SubmissionResultsChartProps) => {
	const t = useTranslations('admin.chart');
	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>{t('submission_results_distribution')}</CardTitle>
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

	const totalSubmissions = data.reduce((sum, item) => sum + item.count, 0);
	const dataWithFill = data.map((item) => ({
		...item,
		fill: getSubmissionStatusVarColor(item.status as SubmissionStatus),
		percentage: totalSubmissions > 0 ? ((item.count / totalSubmissions) * 100).toFixed(1) : 0,
	}));

	return (
		<Card>
			<CardHeader>
				<CardTitle>{t('submission_results_distribution')}</CardTitle>
				<CardDescription>{t('submission_results_description')}</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig} className="h-80">
					<ResponsiveContainer width="100%" height="100%">
						<PieChart>
							<Pie data={dataWithFill} cx="50%" cy="50%" outerRadius={120} paddingAngle={1} dataKey="count">
								{dataWithFill.map((entry, index) => (
									<Cell key={`cell-${index}`} fill={entry.fill} />
								))}
							</Pie>
							<Tooltip
								content={({ active, payload }) => {
									if (!active || !payload?.length) return null;
									const data = payload[0].payload;
									return (
										<div className="bg-background border-border/50 rounded-lg border p-3 shadow-xl">
											<div className="space-y-2">
												<div className="flex items-center gap-2">
													<div className="h-3 w-3 rounded-full" style={{ backgroundColor: data.fill }} />
													<span className="font-medium">{data.status}</span>
												</div>
												<div className="space-y-1 text-sm">
													<div className="flex justify-between">
														<span className="text-muted-foreground">{t('count')}:</span>
														<span className="font-mono">{data.count.toLocaleString()}</span>
													</div>
													<div className="flex justify-between">
														<span className="text-muted-foreground">{t('percentage')}:</span>
														<span className="font-mono">{data.percentage}%</span>
													</div>
												</div>
											</div>
										</div>
									);
								}}
							/>
						</PieChart>
					</ResponsiveContainer>
				</ChartContainer>

				{/* Legend */}
				<div className="mt-4 space-y-2">
					{dataWithFill.map((item) => (
						<div key={item.status} className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.fill }} />
								<span className="text-sm font-medium">{item.status}</span>
							</div>
							<div className="flex items-center gap-4">
								<span className="text-muted-foreground text-sm">{item.count.toLocaleString()}</span>
								<span className="text-muted-foreground min-w-[40px] text-right text-xs">{item.percentage}%</span>
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
};

export default SubmissionResultsChart;
