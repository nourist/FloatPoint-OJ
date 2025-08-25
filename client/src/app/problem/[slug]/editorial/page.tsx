import { getTranslations } from 'next-intl/server';

import EditorialContent from './_components/editorial-content';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '~/components/ui/breadcrumb';
import { createServerService } from '~/lib/service-server';
import { createProblemService } from '~/services/problem';

interface Props {
	params: Promise<{ slug: string }>;
}

const EditorialPage = async ({ params }: Props) => {
	const { slug } = await params;
	const t = await getTranslations('editorial');

	const problemService = await createServerService(createProblemService);

	// Fetch problem with editorial relation included
	const problemResponse = await problemService.getProblemBySlug(slug);
	const problem = problemResponse.problem;
	const editorial = problem.editorial || null;

	return (
		<>
			{/* Breadcrumb */}
			<Breadcrumb className="mb-4">
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink href="/problem">{t('breadcrumb.problems')}</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbLink href={`/problem/${problem.slug}`}>{problem.title}</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>{t('title')}</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>

			{/* Editorial Content */}
			<div className="bg-card rounded-2xl border p-6 shadow-xs">
				{/* Editorial Content */}
				<EditorialContent title={problem.title} editorial={editorial} />
			</div>
		</>
	);
};

export default EditorialPage;
