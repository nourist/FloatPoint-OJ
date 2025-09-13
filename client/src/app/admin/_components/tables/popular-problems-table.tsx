'use client';

import {  TrendingUp } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { Badge } from '~/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { ScrollArea, ScrollBar } from '~/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';
import { getDifficultyColor } from '~/lib/difficulty-utils';
import { cn } from '~/lib/utils';
import { Difficulty } from '~/types/problem.type';

interface PopularProblemData {
	rank: number;
	slug: string;
	title: string;
	difficulty: string;
	attempts: number;
	solved: number;
	success_rate: string;
}

interface PopularProblemsTableProps {
	data: PopularProblemData[];
	isLoading?: boolean;
}

const PopularProblemsTable = ({ data, isLoading }: PopularProblemsTableProps) => {
	const t = useTranslations('admin.table');
	const tTable = useTranslations('problem.table');

	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>{t('most_attempted_problems')}</CardTitle>
					<CardDescription>{t('loading')}</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex items-center justify-center py-8">
						<div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<TrendingUp className="h-5 w-5" />
					{t('most_attempted_problems')}
				</CardTitle>
				<CardDescription>{t('most_attempted_problems_description')}</CardDescription>
			</CardHeader>
			<CardContent className="px-6">
				<ScrollArea className="w-full overflow-y-hidden">
					<div className="min-w-[600px]">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="w-12">#</TableHead>
									<TableHead>{tTable('title')}</TableHead>
									<TableHead className="w-20">{tTable('difficulty')}</TableHead>
									<TableHead className="text-center">{t('attempts')}</TableHead>
									<TableHead className="text-center">{t('solved')}</TableHead>
									<TableHead className="text-center">{t('success_rate')}</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{data.map((problem) => (
									<TableRow key={problem.slug} className="hover:bg-muted/50">
										<TableCell>
											<div className="font-mono text-sm font-medium">{problem.rank}</div>
										</TableCell>
										<TableCell>
											<Link href="/admin/problem" className="block hover:text-blue-600 hover:underline transition-all">
												<div className="line-clamp-1 font-medium" title={problem.title}>
													{problem.title}
												</div>
											</Link>
										</TableCell>
										<TableCell>
											<Badge variant="outline" className={cn('text-xs font-medium', getDifficultyColor(problem.difficulty as Difficulty))}>
												{problem.difficulty}
											</Badge>
										</TableCell>
										<TableCell className="text-center">
											<div className="font-mono text-sm">{problem.attempts.toLocaleString()}</div>
										</TableCell>
										<TableCell className="text-center">
											<div className="font-mono text-sm font-semibold">{problem.solved.toLocaleString()}</div>
										</TableCell>
										<TableCell className="text-center">
											<div className="font-mono text-sm">
												<span
													className={cn('font-medium', {
														'text-green-600': parseFloat(problem.success_rate) >= 50,
														'text-yellow-600': parseFloat(problem.success_rate) >= 30 && parseFloat(problem.success_rate) < 50,
														'text-red-600': parseFloat(problem.success_rate) < 30,
													})}
												>
													{problem.success_rate}%
												</span>
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
					<ScrollBar orientation="horizontal" />
				</ScrollArea>
			</CardContent>
		</Card>
	);
};

export default PopularProblemsTable;
