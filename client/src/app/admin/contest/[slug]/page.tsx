'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useState } from 'react';
import { use } from 'react';
import { toast } from 'sonner';
import useSWR from 'swr';

import { ProblemsTab } from './_components/problems-tab';
import { StandingsTab } from './_components/standings-tab';
import ContestForm from '~/components/contest-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { createClientService } from '~/lib/service-client';
import { cn } from '~/lib/utils';
import { contestServiceInstance } from '~/services/contest';
import { Contest } from '~/types/contest.type';

const ContestDetailPage = ({ params }: { params: Promise<{ slug: string }> }) => {
	const t = useTranslations('admin.contest.detail');
	const resolvedParams = use(params);
	const contestService = createClientService(contestServiceInstance);

	const [activeTab, setActiveTab] = useState('info');

	// SWR hook for fetching contest data
	const {
		data: contest,
		error: contestError,
		isLoading: isContestLoading,
		mutate: mutateContest,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} = useSWR(['contest', resolvedParams.slug], ([_, slug]) => contestService.findOneContest(slug).then((res) => res.contest), {
		revalidateOnFocus: false,
	});

	// SWR hook for fetching standings
	const {
		data: standingsData,
		error: standingsError,
		isLoading: standingsLoading,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} = useSWR(activeTab === 'standings' && contest ? ['standings', contest.id] : null, ([_, contestId]) => contestService.getContestStandings(contestId), {
		revalidateOnFocus: false,
		keepPreviousData: true,
	});

	const standings = standingsData?.standings || [];
	const standingsProblems = standingsData?.problems || [];

	// Handle contest update
	const handleSuccess = (updatedContest: Contest) => {
		mutateContest(updatedContest, false);
		toast.success(t('contest_updated'));
	};

	// Handle errors
	if (contestError) {
		throw contestError;
	}

	if (standingsError) {
		throw standingsError;
	}

	if (isContestLoading) {
		return <div className="p-8 text-center">{t('loading')}</div>;
	}

	if (!contest) {
		return notFound();
	}

	return (
		<Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
			<TabsList>
				<TabsTrigger value="info">{t('info_tab')}</TabsTrigger>
				<TabsTrigger value="problems">{t('problems_tab')}</TabsTrigger>
				<Link 
					href={`/admin/submission?contestId=${contest.id}`}
					className={cn(
						'ring-offset-background focus-visible:ring-ring inline-flex items-center justify-center rounded-sm px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 hover:bg-muted/50'
					)}
				>
					{t('submissions_tab')}
				</Link>
				<TabsTrigger value="standings">{t('standings_tab')}</TabsTrigger>
			</TabsList>

			<TabsContent value="info">
				<ContestForm mode="edit" contest={contest} onSubmitSuccess={handleSuccess} />
			</TabsContent>

			<TabsContent value="problems" className="space-y-4">
				<ProblemsTab contest={contest} onContestUpdate={mutateContest} />
			</TabsContent>



			<TabsContent value="standings" className="space-y-4">
				<StandingsTab standings={standings} standingsLoading={standingsLoading} problems={standingsProblems} />
			</TabsContent>
		</Tabs>
	);
};

export default ContestDetailPage;
