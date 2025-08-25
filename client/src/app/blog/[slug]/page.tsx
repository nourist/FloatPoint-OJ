import { getTranslations } from 'next-intl/server';

import BlogCard from '../../../components/blog-card';
import Comments from './_components/comments';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '~/components/ui/breadcrumb';
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

	const t = await getTranslations('blog.card');

	return (
		<>
			<Breadcrumb className="mb-4">
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink href="/">{t('blogs')}</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>{blog.title}</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
			<BlogCard data={blog} />
			<Comments blog={blog} />
		</>
	);
};

export default Blog;
