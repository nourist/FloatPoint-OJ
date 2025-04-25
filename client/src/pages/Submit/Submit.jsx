import { Editor } from '@monaco-editor/react';
import { useState } from 'react';

import editorConfig from '~/config/editor';
import { submit } from '~/services/submission';
import useThemeStore from '~/stores/themeStore';

const Submit = () => {
	const { theme } = useThemeStore();
	const [src, setSrc] = useState('');

	return (
		<div className="flex-1 flex px-12 py-8 gap-4">
			<div className="flex-1 ml-6 rounded-md overflow-hidden">
				<Editor
					className="shadow-md"
					defaultLanguage="cpp"
					defaultValue={src}
					onChange={setSrc}
					options={editorConfig}
					theme={theme == 'dark' ? 'vs-dark' : 'light'}
				></Editor>
			</div>
			<div className="w-52"></div>
		</div>
	);
};

export default Submit;
