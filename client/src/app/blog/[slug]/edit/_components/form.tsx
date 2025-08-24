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
import { joinUrl } from '~/lib/utils';
import { createBlogService } from '~/services/blog';
import { Blog } from '~/types/blog.type';

interface Props {
	data: Blog;
}

const Form = ({ data }: Props) => {
	const t = useTranslations('blog.edit');
	const router = useRouter();
	const formRef = useRef<BlogFormRef>(null);

	const [isLoading, setIsLoading] = useState(false);

	const { updateBlog } = createClientService(createBlogService);

	const onSave = () => {
		if (!formRef.current) return;

		const title = formRef.current.title;
		const content = formRef.current.content;
		const thumbnail = formRef.current.thumbnail;
		const isThumbnailEdited = formRef.current.isThumbnailEdited;

		setIsLoading(true);

		updateBlog(data.id, {
			title,
			content: JSON.stringify(content),
			thumbnail,
			removeThumbnail: !thumbnail && isThumbnailEdited,
		})
			.then(() => {
				toast.success(t('edit_success'));
				router.push(`/blog/${data.slug}`);
			})
			.catch((error) => {
				toast.error(error.message);
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	return (
		<>
			<h1 className="mb-2 flex gap-1">
				<Breadcrumb className="mb-4">
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink href="/">{t('blogs')}</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbLink href={`/blog/${data.slug}`}>{data.title}</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>{t('edit')}</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>

				<Button onClick={onSave} className="ml-auto" disabled={isLoading}>
					<Save />
					{t('save')}
				</Button>
			</h1>
			<BlogForm
				onReady={() => {
					if (!formRef.current) return;

					if (formRef.current.titleRef.current) formRef.current.titleRef.current.value = data.title;

					if (formRef.current.editorRef.current) formRef.current.editorRef.current.commands.setContent(JSON.parse(data.content));

					if (formRef.current.thumbnailRef.current)
						formRef.current.thumbnailRef.current.setPreviewUrl(data.thumbnailUrl ? '/' + joinUrl('storage', data.thumbnailUrl) : null);
				}}
				ref={formRef}
			/>
		</>
	);
};

export default Form;
