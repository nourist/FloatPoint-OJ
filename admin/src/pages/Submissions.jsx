import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Chart from 'react-apexcharts';
import { memo } from 'react';
import PropTypes from 'prop-types';
import { Link, useSearchParams } from 'react-router';
import { Chip, Tooltip, IconButton, Dialog, DialogBody, DialogFooter, DialogHeader, Button } from '@material-tailwind/react';
import { Trash } from 'lucide-react';
import { toast } from 'react-toastify';

import Pagination from '~/components/Pagination';
import Select from '~/components/Select';
import statusColors from '~/config/statusColor';
import { getProblems } from '~/services/problem';
import { getUsers } from '~/services/user';
import { getSubmissions, deleteSubmission } from '~/services/submission';
import Error from '~/components/Error';

// eslint-disable-next-line react/display-name, react/prop-types
const TableSkeleton = memo(({ perPage }) =>
	[...Array(perPage)].map((_, index) => (
		<tr key={index} className="skeleton odd:skeleton-variant h-16">
			{[...Array(10)].map((_, idx) => (
				<td key={idx} className="p-4"></td>
			))}
		</tr>
	)),
);

const formatedDate = (date) => {
	const datePart = new Intl.DateTimeFormat('vi-VN', {
		day: '2-digit',
		month: '2-digit',
	}).format(date);

	const timePart = new Intl.DateTimeFormat('vi-VN', {
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
	}).format(date);

	const result = `${datePart.replaceAll('/', '-')} ${timePart}`;
	return result;
};

// eslint-disable-next-line react/display-name
const TableRow = memo(({ item, t, setSelectId, setOpenDeleteDialog }) => (
	<tr className="even:bg-base-200 dark:bg-base-200 dark:even:bg-base-100 bg-base-100 text-base-content/80">
		<td className="p-4 text-sm">{formatedDate(new Date(item.createdAt || null))}</td>
		<td className="truncate p-4 text-sm">
			<Link to={`/submission/${item._id}`} className="!text-secondary hover:underline">
				{item._id}
			</Link>
		</td>
		<td className="p-4 text-sm">
			<Chip
				className="!w-12 text-center"
				style={{
					backgroundColor: statusColors[item.status.toLowerCase()],
				}}
				value={item.status}
			/>
		</td>
		<td className="p-4 text-sm">
			<Link className="text-secondary hover:underline" to={`/problem/${item.forProblem}`}>
				{item.forProblem}
			</Link>
		</td>
		<td className="p-4 text-sm">{item.time}</td>
		<td className="p-4 text-sm">{item.memory}</td>
		<td className="p-4 text-sm capitalize">{item.language}</td>
		<td className="p-4 text-sm">{item.point}</td>
		<td className="p-4 text-sm">
			<Link className="text-secondary hover:underline" to={`/user/${item.forProblem}`}>
				{item.author}
			</Link>
		</td>
		<td className="p-4 text-sm">
			<Tooltip content={t('delete')}>
				<IconButton
					onClick={() => {
						setSelectId(item._id);
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

const Submissions = () => {
	const { t } = useTranslation('submission');
	const queryClient = useQueryClient();
	const [searchParams] = useSearchParams();

	const [status, setStatus] = useState(null);
	const [language, setLanguage] = useState(null);
	const [problem, setProblem] = useState(searchParams.get('problem'));
	const [author, setAuthor] = useState(searchParams.get('author'));
	const [page, setPage] = useState(1);
	const [perPage, setPerPage] = useState(50);
	const [maxPage, setMaxPage] = useState(1);

	const [selectId, setSelectId] = useState();
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [deleting, setDeleting] = useState(false);

	const {
		data: problems,
		isLoading: problemsLoading,
		error: problemErr,
	} = useQuery({
		queryKey: ['minimal-problems'],
		queryFn: () => getProblems({ size: 1e9, minimal: true }).then((res) => res.data),
	});

	const {
		data: users,
		isLoading: usersLoading,
		error: userErr,
	} = useQuery({
		queryKey: ['minimal-users'],
		queryFn: () => getUsers({ size: 1e9, minimal: true }).then((res) => res.data),
	});

	const {
		data,
		isLoading: loading,
		error,
	} = useQuery({
		queryKey: ['submissions', { status, language, problem, author, perPage, page, contest: searchParams.get('contest') }],
		queryFn: () =>
			getSubmissions({
				status: status?.toUpperCase(),
				language,
				problem: problem ? `#${problem}` : undefined,
				author,
				size: perPage,
				page,
				contest: searchParams.get('contest'),
			}),
	});

	useEffect(() => {
		if (!data) return;
		setMaxPage(Math.max(data.maxPage, 1));
	}, [data]);

	const handleDelete = () => {
		if (!selectId) return;
		setDeleting(true);
		deleteSubmission(selectId)
			.then((res) => {
				toast.success(res);
				queryClient.invalidateQueries({ queryKey: ['submissions', { status, language, problem, author, perPage, page, contest: searchParams.get('contest') }] });
			})
			.catch(toast.error)
			.finally(() => {
				setDeleting(false);
				setOpenDeleteDialog(false);
			});
	};

	if (error || problemErr || userErr) {
		return (
			<Error keys={[['minimal-problems'], ['minimal-users'], ['submissions', { status, language, problem, author, perPage, page }]]}>{error || problemErr || userErr}</Error>
		);
	}

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
			<div className="flex min-h-[100vh] flex-col-reverse gap-6 xl:flex-row">
				<div className="flex-1 rounded-xl">
					<div className="mb-4 flex flex-wrap gap-2">
						<Select
							label={t('status')}
							value={status}
							setValue={setStatus}
							data={Object.entries(statusColors).map((item) => ({
								value: item[0],
								label: (
									<div className="uppercase" style={{ color: item[1] }}>
										{item[0]}
									</div>
								),
							}))}
						/>
						<Select
							label={t('language')}
							value={language}
							setValue={setLanguage}
							data={['c', 'c11', 'c++11', 'c++14', 'c++17', 'c++20', 'python2', 'python3'].map((item) => ({ value: item, label: item }))}
						/>
						<Select
							label={t('problem')}
							value={problem}
							loading={problemsLoading}
							setValue={setProblem}
							data={problems?.map((item) => ({ value: item, label: item }))}
						/>
						<Select label={t('author')} value={author} loading={usersLoading} setValue={setAuthor} data={users?.map((item) => ({ value: item, label: item }))} />
					</div>
					<div className="shadow-clg shadow-shadow-color/5 overflow-auto rounded-xl">
						<table className="w-full table-fixed text-left">
							<thead>
								<tr>
									{[t('when'), t('id'), t('status'), t('problem'), `${t('time')}(s)`, `${t('memory')}(MB)`, t('language'), t('point'), t('author')].map(
										(item, index) => (
											<th key={index} className="border-base-content/30 bg-blue-gray-50 dark:bg-base-300 border-b p-4 text-sm capitalize dark:text-white">
												{item}
											</th>
										),
									)}
									<th className="border-base-content/30 bg-blue-gray-50 dark:bg-base-300 w-16 border-b p-4 text-sm capitalize dark:text-white"></th>
								</tr>
							</thead>
							<tbody>
								{loading ? (
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
				<div className="flex-1 space-y-6 xl:max-w-80">
					<div className="bg-base-100 shadow-shadow-color/3 shadow-clg space-y-4 rounded-xl p-6">
						<h2 className="text-base-content mb-6 text-lg font-semibold capitalize">{t('status')}</h2>
						{Object.keys(statusColors).map((stat) =>
							loading ? (
								<div key={stat} className="skeleton h-10 w-full rounded-md" />
							) : (
								<div key={stat} className="flex h-10 items-center gap-2">
									<button
										onClick={() => setStatus(stat)}
										className="flex-center size-10 cursor-pointer rounded-md text-sm font-bold uppercase"
										style={{ color: statusColors[stat], backgroundColor: `color-mix(in srgb, ${statusColors[stat]} 20%, transparent)` }}
									>
										{stat}
									</button>
									<div>
										<h3 className="text-base-content/60 text-[13px] font-semibold capitalize">{t(stat)}</h3>
										<p className="text-base-content text-[15px]">
											{data?.stat?.status?.[['AC', 'WA', 'TLE', 'MLE', 'RTE', 'CE', 'IE'].indexOf(stat.toUpperCase())] || 0}
										</p>
									</div>
								</div>
							),
						)}
					</div>
					<div className="bg-base-100 shadow-shadow-color/3 shadow-clg rounded-xl p-6">
						<h2 className="text-base-content mb-6 text-lg font-semibold capitalize">{t('language')}</h2>
						<Chart
							type="pie"
							height={300}
							series={data?.stat?.language || []}
							options={{
								labels: ['c', 'c11', 'c++11', 'c++14', 'c++17', 'c++20', 'python2', 'python3'].map((i) => i.toUpperCase()),
								legend: {
									position: 'bottom',
									labels: {
										colors: Array(8).fill('var(--color-base-content)'),
									},
								},
							}}
						/>
					</div>
				</div>
			</div>
		</>
	);
};

export default Submissions;
