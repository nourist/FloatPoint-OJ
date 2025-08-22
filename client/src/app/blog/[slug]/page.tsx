import { MoveLeft } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

import Comments from './_components/comments';
import BlogCard from '~/components/blog-card';
import { Button } from '~/components/ui/button';
import { createServerApiInstance } from '~/lib/http-server';
import { createBlogService } from '~/services/blog';

interface Props {
	params: Promise<{ slug: string }>;
}

const Blog = async ({ params }: Props) => {
	const { slug } = await params;

	const http = await createServerApiInstance();
	const blogService = createBlogService(http);

	const blog = await blogService.getBlogBySlug(slug);

	const t = await getTranslations('blog');

	return (
		<>
			<h1 className="mb-6 flex items-center gap-1">
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
