import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

import Form from './_components/form';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '~/components/ui/breadcrumb';
import { getDifficultyColor } from '~/lib/difficulty-utils';
import { createServerService } from '~/lib/service-server';
import { createProblemService } from '~/services/problem';

interface Props {
	searchParams: Promise<{ problem: string | undefined }>;
}

const SubmitPage = async ({ searchParams }: Props) => {
	const t = await getTranslations('submit');
	const problemSlug = (await searchParams).problem;

	if (!problemSlug) {
		notFound();
	}

	// Services
	const problemService = await createServerService(createProblemService);

	const problem = await problemService.getProblemBySlug(problemSlug).then((res) => res.problem);

	return (
		<>
			{/* Breadcrumb */}
			<Breadcrumb className="mb-4">
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink href="/problem">{t('page.breadcrumb.problems')}</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbLink href={`/problem/${problem.slug}`}>{problem.title}</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>{t('page.submit')}</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>

			<div className="bg-card rounded-2xl border p-6 shadow-xs">
				<div className="flex items-center gap-3">
					<span className="text-lg font-medium">{problem.title}</span>
					<span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${getDifficultyColor(problem.difficulty)}`}>
						{t(problem.difficulty)}
					</span>
					<span className="text-muted-foreground text-sm">{problem.point} points</span>
				</div>
				<Form problemId={problem.id} />
			</div>
		</>
	);
};

export default SubmitPage;
