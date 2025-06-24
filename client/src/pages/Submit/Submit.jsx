import { Editor } from '@monaco-editor/react';
import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { Button } from '~/components/ui/button';
import { Loader2, Code } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogClose, DialogDescription, DialogTitle, DialogFooter } from '~/components/ui/dialog';
import { Link } from 'react-router';

import codeTemplate from '~/config/codeTemplate';
import editorConfig from '~/config/editor';
import { submit } from '~/services/submission';
import useThemeStore from '~/stores/themeStore';
import useAuthStore from '~/stores/authStore';
import { getProblems } from '~/services/problem';
import Combobox from '~/components/Combobox';
import Select from '~/components/Select';
import routesConfig from '~/config/routes';

const Submit = () => {
	const { theme } = useThemeStore();
	const [params] = useSearchParams();
	const { t } = useTranslation('submit');
	const { user } = useAuthStore();

	const openDialogRef = useRef(null);

	const [src, setSrc] = useState('');
	const [problem, setProblem] = useState();
	const [language, setLanguage] = useState(user.defaultLanguage || 'c++17');
	const [languageType, setLanguageType] = useState();
	const [problems, setProblems] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [submission, setSubmission] = useState(null);

	const languageValue = { c: 'c', c11: 'c', 'c++11': 'cpp', 'c++14': 'cpp', 'c++17': 'cpp', 'c++20': 'cpp', python2: 'python', python3: 'python' };

	const handleUpload = (e) => {
		const file = e.target.files[0];

		if (!file) return;

		const reader = new FileReader();
		reader.onload = function (e) {
			const text = e.target.result;
			setSrc(text);
		};
		reader.readAsText(file);
	};

	const handleSubmit = () => {
		setIsLoading(true);
		submit({ src, problem, language, contest: user.joiningContest })
			.then((res) => {
				setSubmission(res.data);
				openDialogRef.current.click();
			})
			.catch((err) => toast.error(err.response.data.msg))
			.finally(() => setIsLoading(false));
	};

	useEffect(() => {
		setProblem(params.get('problem'));
	}, [params]);

	useEffect(() => {
		setLanguageType(languageValue[language]);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [language]);

	useEffect(() => {
		setSrc(codeTemplate[languageType]);
	}, [languageType]);

	useEffect(() => {
		getProblems({ page: 1, size: 1e9, minimal: true })
			.then((res) => setProblems(res.data))
			.catch((err) => toast.error(err.response.data.msg));
	}, []);

	return (
		<div className="flex flex-1 gap-4 px-12 py-8">
			<div className="ml-6 flex flex-1 flex-col overflow-hidden rounded-md shadow-md">
				<div className="flex h-10 items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-2 dark:border-gray-700 dark:bg-gray-800">
					<div className="flex items-center gap-2">
						<Code size={18} className="text-blue-500" />
						<span className="font-medium text-gray-700 dark:text-gray-200">{t('code-editor')}</span>
					</div>
					<div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
						<span>{language}</span>
					</div>
				</div>
				<Editor
					className="shadow-md"
					language={languageValue[language]}
					value={src}
					onChange={setSrc}
					options={editorConfig}
					theme={theme == 'dark' ? 'vs-dark' : 'light'}
				></Editor>
			</div>
			<div className="flex w-52 flex-col justify-between">
				<div className="space-y-3">
					<Select
						defaultValue={user.defaultLanguage || 'c++17'}
						triggerClassname="w-full bg-white border border-gray-200"
						setValue={setLanguage}
						data={Object.keys(languageValue).map((item) => ({ value: item, label: <span className="capitalize text-gray-700 dark:text-gray-300">{item}</span> }))}
					></Select>
					<div className="flex w-full items-center justify-center">
						<label
							htmlFor="dropzone-file-13617263816"
							className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-blue-300 bg-blue-50 transition-colors hover:bg-blue-100 dark:border-blue-700 dark:bg-[#1e293b] dark:hover:border-blue-500 dark:hover:bg-[#273449]"
						>
							<div className="flex flex-col items-center justify-center pb-6 pt-5">
								<svg
									className="mb-4 h-8 w-8 text-blue-500 dark:text-blue-400"
									aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 20 16"
								>
									<path
										stroke="currentColor"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
									/>
								</svg>
								<p className="mb-2 text-center text-sm text-blue-600 dark:text-blue-300">{t('upload-placeholder')}</p>
							</div>
							<input id="dropzone-file-13617263816" accept=".txt,.py,.cpp,.c" onChange={handleUpload} type="file" className="hidden" />
						</label>
					</div>
				</div>
				<div className="space-y-2">
					<Combobox
						triggerClassname="w-full"
						label={t('select-problem')}
						value={problem}
						setValue={setProblem}
						data={problems.map((item) => ({ value: item, label: item }))}
					></Combobox>
					<Button
						disabled={isLoading}
						className="h-9 w-full bg-gradient-to-r from-sky-400 to-blue-500 font-bold capitalize !text-white transition-all duration-200 hover:ring-2 hover:ring-sky-400 hover:ring-opacity-50"
						onClick={handleSubmit}
					>
						{isLoading ? <Loader2 className="animate-spin" /> : t('submit')}
					</Button>
				</div>
			</div>
			<Dialog>
				<DialogTrigger asChild>
					<button ref={openDialogRef} className="hidden"></button>
				</DialogTrigger>
				<DialogContent className="dark:!border-neutral-800 dark:!bg-neutral-900">
					<DialogHeader>
						<DialogTitle className="dark:text-white">{t('submit-success')}</DialogTitle>
						<DialogDescription>{t('submit-success-msg')} </DialogDescription>
					</DialogHeader>
					<DialogFooter className="sm:justify-start">
						<DialogClose asChild>
							<Button type="button" variant="secondary" className="capitalize dark:!bg-neutral-800 dark:hover:!bg-neutral-700">
								{t('close')}
							</Button>
						</DialogClose>
						<Button asChild type="button" variant="secondary" className="bg-gradient-to-r from-sky-400 to-blue-500 text-white hover:!from-sky-300 hover:!to-blue-400">
							<Link to={routesConfig.submission.replace(':id', submission?._id)}>{t('show')}</Link>
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default Submit;
