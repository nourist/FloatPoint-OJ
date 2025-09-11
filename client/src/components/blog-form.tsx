import { Editor, JSONContent } from '@tiptap/react';
import { useTranslations } from 'next-intl';
import { RefObject, forwardRef, useImperativeHandle, useRef } from 'react';

import { ImageUpload, ImageUploadRef } from '~/components/image-upload';
import SimpleEditor from '~/components/simple-editor';

export interface BlogFormRef {
	title?: string;
	thumbnail?: File;
	content?: JSONContent;
	isThumbnailEdited?: boolean;
	titleRef: RefObject<HTMLInputElement | null>;
	thumbnailRef: RefObject<ImageUploadRef | null>;
	editorRef: RefObject<Editor | null>;
}

interface BlogFormProps {
	onReady?: () => void;
}

const BlogForm = forwardRef<BlogFormRef, BlogFormProps>((props, ref) => {
	const t = useTranslations('blog.create');

	const titleRef = useRef<HTMLInputElement>(null);
	const imageUploadRef = useRef<ImageUploadRef>(null);
	const editorRef = useRef<Editor>(null);

	useImperativeHandle(ref, () => ({
		get title() {
			return titleRef.current?.value;
		},
		get thumbnail() {
			return imageUploadRef.current?.getFile() ?? undefined;
		},
		get content() {
			return editorRef.current?.getJSON();
		},
		get isThumbnailEdited() {
			return imageUploadRef.current?.getIsEdited() ?? false;
		},
		titleRef: titleRef,
		thumbnailRef: imageUploadRef,
		editorRef: editorRef,
	}));

	return (
		<div className="flex h-full flex-wrap gap-6">
			<div className="w-sm">
				<input ref={titleRef} type="text" className="peer w-full py-1 text-2xl font-medium outline-none" placeholder={t('title_placeholder')} />
				<div className="bg-border peer-focus:bg-ring mb-6 h-0.5 transition-all"></div>
				<ImageUpload ref={imageUploadRef} title={t('upload_thumbnail')} />
			</div>
			<div className="bg-card max-h-[calc(100vh-164px)] flex-1 rounded-xl border shadow-xs overflow-hidden">
				<SimpleEditor
					onReady={(editor) => {
						editorRef.current = editor;
						props.onReady?.();
					}}
					placeholder={t('description_placeholder')}
				/>
			</div>
		</div>
	);
});

BlogForm.displayName = 'BlogForm';

export default BlogForm;
