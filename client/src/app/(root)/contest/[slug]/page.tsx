import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { ContestTabsClient } from './_components/contest-tabs-client';
import { createServerService } from '~/lib/service-server';
import { authServiceInstance } from '~/services/auth';
import { contestServiceInstance } from '~/services/contest';
import { Contest } from '~/types/contest.type';
import { User } from '~/types/user.type';

// Server-side function to fetch contest data
async function getContest(slug: string) {
	try {
		const contestService = await createServerService(contestServiceInstance);
		const response = await contestService.findOneContest(slug);
		return response.contest;
	} catch (error) {
		return null;
	}
}

// Server-side function to fetch user data
async function getUser() {
	try {
		const authService = await createServerService(authServiceInstance);
		const user = await authService.getProfile();
		return user;
	} catch (error) {
		return null;
	}
}

// Format dates on the server to avoid hydration mismatches
function formatContestDates(contest: Contest) {
	// Use a fixed locale and timezone for consistent formatting
	const locale = 'en-US';
	const timeZone = 'UTC';

	const startDate = new Date(contest.startTime).toLocaleDateString(locale, {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		timeZone,
	});

	const startTime = new Date(contest.startTime).toLocaleTimeString(locale, {
		hour: '2-digit',
		minute: '2-digit',
		timeZone,
	});

	const endDate = new Date(contest.endTime).toLocaleDateString(locale, {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		timeZone,
	});

	const endTime = new Date(contest.endTime).toLocaleTimeString(locale, {
		hour: '2-digit',
		minute: '2-digit',
		timeZone,
	});

	return { startDate, startTime, endDate, endTime };
}

interface Props {
	params: Promise<{ slug: string }>;
}

// Main page component (server component)
const ContestDetailPage = async ({ params }: Props) => {
	// Fetch contest and user data on the server in parallel
	const [contest, user] = await Promise.all([getContest((await params).slug), getUser()]);

	if (!contest) {
		return notFound();
	}

	// Format dates on the server to avoid hydration mismatches
	const { startDate, startTime, endDate, endTime } = formatContestDates(contest);

	return <ContestTabsClient contest={contest} initialUser={user} startDate={startDate} startTime={startTime} endDate={endDate} endTime={endTime} />;
};

export default ContestDetailPage;
