'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState } from 'react';
import useSWR from 'swr';

import { ContestInfoTab } from './contest-info-tab';
import { ContestStandingsTab } from './contest-standings-tab';
import { JoinLeaveButton } from './join-leave-button';
import { TimeRemaining } from './time-remaining';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { createClientService } from '~/lib/service-client';
import { authServiceInstance } from '~/services/auth';
import { contestServiceInstance } from '~/services/contest';
import { Contest, ContestStatus, getContestStatus } from '~/types/contest.type';
import { User } from '~/types/user.type';
import { cn } from '~/lib/utils';

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
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} = useSWR(activeTab === 'standings' ? ['standings', contest.id] : null, ([_, contestId]) => contestService.getContestStandings(contestId), {
		revalidateOnFocus: false,
		keepPreviousData: true,
	});

	const standings = standingsData?.standings || [];
	const standingsProblems = standingsData?.problems || [];

	// Check if current user has joined the contest
	const isUserJoined = !!user && user.joiningContest?.id === contest?.id;

	// Handle contest update and reset tab to info
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
			<TimeRemaining contest={contest} />
			<Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
				<div className="flex items-center justify-between">
					<TabsList>
						<TabsTrigger value="info">{t('info_tab')}</TabsTrigger>
						{isUserJoined && (
							<>
								<Link 
									href={`/problem?contestId=${contest.id}`}
									className={cn(
										"inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
										"hover:bg-muted/50"
									)}
								>
									{t('problems_tab')}
								</Link>
								<Link 
									href={`/submission?contestId=${contest.id}`}
									className={cn(
										"inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
										"hover:bg-muted/50"
									)}
								>
									{t('submissions_tab')}
								</Link>
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
					<TabsContent value="standings" className="space-y-4">
						<ContestStandingsTab standings={standings} standingsLoading={standingsLoading} problems={standingsProblems} />
					</TabsContent>
				)}
			</Tabs>
		</div>
	);
};
