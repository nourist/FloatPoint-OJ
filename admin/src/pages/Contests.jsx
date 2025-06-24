import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Trash, Search, Clock, Plus, Trophy } from 'lucide-react';
import PropTypes from 'prop-types';
import { Chip, Button, Dialog, DialogBody, DialogFooter, DialogHeader, Tooltip } from '@material-tailwind/react';
import { Link } from 'react-router';
import { toast } from 'react-toastify';

import CountDown from '~/components/CountDown';
import Select from '~/components/Select';
import { getContests, deleteContest } from '~/services/contest';
import useDebounce from '~/hooks/useDebounce';
import Pagination from '~/components/Pagination';
import FullOutlineInput from '~/components/FullOutlineInput';
import Error from '~/components/Error';

const formatedDate = (date) => {
	const datePart = new Intl.DateTimeFormat('vi-VN', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	}).format(date);

	const timePart = new Intl.DateTimeFormat('vi-VN', {
		hour: '2-digit',
		minute: '2-digit',
	}).format(date);

	const result = `${datePart.replaceAll('/', '-')} ${timePart}`;
	return result;
};

// eslint-disable-next-line react/display-name
const ContestCard = memo(({ data, t, setSelectId, setOpenDeleteDialog }) => (
	<div
		data-loading={!data}
		className="data-[loading=true]:skeleton bg-base-100 shadow-clg shadow-shadow-color/3 min-h-[344px] min-w-[min(400px,100%)] max-w-[600px] flex-1 space-y-6 rounded-xl p-6 data-[loading=true]:*:hidden"
	>
		<div className="mb-8 flex items-center gap-3">
			<Trophy size={24} color="#fbc02d" />
			<h3 className="text-base-content mr-auto text-xl font-semibold capitalize">{data?.title}</h3>
			<Chip data-status={data?.status} className="bg-warning data-[status=ended]:bg-error data-[status=ongoing]:bg-success text-white" value={t(data?.status)} size="lg" />
		</div>
		<div className="bg-base-300 text-base-content flex h-11 items-center gap-2 rounded-md p-3 text-sm capitalize">
			<Clock size={15} />
			{data?.status === 'upcoming' ? (
				`${t('start')}: ${formatedDate(new Date(data?.startTime || null))}`
			) : data?.status === 'ended' ? (
				`${t('end')}: ${formatedDate(new Date(data?.endTime || null))}`
			) : (
				<>
					{t('left')}: <CountDown endTime={new Date(data?.endTime || null)} />
				</>
			)}
		</div>
		<div className="*:bg-base-content/4 *:border-base-content/6 *:hover:bg-base-content/5 grid grid-cols-3 gap-4 *:h-24 *:rounded-lg *:border *:p-4 *:text-center *:transition-all *:duration-200 *:hover:-translate-y-1">
			<div>
				<div className="text-base-content mb-2 text-2xl font-bold">{data?.participant?.length}</div>
				<div className="text-base-content/50 text-xs uppercase">{t('participant')}</div>
			</div>
			<div>
				<div className="text-base-content mb-2 text-2xl font-bold">{data?.problems?.length}</div>
				<div className="text-base-content/50 text-xs uppercase">{t('problem')}</div>
			</div>
			<div>
				<div className="text-base-content mb-2 text-2xl font-bold">{Math.round((data?.duration || 0) / (1000 * 60 * 60))}h</div>
				<div className="text-base-content/50 text-xs uppercase">{t('duration')}</div>
			</div>
		</div>
		<div className="flex gap-3">
			<Link to={`/contest/${data?.id}?tab=1`} className="flex-1">
				<Button className="bg-base-content hover:bg-base-content/90 text-base-100 h-11 w-full cursor-pointer capitalize">{t('view')}</Button>
			</Link>
			<Link to={`/contest/${data?.id}?tab=2`} className="flex-1">
				<Button className="bg-secondary hover:bg-secondary/90 h-11 w-full cursor-pointer capitalize">{t('edit')}</Button>
			</Link>
			<Tooltip content={t('delete')}>
				<Button
					className="bg-error hover:bg-error/90 flex-center size-11 cursor-pointer p-0 text-white"
					onClick={() => {
						setSelectId(data.id);
						setOpenDeleteDialog(true);
					}}
				>
					<Trash />
				</Button>
			</Tooltip>
		</div>
	</div>
));

ContestCard.propTypes = {
	data: PropTypes.object,
	t: PropTypes.func.isRequired,
	setSelectId: PropTypes.func.isRequired,
	setOpenDeleteDialog: PropTypes.func.isRequired,
};

const Contests = () => {
	const { t } = useTranslation('contest');
	const queryClient = useQueryClient();

	const [status, setStatus] = useState();
	const [search, setSearch] = useState('');
	const [page, setPage] = useState(1);
	const [perPage, setPerPage] = useState(50);
	const [maxPage, setMaxPage] = useState(1);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [selectId, setSelectId] = useState(null);
	const [deleting, setDeleting] = useState(false);
	const q = useDebounce(search);

	const { data, isLoading, error } = useQuery({
		queryKey: ['contests', { q, page, perPage, status }],
		queryFn: () => getContests({ q, page, size: perPage, status }),
	});

	useEffect(() => {
		if (data?.maxPage) {
			setMaxPage(data.maxPage);
		}
	}, [data]);

	if (error) {
		return <Error keys={[['contests', { q, page, perPage, status }]]}>{error}</Error>;
	}

	const handleDelete = () => {
		setDeleting(true);
		deleteContest(selectId)
			.then((res) => {
				toast.success(res);
				queryClient.invalidateQueries({ queryKey: ['contests', { q, page, perPage, status }] });
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
				<div className="mb-4 flex flex-wrap gap-2">
					<Select
						label={t('status')}
						value={status}
						setValue={setStatus}
						data={[
							{
								value: 'ongoing',
								label: <div className="text-success">{t('ongoing')}</div>,
							},
							{
								value: 'ended',
								label: <div className="text-error">{t('ended')}</div>,
							},
							{
								value: 'upcoming',
								label: <div className="text-warning">{t('upcoming')}</div>,
							},
						]}
					/>
					<div className="relative max-w-sm">
						<FullOutlineInput className="pr-10 placeholder:capitalize" placeholder={t('search')} value={search} onChange={(e) => setSearch(e.target.value)} />
						<Search className="text-base-content/70 absolute right-3 top-3" size="16" />
					</div>
					<Link to="/contest/create" className="ml-auto">
						<Button className="bg-primary flex !h-10 cursor-pointer items-center gap-1 capitalize">
							<Plus size="18" />
							{t('create-new')}
						</Button>
					</Link>
				</div>
				<div className="flex w-full flex-wrap gap-6">
					{isLoading
						? [...Array(perPage)].map((_, index) => <ContestCard t={t} key={index} />)
						: data?.data?.map((item, index) => <ContestCard data={item} key={index} t={t} setSelectId={setSelectId} setOpenDeleteDialog={setOpenDeleteDialog} />)}
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

export default Contests;
