'use client';

import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { python } from '@codemirror/lang-python';
import { githubDark } from '@uiw/codemirror-theme-github';
import CodeMirror from '@uiw/react-codemirror';
import Cookies from 'js-cookie';
import { Play } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '~/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { languageOptions } from '~/lib/language-utils';
import { createClientService } from '~/lib/service-client';
import { submissionServiceInstance } from '~/services/submission';
import { ProgramLanguage } from '~/types/submission.type';
import { Theme } from '~/types/theme.type';

interface Props {
	problemId: string;
}

const Form = ({ problemId }: Props) => {
	const t = useTranslations('submit');
	const router = useRouter();
	const theme = (Cookies.get('theme') ?? 'light') as Theme;

	const [code, setCode] = useState('');
	const [language, setLanguage] = useState('');
	const [submitting, setSubmitting] = useState(false);

	const handleSubmit = async () => {
		if (!code.trim() || !language) {
			toast.error(t('page.please_fill_all_fields'));
			return;
		}

		try {
			setSubmitting(true);
			const submissionService = createClientService(submissionServiceInstance);
			const result = await submissionService.submitCode({
				code,
				language: language as ProgramLanguage,
				problemId,
			});

			// Redirect to submission page immediately after successful submission
			router.push(`/submission/${result.submission.id}`);
		} catch (error) {
			console.error('Submission failed:', error);
			toast.error(t('page.submission_failed'), {
				description: t('page.unknown_error'),
			});
			setSubmitting(false);
		}
	};

	return (
		<div className="mt-6 overflow-hidden rounded-lg">
			<div className="bg-muted flex w-full items-center justify-between p-2">
				<Select value={language} onValueChange={setLanguage}>
					<SelectTrigger className="!bg-card" size="sm">
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
				<Button size="sm" onClick={handleSubmit} disabled={submitting || !code.trim() || !language}>
					<Play className="mr-2 h-4 w-4" />
					{submitting ? t('page.submitting') : t('page.submit')}
				</Button>
			</div>
			<CodeMirror value={code} height="500px" theme={theme == 'dark' ? githubDark : theme} extensions={[cpp(), java(), python()]} onChange={(value) => setCode(value)} />
		</div>
	);
};

export default Form;
