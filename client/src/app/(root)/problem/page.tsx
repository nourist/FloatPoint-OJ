import ProblemWrapper from './_components/wrapper';
import { createServerService } from '~/lib/service-server';
import { authServiceInstance } from '~/services/auth';
import { problemServiceInstance } from '~/services/problem';

const Problem = async () => {
	const problemService = await createServerService(problemServiceInstance);
	const authService = await createServerService(authServiceInstance);

	const [minPoint, maxPoint, tags, user] = await Promise.all([
		problemService.getMinPoint(),
		problemService.getMaxPoint(),
		problemService.getAllTags(),
		authService.getProfile().catch(() => null),
	]);

	return <ProblemWrapper minPoint={minPoint} maxPoint={maxPoint} tags={tags} user={user} />;
};

export default Problem;
