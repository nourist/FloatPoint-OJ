import Comments from './_components/comments';
import BlogCard from '~/components/blog-card';
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

	return (
		<div className="max-w-app mx-auto my-6">
			<BlogCard data={blog} />
			<Comments blog={blog} />
		</div>
	);
};

export default Blog;
