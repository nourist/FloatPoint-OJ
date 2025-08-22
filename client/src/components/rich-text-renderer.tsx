'use client';

import { JSONContent, generateHTML } from '@tiptap/react';
import { useEffect, useState } from 'react';

import { extensions } from './simple-editor/extensions';
import { cn } from '~/lib/utils';

interface RichTextRendererProps {
	content: JSONContent;
	className?: string;
}

const RichTextRenderer = ({ content, className }: RichTextRendererProps) => {
	const [html, setHtml] = useState<string>('');

	useEffect(() => {
		try {
			const generated = generateHTML(content, extensions);
			setHtml(generated);
		} catch (err) {
			console.error('Render error:', err);
		}
	}, [content]);

	if (!html) return null;

	return <div className={cn('tiptap ProseMirror', className)} dangerouslySetInnerHTML={{ __html: html }} />;
};

export default RichTextRenderer;
