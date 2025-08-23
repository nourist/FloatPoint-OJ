import { MoveLeft } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

import BlogCard from '../../../components/blog-card';
import Comments from './_components/comments';
import { Button } from '~/components/ui/button';
import { createServerService } from '~/lib/service-server';
import { createBlogService } from '~/services/blog';

interface Props {
	params: Promise<{ slug: string }>;
}

const Blog = async ({ params }: Props) => {
	const { slug } = await params;

	const blogService = await createServerService(createBlogService);

	const blog = await blogService
		.getBlogBySlug(slug)
		.then((res) => ({ ...res, comments: res.comments.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()) }));

	const t = await getTranslations('blog');

	return (
		<>
			<h1 className="mb-2 flex items-center gap-1">
				<Button variant="ghost" size="icon" className="text-muted-foreground rounded-full" asChild>
					<Link href="/">
						<MoveLeft />
					</Link>
				</Button>
				{t('back')}
			</h1>
			<BlogCard data={blog} />
			<Comments blog={blog} />
		</>
	);
};

export default Blog;
