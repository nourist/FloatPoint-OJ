import ProblemWrapper from './_components/wrapper';
import { createServerService } from '~/lib/service-server';
import { problemServiceInstance } from '~/services/problem';

const Problem = async () => {
	const problemService = await createServerService(problemServiceInstance);

	const [minPoint, maxPoint, tags] = await Promise.all([problemService.getMinPoint(), problemService.getMaxPoint(), problemService.getAllTags()]);

	return <ProblemWrapper minPoint={minPoint} maxPoint={maxPoint} tags={tags} />;
};

export default Problem;
