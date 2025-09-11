'use client';

import { useTranslations } from 'next-intl';
import { notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import { use } from 'react';
import { toast } from 'sonner';
import useSWR from 'swr';

import { ContestInfoTab } from './_components/contest-info-tab';
import { ContestProblemsTab } from './_components/contest-problems-tab';
import { ContestStandingsTab } from './_components/contest-standings-tab';
import ContestSubmissionTable from './_components/contest-submission-table';
import { JoinLeaveButton } from './_components/join-leave-button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { createClientService } from '~/lib/service-client';
import { authServiceInstance } from '~/services/auth';
import { contestServiceInstance } from '~/services/contest';
import { Contest } from '~/types/contest.type';

const ContestDetailPage = ({ params }: { params: Promise<{ slug: string }> }) => {
	const t = useTranslations('contest.detail');
	const resolvedParams = use(params);
	const contestService = createClientService(contestServiceInstance);
	const { getProfile } = createClientService(authServiceInstance);

	const [activeTab, setActiveTab] = useState('info');

	// Get current user
	const {
		data: user,
		mutate: mutateUser,
	} = useSWR('/auth/me', getProfile, {
		revalidateOnFocus: false,
		shouldRetryOnError: false,
	});

	// SWR hook for fetching contest data
	const {
		data: contest,
		error: contestError,
		isLoading: isContestLoading,
		mutate: mutateContest,
	} = useSWR(['contest', resolvedParams.slug], ([_, slug]) => contestService.findOneContest(slug).then((res) => res.contest), {
		revalidateOnFocus: false,
	});

	// SWR hook for fetching standings
	const {
		data: standingsData,
		error: standingsError,
		isLoading: standingsLoading,
	} = useSWR(activeTab === 'standings' && contest ? ['standings', contest.id] : null, ([_, contestId]) => contestService.getContestStandings(contestId), {
		revalidateOnFocus: false,
		keepPreviousData: true,
	});

	const standings = standingsData?.standings || [];
	const standingsProblems = standingsData?.problems || [];

	// Check if current user has joined the contest
	const isUserJoined = !!user && user.joiningContest?.id === contest?.id;

	// Handle contest update and reset tab to info
	const handleContestUpdate = (updatedContest: Contest) => {
		mutateContest(updatedContest, false);
		// Reset to info tab when user joins/leaves
		setActiveTab('info');
	};

	// Handle user update
	const handleUserUpdate = () => {
		// Revalidate user data to get updated joiningContest field
		mutateUser();
	};

	// Handle errors
	if (contestError) throw contestError;
	if (standingsError) throw standingsError;

	if (isContestLoading) {
		return <div className="p-8 text-center">{t('loading')}</div>;
	}

	if (!contest) {
		return notFound();
	}

	return (
		<div className="space-y-6">
			<Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
				<div className="flex items-center justify-between">
					<TabsList>
						<TabsTrigger value="info">{t('info_tab')}</TabsTrigger>
						{isUserJoined && (
							<>
								<TabsTrigger value="problems">{t('problems_tab')}</TabsTrigger>
								<TabsTrigger value="submissions">{t('submissions_tab')}</TabsTrigger>
								<TabsTrigger value="standings">{t('standings_tab')}</TabsTrigger>
							</>
						)}
					</TabsList>
					<JoinLeaveButton 
						contest={contest} 
						user={user ?? null} 
						onContestUpdate={handleContestUpdate}
						onUserUpdate={handleUserUpdate}
					/>
				</div>

				<TabsContent value="info">
					<ContestInfoTab contest={contest} />
				</TabsContent>

				{isUserJoined && (
					<>
						<TabsContent value="problems" className="space-y-4">
							<ContestProblemsTab contest={contest} />
						</TabsContent>

						<TabsContent value="submissions" className="space-y-4">
							<ContestSubmissionTable submissions={contest.submissions} user={user} />
						</TabsContent>

						<TabsContent value="standings" className="space-y-4">
							<ContestStandingsTab standings={standings} standingsLoading={standingsLoading} problems={standingsProblems} />
						</TabsContent>
					</>
				)}
			</Tabs>
		</div>
	);
};

export default ContestDetailPage;