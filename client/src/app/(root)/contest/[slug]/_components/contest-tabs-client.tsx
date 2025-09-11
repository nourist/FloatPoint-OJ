'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import useSWR from 'swr';

import { ContestInfoTab } from './contest-info-tab';
import { ContestProblemsTab } from './contest-problems-tab';
import { ContestStandingsTab } from './contest-standings-tab';
import ContestSubmissionTable from './contest-submission-table';
import { JoinLeaveButton } from './join-leave-button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { createClientService } from '~/lib/service-client';
import { authServiceInstance } from '~/services/auth';
import { contestServiceInstance } from '~/services/contest';
import { Contest, ContestStatus, getContestStatus } from '~/types/contest.type';
import { User } from '~/types/user.type';

// Client component for tabs that need client-side interaction
export const ContestTabsClient = ({
	contest,
	initialUser,
	startDate,
	startTime,
	endDate,
	endTime,
}: {
	contest: Contest;
	initialUser: User | null;
	startDate: string;
	startTime: string;
	endDate: string;
	endTime: string;
}) => {
	const t = useTranslations('contest.detail');
	const contestService = createClientService(contestServiceInstance);
	const { getProfile } = createClientService(authServiceInstance);
	const [activeTab, setActiveTab] = useState('info');

	// Get current user (with initial data from server)
	const { data: user, mutate: mutateUser } = useSWR('/auth/me', getProfile, {
		revalidateOnFocus: false,
		shouldRetryOnError: false,
		fallbackData: initialUser || undefined,
	});

	// SWR hook for fetching standings
	const {
		data: standingsData,
		error: standingsError,
		isLoading: standingsLoading,
	} = useSWR(activeTab === 'standings' ? ['standings', contest.id] : null, ([_, contestId]) => contestService.getContestStandings(contestId), {
		revalidateOnFocus: false,
		keepPreviousData: true,
	});

	const standings = standingsData?.standings || [];
	const standingsProblems = standingsData?.problems || [];

	// Check if current user has joined the contest
	const isUserJoined = !!user && user.joiningContest?.id === contest?.id;

	// Handle contest update and reset tab to info
	const handleContestUpdate = (updatedContest: Contest) => {
		// Reset to info tab when user joins/leaves
		setActiveTab('info');
	};

	// Handle user update
	const handleUserUpdate = () => {
		// Revalidate user data to get updated joiningContest field
		mutateUser();
	};

	// Handle errors
	if (standingsError) throw standingsError;

	const status = getContestStatus(contest);

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
					{status == ContestStatus.RUNNING && (
						<JoinLeaveButton contest={contest} user={user ?? null} onContestUpdate={handleContestUpdate} onUserUpdate={handleUserUpdate} />
					)}
				</div>

				<TabsContent value="info">
					<ContestInfoTab contest={contest} startDate={startDate} startTime={startTime} endDate={endDate} endTime={endTime} />
				</TabsContent>

				{isUserJoined && (
					<>
						<TabsContent value="problems" className="space-y-4">
							<ContestProblemsTab contest={contest} />
						</TabsContent>

						<TabsContent value="submissions" className="space-y-4">
							<ContestSubmissionTable submissions={contest.submissions || []} user={user} />
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
