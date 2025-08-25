import { getTranslations } from 'next-intl/server';

import ProblemSidebar from './_components/problem-sidebar';
import ProblemStatement from './_components/problem-statement';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '~/components/ui/breadcrumb';
import { createServerService } from '~/lib/service-server';
import { createAuthService } from '~/services/auth';
import { createProblemService } from '~/services/problem';

interface Props {
	params: Promise<{ slug: string }>;
}

const Problem = async ({ params }: Props) => {
	const { slug } = await params;
	const t = await getTranslations('problem.detail.header');

	const problemService = await createServerService(createProblemService);
	const authService = await createServerService(createAuthService);

	const [problemResponse, user] = await Promise.all([problemService.getProblemBySlug(slug), authService.getProfile().catch(() => null)]);

	const problem = problemResponse.problem;

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
						<BreadcrumbPage>{problem.title}</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>

			{/* Main Content - Left-Right Layout */}
			<div className="max-2md:flex-col-reverse flex gap-6">
				{/* Left Column - Problem Statement */}
				<div className="flex-1">
					<div className="bg-card rounded-2xl border p-6 shadow-xs">
						<ProblemStatement problem={problem} />
					</div>
				</div>

				{/* Right Column - Sidebar */}
				<div className="2md:w-80">
					<ProblemSidebar user={user} problem={problem} />
				</div>
			</div>
		</>
	);
};

export default Problem;
