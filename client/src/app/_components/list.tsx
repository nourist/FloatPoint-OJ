'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import useSWR from 'swr';

import PaginationControls from '~/components/pagination-controls';
import RichTextRenderer from '~/components/rich-text-renderer';
import { Skeleton } from '~/components/ui/skeleton';
import UserAvatar from '~/components/user-avatar';
import http from '~/lib/http-client';
import { joinUrl } from '~/lib/utils';
import { createBlogService } from '~/services/blog';

interface Props {
	total: number;
}

const List = ({ total }: Props) => {
	const { getAllBlogs } = createBlogService(http);

	const [page, setPage] = useState(1);
	const [size, setSize] = useState(20);

	const { data, isLoading, error } = useSWR({ page, size }, getAllBlogs, { keepPreviousData: true });

	if (!data) {
		if (isLoading) {
			return <Skeleton className="h-140 w-full rounded-2xl" />;
		}
		throw error;
	}

	return (
		<>
			{data.blogs.map((item) => (
				<div className="bg-card rounded-2xl border p-6 shadow-xs" key={item.id}>
					<Link href={`/profile/${item.author.username}`} className="group mb-4 flex items-center gap-2">
						<UserAvatar user={item.author} className="size-10" />
						<div className="space-y-0.5">
							<p className="font-medium group-hover:underline">{item.author.username}</p>
							<p className="text-muted-foreground text-xs">{item.createdAt.toLocaleDateString()}</p>
						</div>
					</Link>
					<Link href={`/blog/${item.slug}`} className="hover:text-primary text-2xl font-semibold hover:underline">
						{item.title}
					</Link>
					{item.thumbnailUrl && (
						<div className="bg-accent relative mt-4 h-120 w-full rounded-xl">
							<Image src={'/' + joinUrl('storage', item.thumbnailUrl)} alt={item.title} fill className="object-contain" />
						</div>
					)}
					<RichTextRenderer className="mt-4" content={JSON.parse(item.content)} />
				</div>
			))}
			<PaginationControls onPageChange={setPage} onSizeChange={setSize} initialPage={1} initialSize={20} totalItems={total} />
		</>
	);
};

export default List;
