'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

import UserAvatar from './user-avatar';
import { BlogComment } from '~/types/blog.type';

interface Props {
	comment: BlogComment;
}

const Comment = ({ comment }: Props) => {
	const t = useTranslations('blog.comment');

	const formatDate = (dateInput: Date | string): string => {
		const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
		const now = new Date();
		const diff = Math.max((now.getTime() - date.getTime()) / 1000, 0); // giây

		if (diff < 60) {
			return t('date.seconds', { count: Math.floor(diff) });
		}
		if (diff < 3600) {
			return t('date.minutes', { count: Math.floor(diff / 60) });
		}
		if (diff < 86400) {
			return t('date.hours', { count: Math.floor(diff / 3600) });
		}
		if (diff < 2592000) {
			return t('date.days', { count: Math.floor(diff / 86400) });
		}
		if (diff < 31536000) {
			return t('date.months', { count: Math.floor(diff / 2592000) });
		}
		return t('date.years', { count: Math.floor(diff / 31536000) });
	};

	return (
		<div className="flex gap-3">
			<Link href={`/profile/${comment.user.username}`}>
				<UserAvatar className="size-10" user={comment.user} />
			</Link>
			<div className="bg-background flex-1 space-y-2 rounded-lg p-3">
				<p className="font-medium group-hover:underline">
					{comment.user.username}
					<span className="text-muted-foreground ml-2 text-sm">{formatDate(comment.createdAt)}</span>
				</p>
				<p className="text-sm">{comment.content}</p>
			</div>
		</div>
	);
};

export default Comment;
