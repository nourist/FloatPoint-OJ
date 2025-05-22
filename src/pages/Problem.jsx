import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Input, Button, IconButton, Tooltip } from '@material-tailwind/react';
import { Search, Plus, Lock, LockOpen, Trash, Pencil } from 'lucide-react';
import { Link } from 'react-router';

import Select from '~/components/Select';
import MultiSelect from '~/components/MultiSelect';
import { getProblems, getTags } from '~/services/problem';
import useDebounce from '~/hooks/useDebounce';

const Problem = () => {
	const { t } = useTranslation('problem');

	const [showDial, setShowDial] = useState(false);

	const [difficulty, setDifficulty] = useState();
	const [tags, setTags] = useState([]);
	const [search, setSearch] = useState('');
	const q = useDebounce(search, 400);

	useEffect(() => {
		window.addEventListener('scroll', () => {
			setShowDial(window.scrollY > 160);
		});
		return () => {
			window.removeEventListener('scroll', () => {
				setShowDial(window.scrollY > 160);
			});
		};
	}, []);

	const {
		data: problems,
		isLoading: problemsLoading,
		isError: problemsErr,
	} = useQuery({
		queryKey: ['problems', { tags, q, difficulty }],
		queryFn: () => getProblems({ tags, q, difficulty }),
	});

	const {
		data: tagList,
		isLoading: tagsLoading,
		isError: tagsErr,
	} = useQuery({
		queryKey: ['tags'],
		queryFn: getTags,
	});

	console.log('problem', problems);

	return (
		<div>
			<IconButton data-hide={!showDial} size="lg" className="bg-primary group !fixed right-8 bottom-10 z-20 cursor-pointer rounded-full data-[hide=true]:hidden">
				<Plus strokeWidth="1.5" size="24" color="#fff" className="transition-all duration-200 group-hover:!size-8" />
			</IconButton>
			<div className="mb-4 flex flex-wrap gap-2">
				<Select
					value={difficulty}
					setValue={setDifficulty}
					data={[
						{ value: 'easy', label: <div className="text-success">{t('easy')}</div> },
						{ value: 'medium', label: <div className="text-warning">{t('medium')}</div> },
						{ value: 'hard', label: <div className="text-error">{t('hard')}</div> },
					]}
					label={t('difficulty')}
				/>
				<MultiSelect loading={tagsLoading} value={tags} setValue={setTags} label={t('tags')} data={tagList?.map((item) => ({ value: item[0], label: item[0] }))} />
				<div className="max-w-sm">
					<Input data-label="true" label={t('search')} value={search} onChange={(e) => setSearch(e.target.value)} icon={<Search size="16" />} />
				</div>
				<Button className="bg-primary ml-auto flex !h-10 cursor-pointer items-center gap-1 capitalize">
					<Plus size="18" />
					{t('create-new')}
				</Button>
			</div>
			<div className="shadow-clg shadow-shadow-color/5 w-full overflow-auto rounded-xl">
				<table className="w-full min-w-max table-auto text-left">
					<thead>
						<tr>
							{[t('id'), t('name'), t('private'), t('tags'), t('difficulty'), t('point'), t('#ac').toUpperCase(), t('%ac').toUpperCase(), ''].map((item, index) => (
								<th key={index} className="border-base-content/30 bg-blue-gray-50 dark:bg-base-300 border-b p-4 text-sm capitalize dark:text-white">
									{item}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{problems?.data?.map((item, index) => (
							<tr key={index} className="even:bg-blue-gray-50/50 dark:bg-base-200 dark:even:bg-base-100 dark:text-base-content/80">
								<td className="text-blue-gray-900 p-4 text-sm dark:text-white">#{item.id}</td>
								<td className="p-4 text-sm">
									<Link to={`/problem/${item.id}`} className="text-blue-gray-900 hover:!text-secondary dark:text-white">
										{item.name}
									</Link>
								</td>
								<td className="p-4 text-sm">
									<Tooltip content={item.public ? t('close-it') : t('open-it')} placement="top">
										<IconButton size="sm" className="group !shadow-cmd cursor-pointer rounded-full bg-transparent">
											{item.public ? (
												<LockOpen size="18" className="text-success mx-3 transition-all duration-300 group-hover:mb-1" />
											) : (
												<Lock size="18" className="text-error transition-all duration-300 group-hover:mb-1" />
											)}
										</IconButton>
									</Tooltip>
								</td>
								<td className="p-4 text-sm">{item.tags}</td>
								<td
									data-difficulty={item.difficulty}
									className="data-[difficulty=medium]:text-warning data-[difficulty=hard]:text-error text-success p-4 text-sm capitalize"
								>
									{item.difficulty}
								</td>
								<td className="p-4 text-sm">{item.point}p</td>
								<td className="p-4 text-sm">{item.noOfSuccess}</td>
								<td className="p-4 text-sm">{item.noOfSubm == 0 ? 0 : Math.round((item.noOfSuccess / item.noOfSubm) * 100)}%</td>
								<td className="space-x-3 p-4 text-sm">
									<Tooltip content={t('edit')}>
										<IconButton size="sm" className="bg-info hover:!shadow-cmd cursor-pointer rounded-full">
											<Pencil color="#fff" size="16" />
										</IconButton>
									</Tooltip>
									<Tooltip content={t('delete')}>
										<IconButton size="sm" className="bg-error hover:!shadow-cmd cursor-pointer rounded-full">
											<Trash color="#fff" size="16" />
										</IconButton>
									</Tooltip>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default Problem;
