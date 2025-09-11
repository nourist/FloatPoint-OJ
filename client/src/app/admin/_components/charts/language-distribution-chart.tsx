'use client';

import { useTranslations } from 'next-intl';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { ChartContainer } from '~/components/ui/chart';
import { getLanguageColor } from '~/lib/language-utils';
import { ProgramLanguage } from '~/types/submission.type';

interface LanguageData {
	language: string;
	count: number;
	percentage: number;
}

interface LanguageDistributionChartProps {
	data: LanguageData[];
	isLoading?: boolean;
}

const chartConfig = {
	language: {
		label: 'Language',
	},
};

const LanguageDistributionChart = ({ data, isLoading }: LanguageDistributionChartProps) => {
	const t = useTranslations('admin.chart');
	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>{t('language_usage')}</CardTitle>
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
	const dataWithColors = data.map((item) => ({
		...item,
		fill: getLanguageColor(item.language as ProgramLanguage),
	}));

	return (
		<Card>
			<CardHeader>
				<CardTitle>{t('language_usage')}</CardTitle>
				<CardDescription>{t('language_usage_description')}</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig} className="h-80">
					<ResponsiveContainer width="100%" height="100%">
						<PieChart>
							<Pie data={dataWithColors} cx="50%" cy="50%" innerRadius={60} outerRadius={120} paddingAngle={2} dataKey="count">
								{dataWithColors.map((entry, index) => (
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
													<span className="font-medium">{data.language}</span>
												</div>
												<div className="space-y-1 text-sm">
													<div className="flex justify-between">
														<span className="text-muted-foreground">{t('submissions')}:</span>
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
							{/* Center text */}
							<text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-current text-xl font-bold">
								{totalSubmissions.toLocaleString()}
							</text>
							<text x="50%" y="50%" dy={20} textAnchor="middle" dominantBaseline="middle" className="fill-muted-foreground text-xs">
								{t('total_submissions')}
							</text>
						</PieChart>
					</ResponsiveContainer>
				</ChartContainer>

				{/* Legend */}
				<div className="mt-4 grid grid-cols-2 gap-4">
					{dataWithColors.map((item, index) => (
						<div key={item.language} className="flex items-center gap-2">
							<div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.fill }} />
							<div className="flex-1">
								<div className="flex items-center justify-between">
									<span className="text-sm font-medium">{item.language}</span>
									<span className="text-muted-foreground text-xs">{item.percentage}%</span>
								</div>
								<div className="text-muted-foreground text-xs">{item.count.toLocaleString()} submissions</div>
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
};

export default LanguageDistributionChart;
