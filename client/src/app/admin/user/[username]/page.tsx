'use client';

import { notFound } from 'next/navigation';
import { useEffect } from 'react';
import { use } from 'react';
import useSWR from 'swr';

import UserDetailProfile from './_components/user-detail-profile';
import { createClientService } from '~/lib/service-client';
import { userServiceInstance } from '~/services/user';

interface UserDetailPageProps {
	params: Promise<{
		username: string;
	}>;
}

const UserDetailPage = ({ params }: UserDetailPageProps) => {
	const { username } = use(params);

	const { getUserByUsername, getUserStatistics } = createClientService(userServiceInstance);

	const { data: userResponse, error: userError } = useSWR(`user-${username}`, () => getUserByUsername(username));

	const { data: statsResponse } = useSWR(userResponse ? `user-stats-${username}` : null, () => getUserStatistics(username));

	useEffect(() => {
		if (userError) {
			notFound();
		}
	}, [userError]);

	if (userError) {
		return null;
	}

	const user = userResponse?.user;
	const stats = statsResponse?.statistics;

	return <UserDetailProfile user={user} stats={stats} />;
};

export default UserDetailPage;
