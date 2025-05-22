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
import Pagination from '~/components/Pagination';
import ChipList from '~/components/ChipList';
import Error from '~/components/Error';

const Problem = () => {
	const { t } = useTranslation('problem');

	const [difficulty, setDifficulty] = useState();
	const [tags, setTags] = useState([]);
	const [search, setSearch] = useState('');
	const [page, setPage] = useState(1);
	const [perPage, setPerPage] = useState(50);
	const [maxPage, setMaxPage] = useState(1);
	const q = useDebounce(search, 400);

	const {
		data: problems,
		isLoading: problemsLoading,
		isError: problemsErr,
	} = useQuery({
		queryKey: ['problems', { tags, q, difficulty, perPage, page }],
		queryFn: () => getProblems({ tags, q, difficulty, size: perPage, page }),
	});
	const problemSmoothLoading = useDebounce(problemsLoading, 50);

	const {
		data: tagList,
		isLoading: tagsLoading,
		isError: tagsErr,
	} = useQuery({
		queryKey: ['tags'],
		queryFn: getTags,
	});

	useEffect(() => {
		if (problems) {
			setMaxPage(Math.max(problems.maxPage, 1));
		}
	}, [problems]);

	if (tagsErr) return (
		<div className="min-h-[100vh]">
			<Error keys={[['tags']]}>{tagsErr}</Error>
		</div>
	);
	if (problemsErr) return (
		<div className="min-h-[100vh]">
			<Error keys={[['problems', { tags, q, difficulty, perPage, page }]]}>{problemsErr}</Error>
		</div>
	);

	return (
		<div className="min-h-[100vh]">
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
						{problemSmoothLoading
							? [...Array(perPage)].map((_, index) => (
									<tr key={index} className="skeleton odd:skeleton-variant h-16">
										{[...Array(9)].map((_, index) => (
											<td key={index} className="p-4"></td>
										))}
									</tr>
								))
							: problems?.data?.map((item, index) => (
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
										<td className="max-w-sm p-4 text-sm md:max-w-xs">
											<ChipList data={item.tags} activeTags={tags} />
										</td>
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
			<div className="mt-4 flex flex-wrap gap-2">
				<Select
					prefix={t('per-page')}
					value={perPage}
					clearable={false}
					setValue={setPerPage}
					className="mr-auto"
					data={[...Array(4)].map((_, i) => (i + 1) * 25).map((i) => ({ value: i, label: i }))}
				/>
				<Pagination maxPage={maxPage} page={page} setPage={setPage} />
			</div>
		</div>
	);
};

export default Problem;
