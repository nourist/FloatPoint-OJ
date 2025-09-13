'use client';

import { useRouter } from 'next/navigation';

import ContestForm from '~/components/contest-form';
import { Contest } from '~/types/contest.type';

const CreateContestPage = () => {
	const router = useRouter();

	const handleSuccess = (contest: Contest) => {
		// Redirect to the contest detail page after successful creation
		router.push(`/admin/contest/${contest.slug}`);
	};

	return <ContestForm mode="create" onSubmitSuccess={handleSuccess} />;
};

export default CreateContestPage;
