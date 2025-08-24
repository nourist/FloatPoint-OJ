'use client';

import { MoveLeft, Save } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

import BlogForm, { BlogFormRef } from '~/components/blog-form';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '~/components/ui/breadcrumb';
import { Button } from '~/components/ui/button';
import { createClientService } from '~/lib/service-client';
import { createBlogService } from '~/services/blog';

const CreateBlog = () => {
	const t = useTranslations('blog.create');
	const router = useRouter();

	const { createBlog } = createClientService(createBlogService);

	const [isLoading, setIsLoading] = useState(false);

	const formRef = useRef<BlogFormRef>(null);

	const onSave = () => {
		const thumbnail = formRef.current?.thumbnail;
		const title = formRef.current?.title;
		const content = formRef.current?.content;

		if (!title || !content || !content.content || content.content.length == 0) {
			toast.error(t('message.title_and_content_required'));
			return;
		}

		setIsLoading(true);

		createBlog({
			title,
			thumbnail,
			content: JSON.stringify(content),
		})
			.then((data) => {
				toast.success(t('create_success'));
				router.push(`/blog/${data.blog.slug}`);
			})
			.catch((error) => {
				toast.error(error.message);
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	return (
		<div className="max-w-app mx-auto h-full">
			<h1 className="mb-2 flex gap-1">
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink href="/">{t('blogs')}</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>{t('create')}</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>

				<Button onClick={onSave} className="ml-auto" disabled={isLoading}>
					<Save />
					{t('save')}
				</Button>
			</h1>
			<BlogForm ref={formRef} />
		</div>
	);
};

export default CreateBlog;
