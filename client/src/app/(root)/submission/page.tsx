'use client';

import { useState } from 'react';
import useSWR from 'swr';

import SubmissionChart from './_components/submission-chart';
import SubmissionFilter from './_components/submission-filter';
import SubmissionTable, { TableSkeleton } from './_components/submission-table';
import PaginationControls from '~/components/pagination-controls';
import { createClientService } from '~/lib/service-client';
import { authServiceInstance } from '~/services/auth';
import { submissionServiceInstance } from '~/services/submission';
import { ProgramLanguage, SubmissionStatus } from '~/types/submission.type';

const SubmissionsPage = () => {
	// Local filter states (no URL synchronization)
	const [problemId, setProblemId] = useState('');
	const [language, setLanguage] = useState('all');
	const [status, setStatus] = useState('all');
	const [authorId, setAuthorId] = useState('');
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(20);

	const submissionService = createClientService(submissionServiceInstance);
	const { getProfile } = createClientService(authServiceInstance);

	const { data: user } = useSWR('/auth/me', getProfile);

	// SWR with local state as keys - only send non-empty values
	const swrKey = {
		...(problemId && problemId.trim() && { problemId: problemId.trim() }),
		...(language && language.trim() && language !== 'all' && { language: language as ProgramLanguage }),
		...(status && status.trim() && status !== 'all' && { status: status as SubmissionStatus }),
		...(authorId && authorId.trim() && { authorId: authorId.trim() }),
		page,
		limit,
	};

	const { data, error, isLoading } = useSWR(swrKey, submissionService.findAllSubmissions, {
		keepPreviousData: true,
	});

	// Extract data for components
	const submissions = data?.submissions || [];
	const total = data?.total || 0;

	// Handler functions for filter changes
	const handleProblemChange = (value: string) => {
		setProblemId(value);
		setPage(1);
	};

	const handleLanguageChange = (value: string) => {
		setLanguage(value);
		setPage(1);
	};

	const handleStatusChange = (value: string) => {
		setStatus(value);
		setPage(1);
	};

	const handleAuthorChange = (value: string) => {
		setAuthorId(value);
		setPage(1);
	};

	const handlePageChange = (newPage: number) => {
		setPage(newPage);
	};

	const handleSizeChange = (newSize: number) => {
		setLimit(newSize);
		setPage(1);
	};

	if (!data && !isLoading) {
		throw error;
	}

	return (
		<div className="flex gap-6">
			<div className="flex-1 space-y-6">
				{/* Filters Section */}
				<SubmissionFilter
					problemId={problemId}
					language={language}
					status={status}
					authorId={authorId}
					onProblemChange={handleProblemChange}
					onLanguageChange={handleLanguageChange}
					onStatusChange={handleStatusChange}
					onAuthorChange={handleAuthorChange}
				/>

				{/* Results Section */}
				{!data && isLoading ? (
					<TableSkeleton />
				) : (
					<>
						<SubmissionTable submissions={submissions} user={user} />
						<PaginationControls totalItems={total} initialPage={1} initialSize={20} onPageChange={handlePageChange} onSizeChange={handleSizeChange} />
					</>
				)}
			</div>
			<SubmissionChart statusStatistics={data?.statusStatistics} languageStatistics={data?.languageStatistics} />
		</div>
	);
};

export default SubmissionsPage;
