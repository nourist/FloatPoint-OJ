import { SubmissionClientWrapper } from './_components/submission-client-wrapper';
import { createServerService } from '~/lib/service-server';
import { submissionServiceInstance } from '~/services/submission';

interface Props {
	params: Promise<{ id: string }>;
}

const SubmissionDetailPage = async ({ params }: Props) => {
	const { id: submissionId } = await params;

	// Fetch submission data on the server side
	const submissionService = await createServerService(submissionServiceInstance);

	const { submission } = await submissionService.findOneSubmission(submissionId);

	return <SubmissionClientWrapper initialSubmission={submission} />;
};

export default SubmissionDetailPage;
