'use client';

import { useRouter } from 'next/navigation';
import useSWR from 'swr';

import ProblemForm from '~/components/problem-form';
import { createClientService } from '~/lib/service-client';
import { problemServiceInstance } from '~/services/problem';
import { Problem } from '~/types/problem.type';

const CreateProblemPage = () => {
	const router = useRouter();
	const problemService = createClientService(problemServiceInstance);

	// Fetch tags using SWR
	const { data: tagsData } = useSWR('getAllTags', () => problemService.getAllTags(), {
		revalidateOnFocus: false,
	});

	const tagOptions = tagsData || [];

	const handleSubmitSuccess = (problem: Problem) => {
		router.push(`/admin/problem/${problem.slug}`);
	};

	return <ProblemForm tagOptions={tagOptions} onSubmitSuccess={handleSubmitSuccess} mode="create" />;
};

export default CreateProblemPage;
