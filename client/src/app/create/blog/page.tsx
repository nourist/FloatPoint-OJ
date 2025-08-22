'use client';

import { Editor } from '@tiptap/react';
import { MoveLeft, Save } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

import { ImageUpload, ImageUploadRef } from '~/components/image-upload';
import SimpleEditor from '~/components/simple-editor';
import { Button } from '~/components/ui/button';
import { createClientService } from '~/lib/service-client';
import { createBlogService } from '~/services/blog';

const CreateBlog = () => {
	const t = useTranslations('create.blog');
	const router = useRouter();

	const { createBlog } = createClientService(createBlogService);

	const [isLoading, setIsLoading] = useState(false);

	const titleRef = useRef<HTMLInputElement>(null);
	const imageUploadRef = useRef<ImageUploadRef>(null);
	const editorRef = useRef<Editor>(null);

	const onSave = () => {
		setIsLoading(true);

		const thumbnail = imageUploadRef.current?.getFile() ?? undefined;
		const title = titleRef.current?.value;
		const content = editorRef.current?.getJSON();

		if (!title || !content || content.content.length == 0) {
			toast.error(t('message.title_and_content_required'));
			return;
		}

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
		<div className="max-w-app mx-auto my-6 h-full">
			<h1 className="mb-6 flex items-center gap-1 text-xl font-semibold">
				<Button variant="ghost" size="icon" className="text-muted-foreground rounded-full" asChild>
					<Link href="/">
						<MoveLeft className="size-5" />
					</Link>
				</Button>

				{t('create_blog')}
				<Button onClick={onSave} className="ml-auto" disabled={isLoading}>
					<Save />
					{t('save')}
				</Button>
			</h1>
			<div className="flex h-full flex-wrap gap-6">
				<div className="w-sm">
					<input ref={titleRef} type="text" className="peer w-full py-1 text-2xl font-medium outline-none" placeholder={t('title_placeholder')} />
					<div className="bg-border peer-focus:bg-ring mb-6 h-0.5 transition-all"></div>
					<ImageUpload ref={imageUploadRef} title={t('upload_thumbnail')} />
				</div>
				<div className="bg-card max-h-[calc(100vh-164px)] flex-1 rounded-xl border py-2 shadow-xs">
					<SimpleEditor onReady={(editor) => (editorRef.current = editor)} placeholder={t('description_placeholder')} />
				</div>
			</div>
		</div>
	);
};

export default CreateBlog;
