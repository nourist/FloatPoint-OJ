'use client';

import { Send } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Dispatch, SetStateAction, useState } from 'react';
import { toast } from 'sonner';
import useSWR from 'swr';

import Comment from '~/components/comment';
import { Button } from '~/components/ui/button';
import { Textarea } from '~/components/ui/textarea';
import UserAvatar from '~/components/user-avatar';
import http from '~/lib/http-client';
import { createAuthService } from '~/services/auth';
import { createBlogService } from '~/services/blog';
import { Blog, BlogComment } from '~/types/blog.type';
import { User } from '~/types/user.type';

interface Props {
	blog: Blog;
}

interface CommentFormProps {
	user: User;
	blogId: string;
	setComments: Dispatch<SetStateAction<BlogComment[]>>;
}

const CommentForm = ({ user, blogId, setComments }: CommentFormProps) => {
	const t = useTranslations('blog');

	const [isLoading, setIsLoading] = useState(false);
	const [comment, setComment] = useState('');

	const { createComment } = createBlogService(http);

	const onSubmit = async () => {
		if (comment.length == 0) {
			toast.error(t('message.comment_required'));
			return;
		}

		setIsLoading(true);

		createComment(blogId, { content: comment })
			.then((data) => {
				toast.success(t('create_success'));
				setComments((prev) => [data, ...prev]);
				setComment('');
			})
			.catch((error) => {
				toast.error(error.message);
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	return (
		<div className="flex gap-3">
			<UserAvatar className="size-10" user={user} />
			<div className="flex-1 space-y-3">
				<Textarea placeholder="Write a comment..." value={comment} onChange={(e) => setComment(e.target.value)} />
				<div className="flex">
					<Button className="ml-auto" disabled={isLoading} onClick={onSubmit}>
						<Send />
						{t('comment')}
					</Button>
				</div>
			</div>
		</div>
	);
};

const Comments = ({ blog }: Props) => {
	const { getProfile } = createAuthService(http);
	const t = useTranslations('blog');

	const { data: user } = useSWR('/auth/me', getProfile);

	const [comments, setComments] = useState(blog.comments);

	return (
		<div className="bg-card mt-6 space-y-6 rounded-2xl border p-6 shadow-xs">
			<h2 className="text-2xl font-semibold">
				{t('comments')} ({comments.length})
			</h2>
			{user && <CommentForm blogId={blog.id} user={user} setComments={setComments} />}
			{comments.map((comment) => (
				<Comment key={comment.id} comment={comment} />
			))}
		</div>
	);
};

export default Comments;
