'use client';

import { Send } from 'lucide-react';
import { Ellipsis, Pencil, Trash } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';
import { toast } from 'sonner';
import useSWR from 'swr';

import { Button } from '~/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '~/components/ui/dropdown-menu';
import { Textarea } from '~/components/ui/textarea';
import UserAvatar from '~/components/user-avatar';
import { createClientService } from '~/lib/service-client';
import { authServiceInstance } from '~/services/auth';
import { blogServiceInstance } from '~/services/blog';
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

interface CommentProps {
	comment: BlogComment;
	blogId: string;
	setComments: Dispatch<SetStateAction<BlogComment[]>>;
	user?: User;
}

const Comment = ({ comment, blogId, setComments, user }: CommentProps) => {
	const t = useTranslations('blog.comment');
	const [deleting, setDeleting] = useState(false);
	const [inEdit, setInEdit] = useState(false);
	const [isEditing, setIsEditing] = useState(false);

	const [content, setContent] = useState(comment.content);

	const { deleteComment, updateComment } = createClientService(blogServiceInstance);

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

	const handleDelete = () => {
		setDeleting(true);
		deleteComment(blogId, comment.id)
			.then(() => {
				toast.success(t('delete_success'));
				setComments((prev) => prev.filter((c) => c.id !== comment.id));
			})
			.catch((error) => {
				toast.error(error.message);
			})
			.finally(() => {
				setDeleting(false);
			});
	};

	const handleEdit = () => {
		setIsEditing(true);
		updateComment(blogId, comment.id, { content })
			.then(() => {
				toast.success(t('edit_success'));
				setComments((prev) => prev.map((c) => (c.id == comment.id ? { ...c, content } : c)));
			})
			.catch((error) => {
				toast.error(error.message);
			})
			.finally(() => {
				setIsEditing(false);
				setInEdit(false);
			});
	};

	return (
		<div className="flex gap-3">
			<Link href={`/profile/${comment.user.username}`}>
				<UserAvatar className="size-10" user={comment.user} />
			</Link>
			<div className="bg-background relative flex-1 space-y-2 rounded-lg p-3">
				<p className="font-medium group-hover:underline">
					{comment.user.username}
					<span className="text-muted-foreground ml-2 text-sm" suppressHydrationWarning>
						{formatDate(comment.updatedAt)}
					</span>
					{user && user.id == comment.user.id && !inEdit && (
						<Dialog>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="ghost" size="icon" className="text-muted-foreground absolute top-2 right-2 rounded-full">
										<Ellipsis />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent>
									<DropdownMenuItem onClick={() => setInEdit(true)}>
										<Pencil />
										{t('edit')}
									</DropdownMenuItem>
									<DialogTrigger asChild>
										<DropdownMenuItem variant="destructive">
											<Trash />
											{t('delete')}
										</DropdownMenuItem>
									</DialogTrigger>
								</DropdownMenuContent>
							</DropdownMenu>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>{t('delete')}</DialogTitle>
									<DialogDescription>{t('message.delete_confirmation')}</DialogDescription>
								</DialogHeader>
								<DialogFooter>
									<DialogClose asChild>
										<Button variant="outline">{t('cancel')}</Button>
									</DialogClose>
									<DialogClose asChild>
										<Button variant="destructive" onClick={handleDelete} disabled={deleting}>
											{t('delete')}
										</Button>
									</DialogClose>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					)}
				</p>
				{inEdit ? (
					<>
						<Textarea value={content} onChange={(e) => setContent(e.target.value)} />
						<div className="flex justify-end gap-2">
							<Button variant="outline" onClick={() => setInEdit(false)}>
								{t('cancel')}
							</Button>
							<Button onClick={handleEdit} disabled={isEditing}>
								{t('edit')}
							</Button>
						</div>
					</>
				) : (
					<p className="text-sm">{comment.content}</p>
				)}
			</div>
		</div>
	);
};

const CommentForm = ({ user, blogId, setComments }: CommentFormProps) => {
	const t = useTranslations('blog.comment');

	const [isLoading, setIsLoading] = useState(false);
	const [comment, setComment] = useState('');

	const { createComment } = createClientService(blogServiceInstance);

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
				<Textarea placeholder={t('comment-placeholder')} value={comment} onChange={(e) => setComment(e.target.value)} />
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
	const { getProfile } = createClientService(authServiceInstance);
	const t = useTranslations('blog.comment');

	const { data: user } = useSWR('/auth/me', getProfile);

	const [comments, setComments] = useState(blog.comments);

	return (
		<div className="bg-card mt-6 space-y-6 rounded-2xl border p-6 shadow-xs">
			<h2 className="text-2xl font-semibold">
				{t('comments')} ({comments.length})
			</h2>
			{user && <CommentForm blogId={blog.id} user={user} setComments={setComments} />}
			{comments.map((comment) => (
				<Comment key={comment.id} comment={comment} blogId={blog.id} setComments={setComments} user={user} />
			))}
		</div>
	);
};

export default Comments;
