import { useQuery } from '@tanstack/react-query';
import { useState, useEffect, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, IconButton, Dialog, DialogHeader, DialogBody, DialogFooter, Tooltip } from '@material-tailwind/react';
import { Search, Plus, Lock, LockOpen, Trash, Pencil } from 'lucide-react';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router';
import PropTypes from 'prop-types';

import Select from '~/components/Select';
import MultiSelect from '~/components/MultiSelect';
import { getProblems, getTags, editProblem, deleteProblem } from '~/services/problem';
import useDebounce from '~/hooks/useDebounce';
import Pagination from '~/components/Pagination';
import ChipList from '~/components/ChipList';
import Error from '~/components/Error';
import FullOutlineInput from '~/components/FullOutlineInput';

// eslint-disable-next-line react/display-name, react/prop-types
const TableSkeleton = memo(({ perPage }) =>
	[...Array(perPage)].map((_, index) => (
		<tr key={index} className="skeleton odd:skeleton-variant h-16">
			{[...Array(9)].map((_, idx) => (
				<td key={idx} className="p-4"></td>
			))}
		</tr>
	)),
);

// eslint-disable-next-line react/display-name
const TableRow = memo(({ item, setSelectId, setOpenDeleteDialog, setPrivatePublicDialog, tags, t }) => (
	<tr className="even:bg-base-200 dark:bg-base-200 dark:even:bg-base-100 bg-base-100 text-base-content/80">
		<td className="text-blue-gray-900 p-4 text-sm dark:text-white">#{item.id}</td>
		<td className="p-4 text-sm">
			<Link to={`/problem/${item.id}`} className="hover:!text-secondary hover:underline">
				{item.name}
			</Link>
		</td>
		<td className="p-4 text-sm">
			<Tooltip content={item.public ? t('close-it') : t('open-it')} placement="top">
				<IconButton
					onClick={() => {
						setSelectId(item.id);
						setPrivatePublicDialog(true);
					}}
					size="sm"
					className="!shadow-cmd group cursor-pointer rounded-full bg-transparent"
				>
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
		<td data-difficulty={item.difficulty} className="data-[difficulty=medium]:text-warning data-[difficulty=hard]:text-error text-success p-4 text-sm capitalize">
			{item.difficulty}
		</td>
		<td className="p-4 text-sm">{item.point}p</td>
		<td className="p-4 text-sm">{item.noOfSuccess}</td>
		<td className="p-4 text-sm">{item.noOfSubm == 0 ? 0 : Math.round((item.noOfSuccess / item.noOfSubm) * 100)}%</td>
		<td className="space-x-3 p-4 text-sm">
			<Link to={`/problem/${item.id}`}>
				<Tooltip content={t('edit')}>
					<IconButton size="sm" className="bg-info hover:!shadow-cmd cursor-pointer rounded-full">
						<Pencil color="#fff" size="16" />
					</IconButton>
				</Tooltip>
			</Link>
			<Tooltip content={t('delete')}>
				<IconButton
					onClick={() => {
						setSelectId(item.id);
						setOpenDeleteDialog(true);
					}}
					size="sm"
					className="bg-error hover:!shadow-cmd cursor-pointer rounded-full"
				>
					<Trash color="#fff" size="16" />
				</IconButton>
			</Tooltip>
		</td>
	</tr>
));

TableRow.propTypes = {
	item: PropTypes.object.isRequired,
	setSelectId: PropTypes.func.isRequired,
	setOpenDeleteDialog: PropTypes.func.isRequired,
	setPrivatePublicDialog: PropTypes.func.isRequired,
	tags: PropTypes.array.isRequired,
	t: PropTypes.func.isRequired,
};

const Problems = () => {
	const { t } = useTranslation('problem');
	const queryClient = useQueryClient();

	const [difficulty, setDifficulty] = useState();
	const [tags, setTags] = useState([]);
	const [search, setSearch] = useState('');
	const [page, setPage] = useState(1);
	const [perPage, setPerPage] = useState(50);
	const [maxPage, setMaxPage] = useState(1);
	const q = useDebounce(search, 400);

	const [openPrivatePublicDialog, setPrivatePublicDialog] = useState(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [selectId, setSelectId] = useState();
	const [selectValue, setSelectValue] = useState();
	const [privatePublicLoading, setPrivatePublicLoading] = useState(false);
	const [deleteLoading, setDeleteLoading] = useState(false);

	const handlePrivatePublic = () => {
		if (!selectValue || !selectId) return;
		setPrivatePublicLoading(true);
		editProblem(selectId, { public: !selectValue.public })
			.then((res) => {
				toast.success(res);
				queryClient.invalidateQueries({ queryKey: ['problems', { tags, q, difficulty, perPage, page }] });
			})
			.catch(toast.error)
			.finally(() => {
				setPrivatePublicLoading(false);
				setPrivatePublicDialog(false);
			});
	};

	const handleDelete = () => {
		if (!selectId || !selectValue) return;
		setDeleteLoading(true);
		deleteProblem(selectId)
			.then((res) => {
				toast.success(res);
				queryClient.invalidateQueries({ queryKey: ['problems', { tags, q, difficulty, perPage, page }] });
			})
			.catch(toast.error)
			.finally(() => {
				setDeleteLoading(false);
				setOpenDeleteDialog(false);
			});
	};

	const {
		data: problems,
		isLoading: problemsLoading,
		error: problemsErr,
	} = useQuery({
		queryKey: ['problems', { tags, q, difficulty, perPage, page }],
		queryFn: () => getProblems({ tags, q, difficulty, size: perPage, page }),
	});

	const {
		data: tagList,
		isLoading: tagsLoading,
		error: tagsErr,
	} = useQuery({
		queryKey: ['tags'],
		queryFn: getTags,
	});

	useEffect(() => {
		if (problems) {
			setMaxPage(Math.max(problems.maxPage, 1));
		}
	}, [problems]);

	useEffect(() => {
		if (!problems || !selectId) return;
		setSelectValue(problems.data.find((item) => item.id === selectId));
	}, [problems, selectId]);

	if (tagsErr)
		return (
			<div className="min-h-[100vh]">
				<Error keys={[['tags']]}>{tagsErr}</Error>
			</div>
		);
	if (problemsErr)
		return (
			<div className="min-h-[100vh]">
				<Error keys={[['problems', { tags, q, difficulty, perPage, page }]]}>{problemsErr}</Error>
			</div>
		);

	return (
		<div className="min-h-[100vh]">
			<Dialog size="sm" className="p-4" open={openPrivatePublicDialog} handler={() => setPrivatePublicDialog((prev) => !prev)}>
				<DialogHeader>{t('are-you-sure')}?</DialogHeader>
				<DialogBody className="py-1">{selectValue?.public ? t('close-msg') : t('open-msg')}</DialogBody>
				<DialogFooter className="space-x-2">
					<Button size="sm" variant="text" className="text-error cursor-pointer" onClick={() => setPrivatePublicDialog(false)}>
						{t('cancel')}
					</Button>
					<Button size="sm" className="bg-success flex-center cursor-pointer gap-2" onClick={handlePrivatePublic} loading={privatePublicLoading}>
						{selectValue?.public ? (
							<>
								{t('close-it')}
								<Lock strokeWidth={3} size="14" />
							</>
						) : (
							<>
								{t('open-it')}
								<LockOpen strokeWidth={3} size="14" />
							</>
						)}
					</Button>
				</DialogFooter>
			</Dialog>
			<Dialog size="sm" className="p-4" open={openDeleteDialog} handler={() => setOpenDeleteDialog((prev) => !prev)}>
				<DialogHeader>{t('are-you-sure')}?</DialogHeader>
				<DialogBody className="py-1">{t('delete-msg')}</DialogBody>
				<DialogFooter className="space-x-2">
					<Button size="sm" variant="text" className="text-error cursor-pointer" onClick={() => setOpenDeleteDialog(false)}>
						{t('cancel')}
					</Button>
					<Button size="sm" className="bg-error flex-center cursor-pointer gap-2" onClick={handleDelete} loading={deleteLoading}>
						{t('delete')}
						<Trash strokeWidth={3} size="14" />
					</Button>
				</DialogFooter>
			</Dialog>
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
				<div className="relative max-w-sm">
					<FullOutlineInput className="pr-10 placeholder:capitalize" placeholder={t('search')} value={search} onChange={(e) => setSearch(e.target.value)} />
					<Search className="text-base-content/70 absolute right-3 top-3" size="16" />
				</div>
				<Link to="/problem/create" className="ml-auto">
					<Button className="bg-primary flex !h-10 cursor-pointer items-center gap-1 capitalize">
						<Plus size="18" />
						{t('create-new')}
					</Button>
				</Link>
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
						{problemsLoading ? (
							<TableSkeleton perPage={perPage} />
						) : (
							problems?.data?.map((item, index) => (
								<TableRow
									tags={tags}
									item={item}
									key={index}
									setSelectId={setSelectId}
									setOpenDeleteDialog={setOpenDeleteDialog}
									setPrivatePublicDialog={setPrivatePublicDialog}
									t={t}
								/>
							))
						)}
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

export default Problems;
