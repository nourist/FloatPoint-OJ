'use client';

import { useTranslations } from 'next-intl';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { ChartContainer } from '~/components/ui/chart';

interface ProblemDifficultyData {
	difficulty: string;
	count: number;
	solved_users: number;
}

interface ProblemDifficultyChartProps {
	data: ProblemDifficultyData[];
	isLoading?: boolean;
}

const chartConfig = {
	count: {
		label: 'Total Problems',
		color: '#3B82F6',
	},
	solved_users: {
		label: 'Solved by Users',
		color: '#10B981',
	},
};

const ProblemDifficultyChart = ({ data, isLoading }: ProblemDifficultyChartProps) => {
	const t = useTranslations('admin.chart');
	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>{t('problem_difficulty_distribution')}</CardTitle>
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
				<CardTitle>{t('problem_difficulty_distribution')}</CardTitle>
				<CardDescription>{t('problem_difficulty_description')}</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig} className="h-80">
					<ResponsiveContainer width="100%" height="100%">
						<BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="difficulty" />
							<YAxis />
							<Tooltip
								content={({ active, payload, label }) => {
									if (!active || !payload?.length) return null;
									const totalProblems = payload.find((p) => p.dataKey === 'count')?.value || 0;
									const solvedUsers = payload.find((p) => p.dataKey === 'solved_users')?.value || 0;

									return (
										<div className="bg-background border-border/50 rounded-lg border p-3 shadow-xl">
											<p className="mb-2 font-medium">{label} Difficulty</p>
											<div className="space-y-1">
												<div className="flex items-center justify-between gap-4">
													<div className="flex items-center gap-2">
														<div className="h-2 w-2 rounded-full bg-blue-500" />
														<span className="text-sm">{t('total_problems')}</span>
													</div>
													<span className="font-mono font-medium">{totalProblems.toLocaleString()}</span>
												</div>
												<div className="flex items-center justify-between gap-4">
													<div className="flex items-center gap-2">
														<div className="h-2 w-2 rounded-full bg-green-500" />
														<span className="text-sm">{t('solved_by_users')}</span>
													</div>
													<span className="font-mono font-medium">{solvedUsers.toLocaleString()}</span>
												</div>
												{Number(totalProblems) > 0 && (
													<div className="text-muted-foreground flex items-center justify-between gap-4 pt-1 text-xs">
														<span>{t('solve_rate')}</span>
														<span>{(Number(solvedUsers || 0) / Number(totalProblems || 1)) * 100}%</span>
													</div>
												)}
											</div>
										</div>
									);
								}}
							/>
							<Bar dataKey="count" fill={chartConfig.count.color} radius={[4, 4, 0, 0]} />
							<Bar dataKey="solved_users" fill={chartConfig.solved_users.color} radius={[4, 4, 0, 0]} />
						</BarChart>
					</ResponsiveContainer>
				</ChartContainer>

				{/* Legend */}
				<div className="mt-4 flex items-center justify-center gap-6">
					<div className="flex items-center gap-2">
						<div className="h-3 w-3 rounded-full bg-blue-500" />
						<span className="text-sm font-medium">{t('total_problems')}</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="h-3 w-3 rounded-full bg-green-500" />
						<span className="text-sm font-medium">{t('solved_by_users')}</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default ProblemDifficultyChart;
