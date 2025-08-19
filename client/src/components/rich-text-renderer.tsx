import { JSONContent, generateHTML } from '@tiptap/react';

import { extensions } from './simple-editor/simple-editor';
import { cn } from '~/lib/utils';

interface RichTextRendererProps {
	content: JSONContent;
	className?: string;
}

const RichTextRenderer = ({ content, className }: RichTextRendererProps) => {
	const html = generateHTML(content, extensions);
	return <div className={cn('tiptap ProseMirror', className)} dangerouslySetInnerHTML={{ __html: html }} />;
};

export default RichTextRenderer;
