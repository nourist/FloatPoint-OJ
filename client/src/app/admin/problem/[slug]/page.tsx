'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import useSWR from 'swr';

import EditorialTab from './_components/editorial-tab';
import ProblemInfoForm from './_components/problem-info-form';
import TabNavigation from './_components/tab-navigation';
import TestcaseTab from './_components/testcase-tab';
import { createClientService } from '~/lib/service-client';
import { problemServiceInstance } from '~/services/problem';
import { ProblemEditorial } from '~/types/problem-editorial.type';
import { Problem } from '~/types/problem.type';

const ProblemSlugPage = () => {
	const params = useParams();
	const { slug } = params as { slug: string };

	const problemService = createClientService(problemServiceInstance);
	const [activeTab, setActiveTab] = useState<'info' | 'editorial' | 'testcase'>('info');

	// Only fetch problem data if slug is available
	const {
		data: problemData,
		error: problemError,
		isLoading: isProblemLoading,
		mutate,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} = useSWR(['getProblemBySlug', slug], ([_, slug]: [string, string]) => problemService.getProblemBySlug(slug).then((res) => res.problem));

	const { data: tagsData, error: tagsError, isLoading: isTagsLoading } = useSWR('getAllTags', () => problemService.getAllTags());

	const handleProblemUpdate = (updatedProblem: Problem) => {
		mutate({ ...problemData, ...updatedProblem }, false);
	};

	const handleEditorialUpdate = (updatedEditorial: ProblemEditorial | null) => {
		if (problemData) {
			if (updatedEditorial === null) {
				// Editorial was deleted, remove it from the problem data
				const updatedProblemData = { ...problemData };
				delete updatedProblemData.editorial;
				mutate(updatedProblemData, false);
			} else {
				// Editorial was created/updated
				mutate({ ...problemData, editorial: updatedEditorial }, false);
			}
		}
	};

	if (!problemData) {
		if (!isProblemLoading) throw problemError;
		else return <div>loading...</div>;
	}

	if (!tagsData) {
		if (!isTagsLoading) throw tagsError;
		else return null;
	}

	return (
		<>
			<TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

			{activeTab === 'info' && <ProblemInfoForm tagOptions={tagsData || []} problem={problemData} onUpdate={handleProblemUpdate} />}

			{activeTab === 'editorial' && <EditorialTab problem={problemData} onEditorialUpdate={handleEditorialUpdate} />}

			{activeTab === 'testcase' && <TestcaseTab problem={problemData} />}
		</>
	);
};

export default ProblemSlugPage;
