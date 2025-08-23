'use client';

import { useState } from 'react';
import useSWR from 'swr';

import BlogCard from '~/components/blog-card';
import PaginationControls from '~/components/pagination-controls';
import { Skeleton } from '~/components/ui/skeleton';
import { createClientService } from '~/lib/service-client';
import { createBlogService } from '~/services/blog';

const List = () => {
	const { getAllBlogs } = createClientService(createBlogService);

	const [page, setPage] = useState(1);
	const [size, setSize] = useState(20);

	const { data, isLoading, error, mutate } = useSWR({ page, size }, getAllBlogs, { keepPreviousData: true });

	if (!data) {
		if (isLoading) {
			return <Skeleton className="h-140 w-full rounded-2xl" />;
		}
		throw error;
	}

	return (
		<>
			{data.blogs.map((item) => (
				<BlogCard mutate={mutate} key={item.id} data={item} />
			))}
			<PaginationControls onPageChange={setPage} onSizeChange={setSize} initialPage={1} initialSize={20} totalItems={data.total} />
		</>
	);
};

export default List;
