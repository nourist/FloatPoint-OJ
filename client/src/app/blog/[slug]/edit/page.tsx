import Form from './_components/form';
import { createServerService } from '~/lib/service-server';
import { createBlogService } from '~/services/blog';

interface Props {
	params: Promise<{ slug: string }>;
}

const EditBlog = async ({ params }: Props) => {
	const { slug } = await params;

	const blogService = await createServerService(createBlogService);

	const blog = await blogService.getBlogBySlug(slug);

	return <Form data={blog} />;
};

export default EditBlog;
