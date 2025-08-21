import ProblemWrapper from './_components/wrapper';
import { createServerService } from '~/lib/service-server';
import { createAuthService } from '~/services/auth';
import { createProblemService } from '~/services/problem';

const Problem = async () => {
	const problemService = await createServerService(createProblemService);
	const authService = await createServerService(createAuthService);

	const [minPoint, maxPoint, tags, total, user] = await Promise.all([
		problemService.getMinPoint(),
		problemService.getMaxPoint(),
		problemService.getAllTags(),
		problemService.findAllProblems({}).then((res) => res.total),
		authService.getProfile().catch(() => null),
	]);

	return <ProblemWrapper minPoint={minPoint} maxPoint={maxPoint} tags={tags} total={total} user={user} />;
};

export default Problem;
