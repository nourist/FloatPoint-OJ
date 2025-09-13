import { Highlight } from '@tiptap/extension-highlight';
import { TaskItem, TaskList } from '@tiptap/extension-list';
import { Subscript } from '@tiptap/extension-subscript';
import { Superscript } from '@tiptap/extension-superscript';
import { TextAlign } from '@tiptap/extension-text-align';
import { Typography } from '@tiptap/extension-typography';
import { Selection } from '@tiptap/extensions';
import { StarterKit } from '@tiptap/starter-kit';

import { HorizontalRule } from '~/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension';

export const extensions = [
	StarterKit.configure({
		horizontalRule: false,
		link: {
			openOnClick: false,
			enableClickSelection: true,
		},
	}),
	HorizontalRule,
	TextAlign.configure({ types: ['heading', 'paragraph'] }),
	TaskList,
	TaskItem.configure({ nested: true }),
	Highlight.configure({ multicolor: true }),
	Typography,
	Superscript,
	Subscript,
	Selection,
];
