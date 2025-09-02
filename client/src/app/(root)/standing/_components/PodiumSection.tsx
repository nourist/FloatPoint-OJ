import { Trophy, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import useSWR from 'swr';

import { createClientService } from '~/lib/service-client';
import { userServiceInstance } from '~/services/user';
import { User } from '~/types/user.type';
import { PodiumCard, PodiumSkeleton } from './PodiumCard';

interface StandingUser extends User {
	rank: number;
	ratingValue: number;
	scoreValue: number;
}

interface PodiumSectionProps {
	mode: 'rating' | 'score';
}

export const PodiumSection = ({ mode }: PodiumSectionProps) => {
	const t = useTranslations('standing');

	// SWR data fetching for top 3 users
	const userService = createClientService(userServiceInstance);
	const {
		data: topData,
		error: topError,
		isLoading: topLoading,
	} = useSWR(['users-top', mode], () =>
		userService.getUsers({
			sortBy: mode,
			sortOrder: 'DESC',
			limit: 3,
			page: 1,
		}),
	);

	return (
		<div className="rounded-2xl border bg-card p-6 shadow-xs">
			<div className="mb-4 flex items-center gap-2">
				<Trophy className="h-5 w-5" />
				<h2 className="text-xl font-semibold">{t('top_users')}</h2>
			</div>
			{topLoading ? (
				<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
					<PodiumSkeleton />
					<PodiumSkeleton />
					<PodiumSkeleton />
				</div>
			) : topError ? (
				<div className="py-8 text-center">
					<p className="text-red-500">{t('errors.load_failed')}</p>
				</div>
			) : topData?.users && topData.users.length > 0 ? (
				<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
					{topData.users.map((user, index) => {
						const standingUser: StandingUser = {
							...user,
							rank: index + 1,
							ratingValue: user.rating.length > 0 ? user.rating[user.rating.length - 1] : 0,
							scoreValue: (user as any).score || 0,
						};
						return <PodiumCard key={user.id} user={standingUser} position={index + 1} mode={mode} />;
					})}
				</div>
			) : (
				<div className="py-8 text-center">
					<Users className="text-muted-foreground mx-auto mb-2 h-12 w-12" />
					<p className="text-muted-foreground">{t('no_data')}</p>
				</div>
			)}
		</div>
	);
};