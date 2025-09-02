import { Crown, Medal } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Badge } from '~/components/ui/badge';
import { Skeleton } from '~/components/ui/skeleton';
import { User } from '~/types/user.type';

interface StandingUser extends User {
	rank: number;
	ratingValue: number;
	scoreValue: number;
}

interface PodiumCardProps {
	user: StandingUser;
	position: number;
	mode: 'rating' | 'score';
}

export const PodiumCard = ({ user, position, mode }: PodiumCardProps) => {
	const t = useTranslations('standing');

	const getPodiumIcon = () => {
		switch (position) {
			case 1:
				return <Crown className="h-8 w-8 text-yellow-500" />;
			case 2:
				return <Medal className="h-8 w-8 text-gray-400" />;
			case 3:
				return <Medal className="h-8 w-8 text-amber-600" />;
			default:
				return null;
		}
	};

	const getPodiumColor = () => {
		switch (position) {
			case 1:
				return 'border-yellow-200 bg-yellow-50';
			case 2:
				return 'border-gray-200 bg-gray-50';
			case 3:
				return 'border-amber-200 bg-amber-50';
			default:
				return 'border-gray-200 bg-gray-50';
		}
	};

	return (
		<div className={`bg-card relative rounded-2xl border p-6 shadow-xs ${getPodiumColor()}`}>
			<div className="pb-2 text-center">
				<div className="mb-2 flex justify-center">{getPodiumIcon()}</div>
				<Badge variant="outline" className="absolute top-2 right-2">
					#{position}
				</Badge>
			</div>
			<div className="space-y-3 text-center">
				<Link href={`/profile/${user.username}`} className="group">
					<Avatar className="mx-auto h-16 w-16 border-2 border-white shadow">
						<AvatarImage src={user.avatarUrl || undefined} alt={user.username} />
						<AvatarFallback className="text-lg font-semibold">{user.username.charAt(0).toUpperCase()}</AvatarFallback>
					</Avatar>
					<div>
						<h3 className="text-lg font-semibold group-hover:underline">{user.username}</h3>
						{user.fullname && <p className="text-muted-foreground text-sm">{user.fullname}</p>}
					</div>
				</Link>
				<div className="text-primary text-2xl font-bold">{mode === 'score' ? Math.round(user.scoreValue) : Math.round(user.ratingValue)}</div>
				<p className="text-muted-foreground text-sm">{mode === 'score' ? t('score') : t('rating')}</p>
			</div>
		</div>
	);
};

export const PodiumSkeleton = () => (
	<div className="bg-card rounded-2xl border p-6 shadow-xs">
		<div className="pb-2 text-center">
			<Skeleton className="mx-auto mb-2 h-8 w-8" />
		</div>
		<div className="space-y-3 text-center">
			<Skeleton className="mx-auto h-16 w-16 rounded-full" />
			<div className="space-y-1">
				<Skeleton className="mx-auto h-6 w-24" />
				<Skeleton className="mx-auto h-4 w-32" />
			</div>
			<Skeleton className="mx-auto h-8 w-16" />
			<Skeleton className="mx-auto h-4 w-12" />
		</div>
	</div>
);
