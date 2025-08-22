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
		<>
			<BlogCard data={blog} />
			<Comments blog={blog} />
		</>
	);
};

export default Blog;
