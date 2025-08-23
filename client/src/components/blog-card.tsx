'use client';

import { Ellipsis, Pencil, Trash } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import useSWR from 'swr';

import RichTextRenderer from '~/components/rich-text-renderer';
import { Button } from '~/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '~/components/ui/dropdown-menu';
import UserAvatar from '~/components/user-avatar';
import { createClientService } from '~/lib/service-client';
import { joinUrl } from '~/lib/utils';
import { createAuthService } from '~/services/auth';
import { createBlogService } from '~/services/blog';
import { Blog } from '~/types/blog.type';

interface Props {
	data: Blog;
	mutate?: () => void;
}

const BlogCard = ({ data, mutate }: Props) => {
	const { getProfile } = createClientService(createAuthService);
	const { deleteBlog } = createClientService(createBlogService);

	const { data: user } = useSWR('/auth/me', getProfile);
	const t = useTranslations('blog.card');

	const router = useRouter();
	const [deleting, setDeleting] = useState(false);

	const handleDelete = () => {
		setDeleting(true);
		deleteBlog(data.id)
			.then(() => {
				toast.success(t('delete_success'));
				router.push('/');
				mutate?.();
			})
			.catch((error) => {
				toast.error(error.message);
			})
			.finally(() => {
				setDeleting(false);
			});
	};

	return (
		<div className="bg-card rounded-2xl border p-6 shadow-xs">
			<div className="mb-4 flex items-center justify-between">
				<Link href={`/profile/${data.author.username}`} className="group flex items-center gap-2">
					<UserAvatar user={data.author} className="size-10" />
					<div className="space-y-0.5">
						<p className="font-medium group-hover:underline">{data.author.username}</p>
						<p className="text-muted-foreground text-xs">{data.createdAt.toLocaleDateString()}</p>
					</div>
				</Link>
				{user && user.id == data.author.id && (
					<Dialog>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="icon" className="text-muted-foreground rounded-full">
									<Ellipsis className="size-5" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<DropdownMenuItem asChild>
									<Link href={`/blog/${data.slug}/edit`}>
										<Pencil />
										{t('edit')}
									</Link>
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
			</div>
			<Link href={`/blog/${data.slug}`} className="hover:text-primary text-2xl font-semibold hover:underline">
				{data.title}
			</Link>
			{data.thumbnailUrl && (
				<div className="bg-accent relative mt-4 h-120 w-full rounded-xl">
					<Image src={'/' + joinUrl('storage', data.thumbnailUrl)} alt={data.title} fill className="object-contain" />
				</div>
			)}
			<RichTextRenderer className="mt-4" content={JSON.parse(data.content)} />
		</div>
	);
};

export default BlogCard;
