import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { Select, SelectTrigger, SelectContent, SelectGroup, SelectItem, SelectValue } from '~/components/ui/select';
import { toast } from 'react-toastify';
import { Toggle } from '~/components/ui/toggle';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { UserCheck, Search, RotateCcw } from 'lucide-react';

import useAuthStore from '~/stores/authStore';
import { getLanguages } from '~/services/problem';
import { getSubmissions } from '~/services/submission';
import useDebounce from '~/hooks/useDebounce';

const Submissions = () => {
	const { t } = useTranslation('submissions');
	const { isAuth, user } = useAuthStore();

	const [languages, setLanguages] = useState([]);

	const [submissions, setSubmissions] = useState([]);
	const [status, setStatus] = useState();
	const [language, setLanguage] = useState();
	const [mine, setMine] = useState(false);
	const [search, setSearch] = useState('');
	const searchValue = useDebounce(search, 400);
	
	const query = () => {
		const authorValue = mine ? user.name : null;
		getSubmissions({ status: status?.toUpperCase(), author: authorValue, language, problem: searchValue })
			.then((res) => {
				setSubmissions(res.data);
			})
			.catch((err) => {
				toast.error(err.response.data.msg);
			});
	}

	useEffect(() => {
		getLanguages()
			.then((res) => {
				setLanguages(res.data);
			})
			.catch((err) => {
				toast.error(err.response.data.msg);
			});
	}, []);

	useEffect(() => {
		query();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [status, language, mine, searchValue]);

	return (
		<div className="flex-1 mx-14 my-8 flex-row flex gap-4">
			<div className="flex-1">
				<div className="flex gap-2">
					{isAuth && (
						<Toggle className="capitalize dark:text-gray-100 dark:hover:bg-neutral-800 hover:!text-sky-500" pressed={mine} onPressedChange={setMine}>
							<UserCheck></UserCheck>
							{t('mine')}
						</Toggle>
					)}
					<Select onValueChange={setStatus}>
						<SelectTrigger className="w-[180px] dark:!bg-[rgb(55,55,55)] bg-gray-200 text-gray-700 dark:!text-gray-200 border-none">
							<SelectValue />
						</SelectTrigger>
						<SelectContent className="dark:!bg-[rgb(55,55,55)] border-none">
							<SelectGroup>
								<SelectItem className="h-10 dark:hover:!bg-neutral-700 dark:focus:!bg-neutral-700 px-3">
									<span className="capitalize text-gray-700 dark:text-gray-300">{t('status')}</span>
								</SelectItem>
								<SelectItem className="h-10 dark:hover:!bg-neutral-700 dark:focus:!bg-neutral-700 px-3" value="ac">
									<span className="capitalize text-green-500">{t('ac')}</span>
								</SelectItem>
								<SelectItem className="h-10 dark:hover:!bg-neutral-700 dark:focus:!bg-neutral-700 px-3" value="tle">
									<span className="capitalize text-yellow-500">{t('tle')}</span>
								</SelectItem>
								<SelectItem className="h-10 dark:hover:!bg-neutral-700 dark:focus:!bg-neutral-700 px-3" value="mle">
									<span className="capitalize text-blue-500">{t('mle')}</span>
								</SelectItem>
								<SelectItem className="h-10 dark:hover:!bg-neutral-700 dark:focus:!bg-neutral-700 px-3" value="rte">
									<span className="capitalize text-orange-500">{t('rte')}</span>
								</SelectItem>
								<SelectItem className="h-10 dark:hover:!bg-neutral-700 dark:focus:!bg-neutral-700 px-3" value="ce">
									<span className="capitalize text-gray-500">{t('ce')}</span>
								</SelectItem>
								<SelectItem className="h-10 dark:hover:!bg-neutral-700 dark:focus:!bg-neutral-700 px-3" value="wa">
									<span className="capitalize text-red-500">{t('wa')}</span>
								</SelectItem>
								<SelectItem className="h-10 dark:hover:!bg-neutral-700 dark:focus:!bg-neutral-700 px-3" value="ie">
									<span className="capitalize text-purple-600">{t('ie')}</span>
								</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
					<Select onValueChange={setLanguage}>
						<SelectTrigger className="w-[180px] dark:!bg-[rgb(55,55,55)] bg-gray-200 text-gray-700 dark:!text-gray-200 border-none">
							<SelectValue />
						</SelectTrigger>
						<SelectContent className="dark:!bg-[rgb(55,55,55)] border-none">
							<SelectGroup>
								<SelectItem className="h-10 dark:hover:!bg-neutral-700 dark:focus:!bg-neutral-700 px-3">
									<span className="capitalize text-gray-700 dark:text-gray-300">{t('language')}</span>
								</SelectItem>
								{languages.map((item, index) => (
									<SelectItem className="h-10 dark:hover:!bg-neutral-700 dark:focus:!bg-neutral-700 px-3" value={item} key={index}>
										<span className="capitalize text-gray-700 dark:text-gray-300">{item}</span>
									</SelectItem>
								))}
							</SelectGroup>
						</SelectContent>
					</Select>
					<div className="relative flex-1 max-w-96 dark:text-gray-200 ml-auto">
						<Search className="absolute size-4 m-[10px]"></Search>
						<Input
							className="flex-1 pl-10 bg-gray-200 dark:!bg-[rgb(55,55,55)] border-none"
							value={search}
							placeholder={t('search-placeholder')}
							onChange={(e) => setSearch(e.target.value)}
						></Input>
					</div>
					<Button onClick={query} className="!bg-sky-400 capitalize !text-white font-light hover:!bg-sky-500">
						<RotateCcw></RotateCcw>
						{t('refresh')}
					</Button>
				</div>
			</div>
			<div className="w-64 bg-red-600"></div>
		</div>
	);
};

export default Submissions;
