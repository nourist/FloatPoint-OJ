import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import { Button } from '~/components/ui/button';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import Markdown from 'react-markdown';
import { Skeleton } from '~/components/ui/skeleton';
import { Trophy, Clock, Info, FileText, Send, ArrowLeft } from 'lucide-react';
import { Badge } from '~/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Avatar } from '~/components/ui/avatar';
import { Progress } from '~/components/ui/progress';

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
	const [joining, setJoining] = useState(false);
	const [timeLeft, setTimeLeft] = useState(null);
	const [progress, setProgress] = useState(0);

	const handleJoinLeave = () => {
		setJoining(true);
		if (user?.joiningContest === id) {
			leaveContest()
				.then((res) => toast.success(res.msg))
				.catch((err) => toast.error(err.response?.data?.msg))
				.finally(() => setJoining(false));
		} else {
			joinContest(id)
				.then((res) => toast.success(res.msg))
				.catch((err) => toast.error(err.response?.data?.msg))
				.finally(() => setJoining(false));
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
		return `${hours}h ${minutes}m`;
	};

	const formatDurationFromMs = (diffMs) => {
		const totalSec = Math.floor(diffMs / 1000);
		const hours = String(Math.floor(totalSec / 3600)).padStart(2, '0');
		const minutes = String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0');
		const seconds = String(totalSec % 60).padStart(2, '0');
		return `${hours}:${minutes}:${seconds}`;
	};

	const getContestStatus = () => {
		if (!contest.startTime || !contest.endTime) return 'unknown';
		const now = Date.now();
		if (contest.startTime > now) return 'upcoming';
		if (contest.endTime < now) return 'ended';
		return 'ongoing';
	};

	useEffect(() => {
		setLoading(true);
		getContest(id)
			.then((res) => {
				res.data.startTime = new Date(res.data.startTime);
				res.data.endTime = new Date(res.data.endTime);
				setContest(res.data);
			})
			.catch((err) => toast.error(err.response?.data?.msg))
			.finally(() => setLoading(false));
	}, [id, user, t]);

	useEffect(() => {
		if (!contest.startTime || !contest.endTime) return;

		const status = getContestStatus();
		if (status === 'ongoing') {
			const timer = setInterval(() => {
				const now = Date.now();
				const totalDuration = contest.endTime - contest.startTime;
				const elapsed = now - contest.startTime;
				const remaining = contest.endTime - now;

				setProgress(Math.min(Math.floor((elapsed / totalDuration) * 100), 100));

				if (remaining <= 0) {
					clearInterval(timer);
					setTimeLeft('00:00:00');
					return;
				}

				setTimeLeft(formatDurationFromMs(remaining));
			}, 1000);

			return () => clearInterval(timer);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [contest]);

	const contestStatus = getContestStatus();

	return (
		<div className="flex-1 px-4 py-6 md:px-8 lg:px-14">
			<div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
				<div className="flex items-center gap-3">
					<Link
						to={routesConfig.contests}
						className="mr-2 rounded-full bg-gray-100 p-2 transition-colors hover:bg-gray-200 dark:bg-neutral-700/50 dark:text-gray-100 dark:hover:bg-neutral-700 dark:hover:text-white"
					>
						<ArrowLeft className="size-5" />
					</Link>
					<img src={contestImg} className="size-10 p-1" />
					<div>
						<h2 className="text-2xl font-bold dark:text-gray-50">{contest.title || <Skeleton className="h-8 w-48" />}</h2>
						<div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-300">
							{loading ? (
								<Skeleton className="h-5 w-32" />
							) : (
								<>
									<Clock className="size-4" />
									<span>{formatDuration(contest?.startTime || new Date(), contest?.endTime || new Date())}</span>
								</>
							)}
						</div>
					</div>
				</div>

				<div className="flex items-center gap-3">
					{contestStatus !== 'unknown' && (
						<Badge
							data-status={contestStatus}
							className={`rounded border px-3 py-1 text-sm font-medium capitalize !text-white shadow-sm transition-colors data-[status=ended]:bg-gray-500 data-[status=ongoing]:bg-green-500 data-[status=upcoming]:bg-blue-500 data-[status=ended]:hover:bg-gray-600 data-[status=ongoing]:hover:bg-green-600 data-[status=upcoming]:hover:bg-blue-600 dark:shadow-lg dark:shadow-blue-500/10 dark:data-[status=ended]:bg-neutral-600 dark:data-[status=ongoing]:bg-emerald-600/70 dark:data-[status=upcoming]:bg-blue-600/60 dark:data-[status=ended]:hover:bg-neutral-500 dark:data-[status=ongoing]:hover:bg-emerald-500/80 dark:data-[status=upcoming]:hover:bg-blue-500/80`}
						>
							{t(contestStatus)}
						</Badge>
					)}

					<Button
						variant={user?.joiningContest === id ? 'destructive' : 'default'}
						data-joining={user?.joiningContest === id}
						className={`bg-green-500 px-6 font-medium capitalize text-white shadow-sm transition-all hover:bg-green-600 data-[joining=true]:bg-red-600 data-[joining=true]:hover:bg-red-700 dark:bg-emerald-600/80 dark:shadow-lg dark:shadow-emerald-500/10 dark:hover:bg-emerald-500 data-[joining=true]:dark:bg-red-600/80 data-[joining=true]:dark:hover:bg-red-500`}
						disabled={joining || contestStatus !== 'ongoing'}
						onClick={handleJoinLeave}
					>
						{joining ? (
							<span className="flex items-center gap-2">
								<span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
								{user?.joiningContest === id ? t('leaving...') : t('joining...')}
							</span>
						) : (
							<span className="flex items-center gap-2">{user?.joiningContest === id ? t('leave') : t('join')}</span>
						)}
					</Button>
				</div>
			</div>

			{contestStatus === 'ongoing' && (
				<Card className="mb-6 overflow-hidden dark:border-neutral-700/50 dark:bg-neutral-800/60 dark:shadow-xl dark:shadow-blue-900/5">
					<CardContent className="p-4">
						<div className="flex flex-col items-center justify-between gap-4 md:flex-row">
							<div className="flex items-center gap-3">
								<Clock className="size-5 text-blue-500 dark:text-blue-400" />
								<div>
									<div className="text-sm capitalize text-gray-500 dark:text-gray-300">{t('time_remaining')}</div>
									<div className="font-mono text-2xl font-bold dark:text-gray-50">{timeLeft || '--:--:--'}</div>
								</div>
							</div>
							<div className="w-full md:w-1/2">
								<Progress value={progress} className="h-3 w-full dark:bg-neutral-700 dark:fill-blue-500" />
								<div className="mt-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
									<span>{formatStartTime(contest?.startTime || new Date())}</span>
									<span>{formatStartTime(contest?.endTime || new Date())}</span>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			)}

			<Tabs defaultValue="a" className="w-full">
				<div className="border-b border-gray-200 dark:border-neutral-700/50">
					<TabsList className="h-12 !bg-transparent">
						<TabsTrigger
							className="h-12 gap-2 rounded-none px-6 text-gray-600 transition-colors data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-none dark:text-gray-300 dark:data-[state=active]:border-blue-400 dark:data-[state=active]:bg-neutral-800/80 dark:data-[state=active]:text-blue-400"
							value="a"
						>
							<Info className="size-4" />
							<span className="capitalize">{t('info')}</span>
						</TabsTrigger>

						{(user?.permission === 'Admin' || user?.joiningContest === id) && (
							<>
								<TabsTrigger
									className="h-12 gap-2 rounded-none px-6 text-gray-600 transition-colors data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-none dark:text-gray-300 dark:data-[state=active]:border-blue-400 dark:data-[state=active]:bg-neutral-800/80 dark:data-[state=active]:text-blue-400"
									value="c"
								>
									<Trophy className="size-4" />
									<span className="capitalize">{t('standing')}</span>
								</TabsTrigger>

								<TabsTrigger
									className="h-12 gap-2 rounded-none px-6 text-gray-600 transition-colors data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-none dark:text-gray-300 dark:data-[state=active]:border-blue-400 dark:data-[state=active]:bg-neutral-800/80 dark:data-[state=active]:text-blue-400"
									value="d"
									asChild
								>
									<Link to={`${routesConfig.problems}?contest=true`}>
										<FileText className="size-4" />
										<span className="capitalize">{t('problems')}</span>
									</Link>
								</TabsTrigger>

								<TabsTrigger
									className="h-12 gap-2 rounded-none px-6 text-gray-600 transition-colors data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-none dark:text-gray-300 dark:data-[state=active]:border-blue-400 dark:data-[state=active]:bg-neutral-800/80 dark:data-[state=active]:text-blue-400"
									value="e"
									asChild
								>
									<Link to={`${routesConfig.submissions}?contest=${user?.joiningContest}`}>
										<Send className="size-4" />
										<span className="capitalize">{t('submissions')}</span>
									</Link>
								</TabsTrigger>
							</>
						)}
					</TabsList>
				</div>

				<TabsContent value="a" className="mt-6">
					{loading ? (
						<Card className="dark:border-neutral-700/50 dark:bg-neutral-800/60 dark:shadow-xl dark:shadow-blue-900/5">
							<CardHeader>
								<Skeleton className="mx-auto mb-2 h-8 w-1/3 rounded-full dark:bg-neutral-700"></Skeleton>
								<Skeleton className="mx-auto mb-4 h-6 w-1/2 rounded-full dark:bg-neutral-700"></Skeleton>
							</CardHeader>
							<CardContent>
								<Skeleton className="my-1 h-5 w-full rounded-full dark:bg-neutral-700"></Skeleton>
								<Skeleton className="my-1 h-5 w-3/4 rounded-full dark:bg-neutral-700"></Skeleton>
								<Skeleton className="my-1 h-5 w-5/6 rounded-full dark:bg-neutral-700"></Skeleton>
								<Skeleton className="my-1 h-5 w-2/3 rounded-full dark:bg-neutral-700"></Skeleton>
								<Skeleton className="my-1 h-5 w-4/5 rounded-full dark:bg-neutral-700"></Skeleton>
							</CardContent>
						</Card>
					) : (
						<Card className="dark:border-neutral-700/50 dark:bg-neutral-800/60 dark:shadow-xl dark:shadow-blue-900/5">
							<CardHeader className="pb-2">
								<CardTitle className="text-center text-2xl font-bold text-blue-500 dark:text-blue-400">{t(contestStatus)}</CardTitle>
								<div className="text-center text-gray-600 dark:text-gray-200">
									<span className="font-semibold capitalize">{formatDuration(contest?.startTime || new Date(), contest?.endTime || new Date())}</span>{' '}
									<span className="font-light">{t('since')}</span> <span className="font-medium">{formatStartTime(contest?.startTime || new Date())}</span>
								</div>
							</CardHeader>
							<CardContent className="prose dark:prose-invert max-w-full border-t border-gray-100 pt-4 dark:border-neutral-700/50">
								<Markdown components={markdownComponents}>{contest?.description}</Markdown>
							</CardContent>
						</Card>
					)}
				</TabsContent>

				<TabsContent value="c" className="mt-6">
					<Card className="dark:border-neutral-700/50 dark:bg-neutral-800/60 dark:shadow-xl dark:shadow-blue-900/5">
						<CardContent className="overflow-x-auto p-0">
							<table className="w-full text-sm">
								<thead>
									<tr className="border-b border-gray-200 bg-gray-50 dark:border-neutral-700/70 dark:bg-neutral-700/30">
										<th scope="col" className="w-24 px-6 py-4 text-center font-medium capitalize text-gray-700 dark:text-gray-200">
											{t('top')}
										</th>
										<th scope="col" className="px-6 py-4 text-left font-medium capitalize text-gray-700 dark:text-gray-200">
											{t('name')}
										</th>
										<th
											scope="col"
											className="w-32 border-x border-gray-200 px-6 py-4 text-center font-medium capitalize text-gray-700 dark:border-neutral-700/70 dark:text-gray-200"
										>
											{t('total')}
										</th>
										{contest?.problems?.map((item, index) => (
											<th
												scope="col"
												key={index}
												className="h-12 w-20 border-x border-gray-200 py-4 text-center font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-neutral-700/70 dark:text-gray-200 dark:hover:bg-neutral-700/50"
											>
												<Link className="block p-2 hover:text-blue-500 dark:hover:text-blue-400" to={routesConfig.problem.replace(':id', item)}>
													{String.fromCharCode(65 + index)}
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
												className="border-b border-gray-200 transition-colors hover:bg-gray-50 dark:border-neutral-700/50 dark:hover:bg-neutral-700/20"
											>
												<td className="px-6 py-4 text-center">
													<div
														data-top={index + 1}
														data-top3={index < 3}
														className={`inline-flex size-8 items-center justify-center rounded-full bg-gray-50 font-bold text-gray-500 shadow-sm data-[top=1]:bg-yellow-100 data-[top=2]:bg-gray-100 data-[top=3]:bg-amber-950 data-[top=3]:bg-opacity-10 data-[top3=true]:font-semibold data-[top=1]:text-yellow-700 data-[top=2]:text-gray-700 data-[top=3]:text-amber-700 dark:bg-neutral-800/80 dark:text-gray-300 dark:shadow-gray-900/20 data-[top=1]:dark:bg-yellow-900/40 data-[top=2]:dark:bg-gray-800/70 data-[top=3]:dark:bg-amber-900/40 data-[top=1]:dark:text-yellow-400 data-[top=2]:dark:text-gray-300 data-[top=3]:dark:text-amber-400 data-[top=1]:dark:shadow-yellow-900/20 data-[top=2]:dark:shadow-gray-900/20 data-[top=3]:dark:shadow-amber-900/20`}
													>
														{index + 1}
													</div>
												</td>
												<td className="px-6 py-4">
													<Link
														className="flex items-center gap-3 text-gray-800 transition-colors hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400"
														to={routesConfig.user.replace(':name', item.user)}
													>
														<Avatar className="size-8 border border-gray-200 dark:border-neutral-700/50 dark:shadow-lg dark:shadow-blue-900/5">
															<div className="flex size-full items-center justify-center bg-blue-100 font-medium text-blue-600 dark:bg-blue-900/50 dark:text-blue-300">
																{item.user.charAt(0).toUpperCase()}
															</div>
														</Avatar>
														<div>
															<div className="font-medium">{item.user}</div>
															{item.user === user?.name && <span className="text-xs font-medium text-blue-500 dark:text-blue-400">({t('you')})</span>}
														</div>
													</Link>
												</td>
												<td className="border-x border-gray-200 px-6 py-4 dark:border-neutral-700/50">
													<Link
														to={`${routesConfig.submissions}?contest=${id}&author=${item.user}`}
														className="block rounded p-2 text-center transition-colors hover:bg-gray-100 dark:hover:bg-neutral-700/50"
													>
														<div className="text-lg font-bold dark:text-white">{item.score.reduce((acc, cur) => acc + cur, 0)}</div>
														<div className="text-xs text-gray-500 dark:text-gray-400">
															{formatDurationFromMs(item.time.reduce((acc, cur) => acc + cur, 0))}
														</div>
													</Link>
												</td>
												{contest?.problems?.map((problem, index) => (
													<td key={index} className="border-x border-gray-200 px-6 py-4 dark:border-neutral-700/50">
														{item?.status?.[index] && (
															<Link
																to={`${routesConfig.submissions}?contest=${id}&author=${item.user}&problem=${problem}`}
																className="block rounded p-2 text-center transition-colors hover:bg-gray-100 dark:hover:bg-neutral-700/50"
															>
																<div
																	data-status={item?.score?.[index] == 0 ? '0' : item?.status?.[index] == 'AC' ? '2' : '1'}
																	className={`text-lg font-bold data-[status=0]:text-red-500 data-[status=1]:text-yellow-500 data-[status=2]:text-green-500 data-[status=0]:dark:text-red-400 data-[status=1]:dark:text-yellow-400 data-[status=2]:dark:text-emerald-400`}
																>
																	{item?.score?.[index]}
																</div>
																<div className="text-xs text-gray-500 dark:text-gray-400">
																	{item?.time?.[index] && formatDurationFromMs(item?.time?.[index])}
																</div>
															</Link>
														)}
													</td>
												))}
											</tr>
										))}
								</tbody>
							</table>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default Contest;
