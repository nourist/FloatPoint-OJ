'use client';

import Placeholder from '@tiptap/extension-placeholder';
import { Editor, EditorContent, EditorContext, useEditor } from '@tiptap/react';
// --- Tiptap Core Extensions ---
import * as React from 'react';

import { extensions } from './extensions';
// --- Styles ---
import '~/components/simple-editor/simple-editor.scss';
// --- Icons ---
import { ArrowLeftIcon } from '~/components/tiptap-icons/arrow-left-icon';
import { HighlighterIcon } from '~/components/tiptap-icons/highlighter-icon';
import { LinkIcon } from '~/components/tiptap-icons/link-icon';
import '~/components/tiptap-node/blockquote-node/blockquote-node.scss';
import '~/components/tiptap-node/code-block-node/code-block-node.scss';
import '~/components/tiptap-node/heading-node/heading-node.scss';
import '~/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss';
import '~/components/tiptap-node/image-node/image-node.scss';
// --- Tiptap Node ---
import '~/components/tiptap-node/list-node/list-node.scss';
import '~/components/tiptap-node/paragraph-node/paragraph-node.scss';
// --- UI Primitives ---
import { Button } from '~/components/tiptap-ui-primitive/button';
import { Spacer } from '~/components/tiptap-ui-primitive/spacer';
import { Toolbar, ToolbarGroup, ToolbarSeparator } from '~/components/tiptap-ui-primitive/toolbar';
import { BlockquoteButton } from '~/components/tiptap-ui/blockquote-button';
import { CodeBlockButton } from '~/components/tiptap-ui/code-block-button';
import { ColorHighlightPopover, ColorHighlightPopoverButton, ColorHighlightPopoverContent } from '~/components/tiptap-ui/color-highlight-popover';
// --- Tiptap UI ---
import { HeadingDropdownMenu } from '~/components/tiptap-ui/heading-dropdown-menu';
import { LinkButton, LinkContent, LinkPopover } from '~/components/tiptap-ui/link-popover';
import { ListDropdownMenu } from '~/components/tiptap-ui/list-dropdown-menu';
import { MarkButton } from '~/components/tiptap-ui/mark-button';
import { TextAlignButton } from '~/components/tiptap-ui/text-align-button';
import { UndoRedoButton } from '~/components/tiptap-ui/undo-redo-button';
import { useCursorVisibility } from '~/hooks/use-cursor-visibility';
// --- Hooks ---
import { useIsMobile } from '~/hooks/use-mobile';
import { useWindowSize } from '~/hooks/use-window-size';

const content = {
	type: 'doc',
	content: [],
};

const MainToolbarContent = ({ onHighlighterClick, onLinkClick, isMobile }: { onHighlighterClick: () => void; onLinkClick: () => void; isMobile: boolean }) => {
	return (
		<>
			<Spacer />

			<ToolbarGroup>
				<UndoRedoButton action="undo" />
				<UndoRedoButton action="redo" />
			</ToolbarGroup>

			<ToolbarSeparator />

			<ToolbarGroup>
				<HeadingDropdownMenu levels={[1, 2, 3, 4]} portal={isMobile} />
				<ListDropdownMenu types={['bulletList', 'orderedList', 'taskList']} portal={isMobile} />
				<BlockquoteButton />
				<CodeBlockButton />
			</ToolbarGroup>

			<ToolbarSeparator />

			<ToolbarGroup>
				<MarkButton type="bold" />
				<MarkButton type="italic" />
				<MarkButton type="strike" />
				<MarkButton type="code" />
				<MarkButton type="underline" />
				{!isMobile ? <ColorHighlightPopover /> : <ColorHighlightPopoverButton onClick={onHighlighterClick} />}
				{!isMobile ? <LinkPopover /> : <LinkButton onClick={onLinkClick} />}
			</ToolbarGroup>

			<ToolbarSeparator />

			<ToolbarGroup>
				<MarkButton type="superscript" />
				<MarkButton type="subscript" />
			</ToolbarGroup>

			<ToolbarSeparator />

			<ToolbarGroup>
				<TextAlignButton align="left" />
				<TextAlignButton align="center" />
				<TextAlignButton align="right" />
				<TextAlignButton align="justify" />
			</ToolbarGroup>

			<Spacer />
		</>
	);
};

const MobileToolbarContent = ({ type, onBack }: { type: 'highlighter' | 'link'; onBack: () => void }) => (
	<>
		<ToolbarGroup>
			<Button data-style="ghost" onClick={onBack}>
				<ArrowLeftIcon className="tiptap-button-icon" />
				{type === 'highlighter' ? <HighlighterIcon className="tiptap-button-icon" /> : <LinkIcon className="tiptap-button-icon" />}
			</Button>
		</ToolbarGroup>

		<ToolbarSeparator />

		{type === 'highlighter' ? <ColorHighlightPopoverContent /> : <LinkContent />}
	</>
);

type Props = {
	placeholder?: string;
	onReady: (content: Editor) => void;
};

export function SimpleEditor({ placeholder, onReady }: Props) {
	const isMobile = useIsMobile();
	const { height } = useWindowSize();
	const [mobileView, setMobileView] = React.useState<'main' | 'highlighter' | 'link'>('main');
	const toolbarRef = React.useRef<HTMLDivElement>(null);

	const editor = useEditor({
		immediatelyRender: false,
		shouldRerenderOnTransaction: false,
		editorProps: {
			attributes: {
				autocomplete: 'off',
				autocorrect: 'off',
				autocapitalize: 'off',
				'aria-label': 'Main content area, start typing to enter text.',
				class: 'simple-editor',
			},
		},
		extensions: [
			...extensions,
			Placeholder.configure({
				placeholder,
			}),
		],
		content,
	});

	const rect = useCursorVisibility({
		editor,
		overlayHeight: toolbarRef.current?.getBoundingClientRect().height ?? 0,
	});

	React.useEffect(() => {
		if (!isMobile && mobileView !== 'main') {
			setMobileView('main');
		}
	}, [isMobile, mobileView]);

	React.useEffect(() => {
		if (editor) onReady?.(editor);
	}, [editor, onReady]);

	return (
		<div className="simple-editor-wrapper">
			<EditorContext.Provider value={{ editor }}>
				<Toolbar
					ref={toolbarRef}
					style={{
						...(isMobile
							? {
									bottom: `calc(100% - ${height - rect.y}px)`,
								}
							: {}),
					}}
				>
					{mobileView === 'main' ? (
						<MainToolbarContent onHighlighterClick={() => setMobileView('highlighter')} onLinkClick={() => setMobileView('link')} isMobile={isMobile} />
					) : (
						<MobileToolbarContent type={mobileView === 'highlighter' ? 'highlighter' : 'link'} onBack={() => setMobileView('main')} />
					)}
				</Toolbar>

				<EditorContent editor={editor} role="presentation" className="simple-editor-content" />
			</EditorContext.Provider>
		</div>
	);
}
