import { BookOpen, Clock, Database, FileInput, FileOutput, FileText, List, Play, Zap } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Separator } from '~/components/ui/separator';
import { getDifficultyColor } from '~/lib/difficulty-utils';
import { createServerService } from '~/lib/service-server';
import { createAuthService } from '~/services/auth';
import { IOMode, Problem } from '~/types/problem.type';
import { User } from '~/types/user.type';

interface ProblemSidebarProps {
	problem: Problem;
	user: User | null;
}

const ProblemSidebar = async ({ problem, user }: ProblemSidebarProps) => {
	const t = await getTranslations('problem.detail.sidebar');

	return (
		<div className="space-y-6">
			{/* Action Buttons */}
			<div className="bg-card flex flex-col gap-2 rounded-2xl border p-6 shadow-xs">
				<h1 className="mb-4 text-lg font-semibold">{t('actions.title')}</h1>
				<div className="2md:flex-col flex flex-wrap gap-2">
					{user && (
						<Button className="flex-1" asChild>
							<Link href={`/submit?problem=${problem.slug}`}>
								<Play className="mr-2 h-4 w-4" />
								{t('actions.submit')}
							</Link>
						</Button>
					)}
					{problem.editorial && (
						<Button variant="outline" className="flex-1" asChild>
							<Link href={`/problem/${problem.slug}/editorial`}>
								<BookOpen className="mr-2 h-4 w-4" />
								{t('actions.editorial')}
							</Link>
						</Button>
					)}
					<Button variant="outline" className="flex-1" asChild>
						<Link href={`/submission?problem=${problem.id}`}>
							<List className="mr-2 h-4 w-4" />
							{t('actions.view_submissions')}
						</Link>
					</Button>
				</div>
			</div>

			{/* Problem Info Card */}
			<div className="bg-card flex flex-col gap-4 rounded-2xl border p-6 shadow-xs">
				<h1 className="mb-2 text-lg font-semibold">{t('info')}</h1>
				<div className="2md:flex-col max-2md:gap-10 flex gap-3 max-sm:flex-col max-sm:gap-3">
					{/* Difficulty and Points */}
					<div className="max-2md:flex-1 space-y-3">
						<div className="flex items-center justify-between">
							<span className="text-sm font-medium">{t('difficulty.label')}</span>
							<span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${getDifficultyColor(problem.difficulty)}`}>
								{t(`difficulty.${problem.difficulty}`)}
							</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-sm font-medium">{t('points')}</span>
							<div className="flex items-center gap-1">
								<Zap className="h-4 w-4 text-yellow-500" />
								<span className="font-medium">{problem.point}</span>
							</div>
						</div>
					</div>

					<Separator className="max-2md:hidden max-sm:block" />

					{/* Constraints */}
					<div className="max-2md:flex-1 space-y-3">
						<h4 className="text-sm font-medium">{t('constraints.title')}</h4>
						<div className="space-y-2">
							<div className="flex items-center justify-between gap-2 text-sm">
								<span className="flex items-center gap-2">
									<Clock className="text-muted-foreground h-4 w-4" />
									{t('constraints.time_limit')}
								</span>
								<span>{Number(problem.timeLimit / 1000).toFixed(2)}s</span>
							</div>
							<div className="flex items-center justify-between gap-2 text-sm">
								<span className="flex items-center gap-2">
									<Database className="text-muted-foreground h-4 w-4" />
									<span>{t('constraints.memory_limit')}</span>
								</span>
								<span>{Number(problem.memoryLimit / 1024).toFixed(1)}MB</span>
							</div>
						</div>
					</div>
				</div>

				<Separator />

				<div className="2md:flex-col max-2md:gap-10 flex gap-3 max-sm:flex-col max-sm:gap-3">
					{/* I/O Format */}
					<div className="max-2md:flex-1 space-y-3">
						<h4 className="text-sm font-medium">{t('io_format.title')}</h4>
						<div className="space-y-2">
							<div className="flex items-center justify-between gap-2 text-sm">
								<span className="flex items-center gap-2">
									<FileInput className="text-muted-foreground h-4 w-4" />
									<span>{t('io_format.input')}</span>
								</span>
								<span>{problem.ioMode === IOMode.STANDARD ? t('io_format.stdin') : problem.inputFile || 'N/A'}</span>
							</div>
							<div className="flex items-center justify-between gap-2 text-sm">
								<span className="flex items-center gap-2">
									<FileOutput className="text-muted-foreground h-4 w-4" />
									<span>{t('io_format.output')}</span>
								</span>
								<span>{problem.ioMode === IOMode.STANDARD ? t('io_format.stdout') : problem.outputFile || 'N/A'}</span>
							</div>
						</div>
					</div>

					<Separator className="max-2md:hidden max-sm:block" />

					{/* Statistics */}
					<div className="max-2md:flex-1 space-y-3">
						<h4 className="text-sm font-medium">{t('statistics.title')}</h4>
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<span className="text-muted-foreground text-sm">{t('statistics.accepted')}</span>
								<span className="text-sm font-medium">{problem.acCount || 0}</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-muted-foreground text-sm">{t('statistics.submissions')}</span>
								<span className="text-sm font-medium">{problem.submissionCount || 0}</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-muted-foreground text-sm">{t('statistics.acceptance_rate')}</span>
								<span className="text-sm font-medium">{(problem.acRate || 0) * 100}%</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Tags Card */}
			{problem.tags && problem.tags.length > 0 && (
				<div className="bg-card flex flex-col gap-4 rounded-2xl border p-6 shadow-xs">
					<h1 className="text-lg font-semibold">{t('tags')}</h1>

					<div className="flex flex-wrap gap-2">
						{problem.tags.map((tag) => (
							<Badge key={tag.id} variant="outline" className="capitalize">
								{tag.name}
							</Badge>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default ProblemSidebar;
