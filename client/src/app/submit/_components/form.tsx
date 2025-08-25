'use client';

import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { python } from '@codemirror/lang-python';
import CodeMirror from '@uiw/react-codemirror';
import Cookies from 'js-cookie';
import { Play } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Button } from '~/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { languageOptions } from '~/lib/language-utils';
import { Theme } from '~/types/theme.type';

interface Props {
	problemId: string;
}

const Form = ({ problemId }: Props) => {
	const t = useTranslations('submit');
	const theme = (Cookies.get('theme') ?? 'light') as Theme;

	const [code, setCode] = useState('');
	const [language, setLanguage] = useState('');

	return (
		<div className="mt-6 overflow-hidden rounded-lg">
			<div className="bg-accent flex w-full items-center justify-between p-2">
				<Select value={language} onValueChange={setLanguage}>
					<SelectTrigger size="sm">
						<SelectValue placeholder={t('page.select_language')} />
					</SelectTrigger>
					<SelectContent>
						{languageOptions.map((option) => (
							<SelectItem key={option.value} value={option.value} className="font-medium">
								{option.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<Button size="sm">
					<Play />
					{t('page.submit')}
				</Button>
			</div>
			<CodeMirror value={code} height="500px" theme={theme} extensions={[cpp(), java(), python()]} onChange={(value) => setCode(value)} />
		</div>
	);
};

export default Form;
