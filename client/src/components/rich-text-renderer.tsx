import { generateHTML } from '@tiptap/html';
import { JSONContent } from '@tiptap/react';

import { extensions } from './simple-editor/extensions';
import { cn } from '~/lib/utils';

interface RichTextRendererProps {
	content: string | JSONContent;
	className?: string;
}

const RichTextRenderer = ({ content, className }: RichTextRendererProps) => {
	let html = '';

	if (typeof content === 'string') {
		try {
			// Try to parse as JSON first
			const jsonContent = JSON.parse(content);
			html = generateHTML(jsonContent, extensions);
		} catch (e) {
			// If parsing fails, treat as plain text
			html = content;
		}
	} else {
		html = generateHTML(content, extensions);
	}

	return <div className={cn('tiptap ProseMirror', className)} dangerouslySetInnerHTML={{ __html: html }} />;
};

export default RichTextRenderer;
