import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import { Button } from '~/components/ui/button';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import Markdown from 'react-markdown';
import { Skeleton } from '~/components/ui/skeleton';

import { getContest, joinContest, leaveContest } from '~/services/contest';
import routesConfig from '~/config/routes';
import useAuthStore from '~/stores/authStore';
import markdownComponents from '~/config/markdownComponents.jsx';
import contestImg from '~/assets/images/1stcontest.png';

const Contest = () => {
	const { id } = useParams();
	const { t } = useTranslation('contest');
	const { user } = useAuthStore();

	const [contest, setContest] = useState({});
	const [loading, setLoading] = useState(false);
	const [jloining, setJloining] = useState(false);

	const handleJoinLeave = () => {
		setJloining(true);
		if (user.joiningContest === id) {
			leaveContest()
				.then((res) => toast.success(res.msg))
				.catch((err) => toast.error(err.response.msg))
				.finally(() => setJloining(false));
		} else {
			joinContest(id)
				.then((res) => toast.success(res.msg))
				.catch((err) => toast.error(err.response.msg))
				.finally(() => setJloining(false));
		}
	};

	const formatStartTime = (date) => {
		const options = {
			day: '2-digit',
			month: 'long',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			timeZoneName: 'shortOffset',
			hour12: false,
		};
		return date.toLocaleString('en-GB', options).replace(',', '');
	};

	const formatDuration = (start, end) => {
		const diffMs = end - start;
		const diffMins = Math.floor(diffMs / 60000);
		const hours = String(Math.floor(diffMins / 60)).padStart(2, '0');
		const minutes = String(diffMins % 60).padStart(2, '0');
		return `${hours} hours, ${minutes} minutes`;
	};

	const formatDurationFromMs = (diffMs) => {
		const totalSec = Math.floor(diffMs / 1000);
		const hours = String(Math.floor(totalSec / 3600)).padStart(2, '0');
		const minutes = String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0');
		const seconds = String(totalSec % 60).padStart(2, '0');
		return `${hours}:${minutes}:${seconds}`;
	};

	useEffect(() => {
		setLoading(true);
		getContest(id)
			.then((res) => {
				res.data.startTime = new Date(res.data.startTime);
				res.data.endTime = new Date(res.data.endTime);
				setContest(res.data);
			})
			.catch((err) => toast.error(err.response.data.msg))
			.finally(() => setLoading(false));
	}, [id, user]);

	return (
		<div className="flex-1 px-14 py-6">
			<h2 className="mb-1 flex items-center gap-2 text-2xl dark:text-gray-100">
				<img src={contestImg} className="size-6" />
				{contest.title}
			</h2>
			<div>
				<Tabs defaultValue="a">
					<TabsList className="dark:bg-neutral-800">
						<TabsTrigger className="capitalize" value="a">
							{t('info')}
						</TabsTrigger>
						{(user?.permission === 'Admin' || user?.joiningContest === id) && (
							<>
								<TabsTrigger className="capitalize" value="c">
									{t('standing')}
								</TabsTrigger>
								<TabsTrigger className="capitalize" value="d" asChild>
									<Link to={`${routesConfig.problems}?contest=true`}>{t('problems')}</Link>
								</TabsTrigger>
								<TabsTrigger className="capitalize" value="e" asChild>
									<Link to={`${routesConfig.submissions}?contest=${user?.joiningContest}`}>{t('submissions')}</Link>
								</TabsTrigger>
							</>
						)}
					</TabsList>

					<Button
						data-type={user?.joiningContest === id ? 'leave' : 'join'}
						className="float-right capitalize data-[type=join]:!bg-green-500 data-[type=leave]:!bg-red-600 hover:data-[type=join]:!bg-green-600 hover:data-[type=leave]:!bg-red-500 dark:text-white"
						disabled={jloining}
						onClick={handleJoinLeave}
					>
						{user?.joiningContest === id ? t('leave') : t('join')}
					</Button>

					<TabsContent value="a">
						{loading ? (
							<div className="border-t border-gray-500 pt-2 dark:border-neutral-700">
								<Skeleton className="mx-auto mb-2 h-8 w-1/3 rounded-full"></Skeleton>
								<Skeleton className="mx-auto mb-4 h-6 w-1/2 rounded-full"></Skeleton>
								<Skeleton className={`my-1 h-5 w-[562px] rounded-full`}></Skeleton>
								<Skeleton className={`my-1 h-5 w-[123px] rounded-full`}></Skeleton>
								<Skeleton className={`my-1 h-5 w-[532px] rounded-full`}></Skeleton>
								<Skeleton className={`my-1 h-5 w-[862px] rounded-full`}></Skeleton>
								<Skeleton className={`my-1 h-5 w-[264px] rounded-full`}></Skeleton>
								<Skeleton className={`my-1 h-5 w-[752px] rounded-full`}></Skeleton>
								<Skeleton className={`my-1 h-5 w-[562px] rounded-full`}></Skeleton>
								<Skeleton className={`my-1 h-5 w-[123px] rounded-full`}></Skeleton>
								<Skeleton className={`my-1 h-5 w-[532px] rounded-full`}></Skeleton>
							</div>
						) : (
							<div className="border-t border-gray-500 pt-2 dark:border-neutral-700">
								<h3 className="w-full text-center text-2xl text-sky-500">
									{t(contest.startTime > Date.now() ? 'upcoming' : contest.endTime < Date.now() ? 'ended' : 'ongoing')}
								</h3>
								<div className="mb-3 w-full text-center font-semibold capitalize dark:text-gray-200">
									{formatDuration(contest?.startTime || new Date(), contest?.endTime || new Date())} <span className="font-light lowercase">{t('since')}</span>{' '}
									{formatStartTime(contest?.startTime || new Date())}
								</div>
								<Markdown components={markdownComponents}>{contest?.description}</Markdown>
							</div>
						)}
					</TabsContent>
					<TabsContent value="c">
						<div className="mt-4">
							<table className="w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
								<thead className="bg-white text-xs uppercase text-gray-700 dark:bg-neutral-800 dark:text-gray-400">
									<tr>
										<th scope="col" className="w-24 px-6 py-3 text-center">
											{t('top')}
										</th>
										<th scope="col" className="px-6 py-3">
											{t('name')}
										</th>
										<th scope="col" className="w-32 border-x px-6 py-3 text-center dark:border-neutral-700">
											{t('total')}
										</th>
										{contest?.problems?.map((item, index) => (
											<th scope="col" key={index} className="h-12 w-16 border-x py-3 text-center dark:border-neutral-700 hover:dark:text-white">
												<Link className="p-4" to={routesConfig.problem.replace(':id', item)}>
													{index + 1}
												</Link>
											</th>
										))}
									</tr>
								</thead>
								<tbody>
									{!loading &&
										contest?.standing?.map((item, index) => (
											<tr
												key={index}
												className="h-14 border-b border-gray-200 odd:bg-gray-100 even:bg-white dark:border-gray-700 odd:dark:bg-neutral-900 even:dark:bg-neutral-800"
											>
												<td
													data-top={index + 1}
													data-top3={index < 3}
													className="px-6 py-4 text-center data-[top3=true]:font-bold data-[top=1]:text-red-500 data-[top=2]:text-yellow-500 data-[top=3]:text-cyan-500"
												>
													{index + 1}
												</td>
												<td className="px-6 py-4">
													<Link
														className="text-gray-800 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
														to={routesConfig.user.replace(':name', item.user)}
													>
														{item.user}
														{item.user === user?.name && <span className="text-red-500"> ({t('you')})</span>}
													</Link>
												</td>
												<td className="border-x px-6 py-4 text-center text-gray-800 hover:text-gray-900 hover:underline dark:border-neutral-700 dark:text-gray-300">
													<Link to={`${routesConfig.submissions}?contest=${id}&author=${item.user}`}>
														<div className="dark:text-white">{item.score.reduce((acc, cur) => acc + cur, 0)}</div>
														<div className="text-[10px]">{formatDurationFromMs(item.time.reduce((acc, cur) => acc + cur, 0))}</div>
													</Link>
												</td>
												{contest?.problems?.map((problem, index) => (
													<td key={index} className="border-x px-6 py-4 text-center hover:underline dark:border-neutral-700">
														<Link to={`${routesConfig.submissions}?contest=${id}&author=${item.user}&problem=${problem}`}>
															<div
																data-status={item?.score?.[index] == 0 ? '0' : item?.status?.[index] == 'AC' ? '2' : '1'}
																className="data-[status=2]:font-bold data-[status=0]:!text-red-500 data-[status=1]:!text-yellow-500 data-[status=2]:!text-green-500 dark:text-white"
															>
																{item?.score?.[index]}
															</div>
															<div className="text-[10px]">{item?.time?.[index] && formatDurationFromMs(item?.time?.[index])}</div>
														</Link>
													</td>
												))}
											</tr>
										))}
								</tbody>
							</table>
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
};

export default Contest;
