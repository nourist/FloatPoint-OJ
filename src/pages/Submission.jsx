import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import Chart from 'react-apexcharts';

import Pagination from '~/components/Pagination';
import Select from '~/components/Select';
import statusColors from '~/config/statusColor';
import { getProblems } from '~/services/problem';
import { getUsers } from '~/services/user';
import { getSubmissions } from '~/services/submission';
import Error from '~/components/Error';

const Submission = () => {
	const { t } = useTranslation('submission');

	const [status, setStatus] = useState(null);
	const [language, setLanguage] = useState(null);
	const [problem, setProblem] = useState(null);
	const [author, setAuthor] = useState(null);
	const [page, setPage] = useState(1);
	const [perPage, setPerPage] = useState(50);
	const [maxPage, setMaxPage] = useState(1);

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
		queryKey: ['submissions', { status, language, problem, author, perPage, page }],
		queryFn: () => getSubmissions({ status: status?.toUpperCase(), language, problem: problem ? `#${problem}` : undefined, author, size: perPage, page }),
	});

	useEffect(() => {
		if (!data) return;
		setMaxPage(Math.max(data.maxPage, 1));
	}, [data]);

	if (error || problemErr || userErr) {
		return (
			<Error keys={[['minimal-problems'], ['minimal-users'], ['submissions', { status, language, problem, author, perPage, page }]]}>{error || problemErr || userErr}</Error>
		);
	}

	return (
		<div className="flex min-h-[100vh] flex-col-reverse flex-wrap gap-6 xl:flex-row">
			<div className="flex-1 rounded-xl">
				<div className="flex flex-wrap gap-2">
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
					<Select label={t('problem')} value={problem} loading={problemsLoading} setValue={setProblem} data={problems?.map((item) => ({ value: item, label: item }))} />
					<Select label={t('author')} value={author} loading={usersLoading} setValue={setAuthor} data={users?.map((item) => ({ value: item, label: item }))} />
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
	);
};

export default Submission;
