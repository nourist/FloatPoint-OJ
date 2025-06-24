import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import { useEffect, useState, memo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import PropTypes from 'prop-types';
import { Tooltip, IconButton, Dialog, DialogBody, DialogHeader, DialogFooter, Button } from '@material-tailwind/react';
import { Trash } from 'lucide-react';
import { Link } from 'react-router';

import UserAvatar from '~/components/UserAvatar';
import FullOutlineInput from '~/components/FullOutlineInput';
import useDebounce from '~/hooks/useDebounce';
import Select from '~/components/Select';
import Pagination from '~/components/Pagination';
import Error from '~/components/Error';
import { getUsers, deleteUser } from '~/services/user';
import { toast } from 'react-toastify';

// eslint-disable-next-line react/display-name, react/prop-types
const TableSkeleton = memo(({ perPage }) =>
	[...Array(perPage)].map((_, index) => (
		<tr key={index} className="skeleton odd:skeleton-variant h-[70px]">
			{[...Array(6)].map((_, idx) => (
				<td key={idx} className="p-4"></td>
			))}
		</tr>
	)),
);

// eslint-disable-next-line react/display-name
const TableRow = memo(({ item, t, setSelectId, setOpenDeleteDialog }) => (
	<tr className="even:bg-base-200 dark:bg-base-200 dark:even:bg-base-100 bg-base-100 text-base-content/80">
		<td className={`text-base-content p-4 text-center font-semibold ${item.top === 1 ? 'text-3xl' : item.top === 2 ? 'text-2xl' : item.top === 3 ? 'text-xl' : 'text-lg'}`}>
			{item.top === 1 ? '🥇' : item.top === 2 ? '🥈' : item.top === 3 ? '🥉' : item.top}
		</td>
		<td className="p-4 text-sm">
			<Link className="hover:underline" to={`/user/${item.name}`}>
				<UserAvatar user={item} className="mr-2 !size-[38px]" />
				{item.name}
			</Link>
		</td>
		<td className="p-4 text-sm">{item.fullname}</td>
		<td className="p-4 text-center text-sm">{item.totalAC}</td>
		<td className="p-4 text-center text-sm">{item.totalScore}</td>
		<td className="p-4 text-center text-sm">
			<Tooltip content={t('delete')}>
				<IconButton
					onClick={() => {
						setSelectId(item.name);
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
	t: PropTypes.func.isRequired,
	setSelectId: PropTypes.func.isRequired,
	setOpenDeleteDialog: PropTypes.func.isRequired,
};

const Users = () => {
	const { t } = useTranslation('user');
	const queryClient = useQueryClient();

	const [search, setSearch] = useState('');
	const [page, setPage] = useState(1);
	const [perPage, setPerPage] = useState(50);
	const [maxPage, setMaxPage] = useState(1);
	const q = useDebounce(search, 400);

	const [selectId, setSelectId] = useState();
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [deleting, setDeleting] = useState(false);

	const { data, isLoading, error } = useQuery({
		queryKey: ['users', { q, page, perPage }],
		queryFn: () => getUsers({ q, page, size: perPage, order: -1, sortBy: 'totalScore' }),
	});

	useEffect(() => {
		if (data?.maxPage) {
			setMaxPage(Math.max(1, data.maxPage));
		}
	}, [data]);

	if (error) {
		return <Error keys={[['users', { q, page, perPage }]]}>{error}</Error>;
	}

	const handleDelete = () => {
		if (!selectId) return;
		setDeleting(true);
		deleteUser(selectId)
			.then((res) => {
				toast.success(res);
				queryClient.invalidateQueries({ queryKey: ['users', { q, page, perPage }] });
			})
			.catch(toast.error)
			.finally(() => {
				setDeleting(false);
				setOpenDeleteDialog(false);
			});
	};

	return (
		<>
			<Dialog size="sm" className="p-4" open={openDeleteDialog} handler={() => setOpenDeleteDialog((prev) => !prev)}>
				<DialogHeader>{t('are-you-sure')}?</DialogHeader>
				<DialogBody className="py-1">{t('delete-msg')}</DialogBody>
				<DialogFooter className="space-x-2">
					<Button size="sm" variant="text" className="text-error cursor-pointer" onClick={() => setOpenDeleteDialog(false)}>
						{t('cancel')}
					</Button>
					<Button size="sm" className="bg-error flex-center cursor-pointer gap-2" onClick={handleDelete} loading={deleting}>
						{t('delete')}
						<Trash strokeWidth={3} size="14" />
					</Button>
				</DialogFooter>
			</Dialog>
			<div className="min-h-[100vh]">
				<div className="relative mb-4 max-w-sm">
					<FullOutlineInput className="w-full pr-10 placeholder:capitalize" placeholder={t('search')} value={search} onChange={(e) => setSearch(e.target.value)} />
					<Search className="text-base-content/70 absolute right-3 top-3" size="16" />
				</div>
				<div className="shadow-clg shadow-shadow-color/5 w-full overflow-auto rounded-xl">
					<table className="w-full table-fixed">
						<thead>
							<tr>
								<th className="border-base-content/30 bg-blue-gray-50 dark:bg-base-300 border-b p-4 text-sm capitalize dark:text-white">{t('top')}</th>
								<th className="border-base-content/30 bg-blue-gray-50 dark:bg-base-300 border-b p-4 text-left text-sm capitalize dark:text-white">{t('name')}</th>
								<th className="border-base-content/30 bg-blue-gray-50 dark:bg-base-300 border-b p-4 text-left text-sm capitalize dark:text-white">
									{t('fullname')}
								</th>
								<th className="border-base-content/30 bg-blue-gray-50 dark:bg-base-300 border-b p-4 text-sm capitalize dark:text-white">{t('problem')}</th>
								<th className="border-base-content/30 bg-blue-gray-50 dark:bg-base-300 border-b p-4 text-sm capitalize dark:text-white">{t('point')}</th>
								<th className="border-base-content/30 bg-blue-gray-50 dark:bg-base-300 w-16 border-b p-4 text-sm capitalize dark:text-white"></th>
							</tr>
						</thead>
						<tbody>
							{isLoading ? (
								<TableSkeleton perPage={perPage} />
							) : (
								data?.data?.map((item, index) => <TableRow item={item} key={index} t={t} setSelectId={setSelectId} setOpenDeleteDialog={setOpenDeleteDialog} />)
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
		</>
	);
};

export default Users;
