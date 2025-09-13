'use client';

import { useTranslations } from 'next-intl';

import UserAvatar from '~/components/user-avatar';
import { UserStatistics } from '~/services/user';
import { User } from '~/types/user.type';

interface UserDetailProfileProps {
	user: User | undefined;
	stats: UserStatistics | undefined | null;
}

const UserDetailProfile = ({ user, stats }: UserDetailProfileProps) => {
	const t = useTranslations('admin.user.detail');

	if (!user) {
		return (
			<div className="flex items-center justify-center py-16">
				<div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
			</div>
		);
	}

	// Get current rating (latest rating from array)
	const currentRating = user.rating.length > 0 ? user.rating[user.rating.length - 1] : 0;

	return (
		<div className="space-y-8">
			{/* User Header */}
			<div>
				<div className="mb-6 flex gap-6">
					<div className="flex-shrink-0">
						<UserAvatar user={user} className="size-32 rounded-lg" />
					</div>
					<div className="flex-1">
						<h1 className="text-3xl font-bold">{user.username}</h1>
						{user.fullname && <p className="text-muted-foreground mt-1 text-xl">{user.fullname}</p>}
						<div className="mt-3 flex items-center gap-4">
							<span
								className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
									user.role === 'admin'
										? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
										: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
								}`}
							>
								{user.role}
							</span>
							<span
								className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
									user.isVerified
										? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
										: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
								}`}
							>
								{user.isVerified ? t('verified') : t('unverified')}
							</span>
						</div>
					</div>
				</div>

				{/* Contact Info */}
				<div className="mb-6 space-y-2">
					<div>
						<span className="text-muted-foreground text-sm font-medium">{t('email')}: </span>
						<span className="text-sm">{user.email}</span>
					</div>
					<div>
						<span className="text-muted-foreground text-sm font-medium">{t('joined')}: </span>
						<span className="text-sm">{new Date(user.createdAt).toLocaleDateString()}</span>
					</div>
					<div>
						<span className="text-muted-foreground text-sm font-medium">{t('last_updated')}: </span>
						<span className="text-sm">{new Date(user.updatedAt).toLocaleDateString()}</span>
					</div>
				</div>

				{/* Bio */}
				{user.bio && (
					<div className="bg-muted/30 rounded-lg p-4">
						<h3 className="text-muted-foreground mb-2 text-sm font-medium">{t('bio')}</h3>
						<p className="text-sm leading-relaxed">{user.bio}</p>
					</div>
				)}
			</div>

			{/* Stats Section */}
			{stats && (
				<div>
					<div className="mb-6">
						<h2 className="text-2xl font-bold">{t('statistics')}</h2>
					</div>
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						<div className="rounded-xl border border-yellow-200 bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 transition-all hover:shadow-md dark:border-yellow-800/30 dark:from-yellow-900/20 dark:to-yellow-800/20">
							<div className="text-muted-foreground text-sm">{t('score')}</div>
							<div className="text-2xl font-bold">{stats.score || 0}</div>
						</div>
						<div className="rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 transition-all hover:shadow-md dark:border-indigo-800/30 dark:from-indigo-900/20 dark:to-indigo-800/20">
							<div className="text-muted-foreground text-sm">{t('rating')}</div>
							<div className="text-2xl font-bold">{currentRating}</div>
						</div>
						<div className="rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-green-100 p-4 transition-all hover:shadow-md dark:border-green-800/30 dark:from-green-900/20 dark:to-green-800/20">
							<div className="text-muted-foreground text-sm">{t('problems_solved')}</div>
							<div className="text-2xl font-bold">{stats.acProblemCount}</div>
						</div>
						<div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-4 transition-all hover:shadow-md dark:border-blue-800/30 dark:from-blue-900/20 dark:to-blue-800/20">
							<div className="text-muted-foreground text-sm">{t('submissions')}</div>
							<div className="text-2xl font-bold">{stats.submissionCount}</div>
						</div>
						<div className="rounded-xl border border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 p-4 transition-all hover:shadow-md dark:border-orange-800/30 dark:from-orange-900/20 dark:to-orange-800/20">
							<div className="text-muted-foreground text-sm">{t('blogs')}</div>
							<div className="text-2xl font-bold">{stats.blogCount}</div>
						</div>
						<div className="rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 p-4 transition-all hover:shadow-md dark:border-purple-800/30 dark:from-purple-900/20 dark:to-purple-800/20">
							<div className="text-muted-foreground text-sm">{t('comments')}</div>
							<div className="text-2xl font-bold">{stats.commentCount}</div>
						</div>
						<div className="rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100 p-4 transition-all hover:shadow-md dark:border-amber-800/30 dark:from-amber-900/20 dark:to-amber-800/20">
							<div className="text-muted-foreground text-sm">{t('contests')}</div>
							<div className="text-2xl font-bold">{stats.joinedContestCount}</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default UserDetailProfile;
