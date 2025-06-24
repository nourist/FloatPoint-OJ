import { memo } from 'react';

import {
	MDXEditor,
	headingsPlugin,
	listsPlugin,
	quotePlugin,
	thematicBreakPlugin,
	toolbarPlugin,
	UndoRedo,
	BoldItalicUnderlineToggles,
	ListsToggle,
	CreateLink,
	InsertImage,
	InsertTable,
	tablePlugin,
	imagePlugin,
	linkDialogPlugin,
	BlockTypeSelect,
	diffSourcePlugin,
	DiffSourceToggleWrapper,
	markdownShortcutPlugin,
	InsertThematicBreak,
	Separator,
	codeBlockPlugin,
	codeMirrorPlugin,
} from '@mdxeditor/editor';

const MdEditor = ({ ...props }) => {
	return (
		<MDXEditor
			className="border-blue-gray-200 dark:border-blue-gray-800 rounded-md border"
			plugins={[
				headingsPlugin(),
				listsPlugin(),
				quotePlugin(),
				thematicBreakPlugin(),
				tablePlugin(),
				imagePlugin(),
				linkDialogPlugin(),
				diffSourcePlugin(),
				markdownShortcutPlugin(),
				codeBlockPlugin(),
				codeMirrorPlugin(),
				toolbarPlugin({
					toolbarContents: () => (
						<>
							<UndoRedo />
							<Separator />
							<BoldItalicUnderlineToggles />
							<Separator />
							<BlockTypeSelect />
							<Separator />
							<ListsToggle />
							<Separator />
							<CreateLink />
							<InsertImage />
							<InsertTable />
							<Separator />
							<InsertThematicBreak />
							<DiffSourceToggleWrapper />
						</>
					),
				}),
			]}
			{...props}
		/>
	);
};

export default memo(MdEditor);
