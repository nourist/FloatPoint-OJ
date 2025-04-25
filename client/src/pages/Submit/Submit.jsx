import { Editor } from '@monaco-editor/react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { Select, SelectItem, SelectGroup, SelectContent, SelectTrigger, SelectValue } from '~/components/ui/select';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import codeTemplate from '~/config/codeTemplate';
import editorConfig from '~/config/editor';
import { submit } from '~/services/submission';
import useThemeStore from '~/stores/themeStore';
import useAuthStore from '~/stores/authStore';
import { getProblems } from '~/services/problem';
import Combobox from '~/components/Combobox';

const Submit = () => {
	const { theme } = useThemeStore();
	const [params] = useSearchParams();
	const { t } = useTranslation('submit');
	const { user } = useAuthStore();

	const [src, setSrc] = useState('');
	const [problem, setProblem] = useState();
	const [language, setLanguage] = useState(user.defaultLanguage || 'c++17');
	const [languageType, setLanguageType] = useState();
	const [problems, setProblems] = useState([]);

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

	const handleSubmit = () => {};

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
		<div className="flex-1 flex px-12 py-8 gap-4">
			<div className="flex-1 ml-6 rounded-md overflow-hidden">
				<Editor
					className="shadow-md"
					language={languageValue[language]}
					value={src}
					onChange={setSrc}
					options={editorConfig}
					theme={theme == 'dark' ? 'vs-dark' : 'light'}
				></Editor>
			</div>
			<div className="w-52 space-y-4">
				<Select defaultValue={user.defaultLanguage || 'c++17'} onValueChange={setLanguage}>
					<SelectTrigger className="w-full dark:!bg-[rgb(55,55,55)] bg-gray-200 text-gray-700 dark:!text-gray-200 border-none">
						<SelectValue placeholder={t('language')} />
					</SelectTrigger>
					<SelectContent className="dark:!bg-[rgb(55,55,55)] border-none">
						<SelectGroup>
							{Object.keys(languageValue).map((item, index) => (
								<SelectItem key={index} value={item} className="h-10 dark:hover:!bg-neutral-700 dark:focus:!bg-neutral-700 px-3">
									<span className="capitalize text-gray-700 dark:text-gray-300">{item}</span>
								</SelectItem>
							))}
						</SelectGroup>
					</SelectContent>
				</Select>
				<div className="flex items-center justify-center w-full">
					<label
						htmlFor="dropzone-file-13617263816"
						className="flex flex-col items-center justify-center w-full h-32 border-2 border-blue-300 border-dashed rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 transition-colors
			dark:bg-[#1e293b] dark:border-blue-700 dark:hover:border-blue-500 dark:hover:bg-[#273449]"
					>
						<div className="flex flex-col items-center justify-center pt-5 pb-6">
							<svg className="w-8 h-8 mb-4 text-blue-500 dark:text-blue-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
								<path
									stroke="currentColor"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
								/>
							</svg>
							<p className="text-center mb-2 text-sm text-blue-600 dark:text-blue-300">{t('upload-placeholder')}</p>
						</div>
						<input id="dropzone-file-13617263816" accept=".txt,.py,.cpp,.c" onChange={handleUpload} type="file" className="hidden" />
					</label>
				</div>
				<Combobox value={problem} setValue={setProblem} data={problems.map((item) => ({ value: item, label: item }))}></Combobox>
			</div>
		</div>
	);
};

export default Submit;
