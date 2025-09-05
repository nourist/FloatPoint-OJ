import ProblemForm from './_components/form';
import { createServerService } from '~/lib/service-server';
import { problemServiceInstance } from '~/services/problem';

const CreateProblemPage = async () => {
	const problemService = await createServerService(problemServiceInstance);

	const tags = await problemService.getAllTags();

	return <ProblemForm tagOptions={tags} />;
};

export default CreateProblemPage;
