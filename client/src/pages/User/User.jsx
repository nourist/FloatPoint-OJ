import { Tabs, TabsContent, TabsTrigger, TabsList } from '~/components/ui/tabs';
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Skeleton } from '~/components/ui/skeleton';
import { useTranslation } from 'react-i18next';
import Markdown from 'react-markdown';
import { Link } from 'react-router';
import { Check } from 'lucide-react';
import { useSearchParams } from 'react-router';

import { getUser } from '~/services/user';
import UserAvatar from '~/components/UserAvatar';
import ProblemImg from '~/assets/images/list.png';
import SubmissionImg from '~/assets/images/answer.png';
import ContestImg from '~/assets/images/contest.png';
import markdownComponents from '~/config/markdownComponents';
import ProblemPanel from '~/components/ProblemPanel';
import routesConfig from '~/config/routes';
import ContestCard from '~/components/ContestCard';

const User = () => {
	const { name } = useParams();
	const [searchParams] = useSearchParams();
	const { t } = useTranslation('user');

	const [user, setUser] = useState(null);
	const [problems, setProblems] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(true);
		getUser(name)
			.then((res) => {
				setUser(res.data);
				setProblems(res.problems);
			})
			.catch((err) => toast.error(err.response.data.msg))
			.finally(() => setLoading(false));
	}, [name]);

	return (
		<div className="flex min-h-screen flex-col gap-6 bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8 dark:from-neutral-900 dark:to-neutral-800">
			{/* Header */}
			<div className="mx-auto w-full max-w-7xl">
				<h1 className="text-3xl font-bold capitalize text-gray-800 dark:text-white">{t('user-profile')}</h1>
			</div>

			{/* Main Content */}
			<div className="mx-auto flex w-full max-w-7xl flex-col gap-6 lg:flex-row">
				{/* Profile Sidebar */}
				<div className="w-full rounded-2xl bg-white p-6 shadow-lg lg:w-80 dark:bg-neutral-800">
					{loading ? (
						<>
							<div className="flex flex-col items-center text-center">
								<Skeleton className="mb-4 h-32 w-32 rounded-full" />
								<Skeleton className="mb-2 h-6 w-40" />
								<Skeleton className="h-4 w-28" />
							</div>
							<div className="mt-8 space-y-3">
								{[...Array(5)].map((_, i) => (
									<div key={i} className="flex items-center">
										<Skeleton className="h-5 w-5 rounded-full" />
										<Skeleton className="ml-3 h-4 flex-1" />
									</div>
								))}
							</div>
						</>
					) : (
						<>
							<div className="flex flex-col items-center text-center">
								<UserAvatar className="size-32 border-4 border-white shadow-lg dark:border-neutral-900" user={user} />
								<h2 className="mt-4 text-2xl font-bold capitalize text-gray-800 dark:text-white">{user.fullname}</h2>
								<p className="text-gray-500 dark:text-gray-400">@{user.name}</p>
							</div>
							<div className="mt-8 space-y-3">
								<div className="flex items-center rounded-lg bg-gray-50 p-3 dark:bg-neutral-700">
									<span className="flex size-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200">🏆</span>
									<div className="ml-3">
										<p className="text-sm capitalize text-gray-500 dark:text-gray-300">{t('rank')}</p>
										<p className="font-semibold text-gray-800 dark:text-white">#{user.top}</p>
									</div>
								</div>
								<div className="flex items-center rounded-lg bg-gray-50 p-3 dark:bg-neutral-700">
									<span className="flex size-8 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-200">
										🌟
									</span>
									<div className="ml-3">
										<p className="text-sm capitalize text-gray-500 dark:text-gray-300">{t('score')}</p>
										<p className="font-semibold text-gray-800 dark:text-white">{user.totalScore}p</p>
									</div>
								</div>
								<div className="flex items-center rounded-lg bg-gray-50 p-3 dark:bg-neutral-700">
									<span className="flex size-8 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-200">
										✅
									</span>
									<div className="ml-3">
										<p className="text-sm capitalize text-gray-500 dark:text-gray-300">{t('solved')}</p>
										<p className="font-semibold text-gray-800 dark:text-white">{user.totalAC}</p>
									</div>
								</div>
								<div className="flex items-center rounded-lg bg-gray-50 p-3 dark:bg-neutral-700">
									<span className="flex size-8 items-center justify-center rounded-full bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-200">
										📄
									</span>
									<div className="ml-3">
										<p className="text-sm capitalize text-gray-500 dark:text-gray-300">{t('submissions')}</p>
										<p className="font-semibold text-gray-800 dark:text-white">{user.totalAttempt}</p>
									</div>
								</div>
								<div className="flex items-center rounded-lg bg-gray-50 p-3 dark:bg-neutral-700">
									<span className="flex size-8 items-center justify-center rounded-full bg-pink-100 text-pink-600 dark:bg-pink-900 dark:text-pink-200">📅</span>
									<div className="ml-3">
										<p className="text-sm capitalize text-gray-500 dark:text-gray-300">{t('join-date')}</p>
										<p className="font-semibold text-gray-800 dark:text-white">
											{new Intl.DateTimeFormat('vi-VN', {
												day: '2-digit',
												month: '2-digit',
												year: 'numeric',
											}).format(new Date(user.createdAt) || Date.now())}
										</p>
									</div>
								</div>
							</div>
						</>
					)}
				</div>

				{/* Main Panel */}
				<div className="flex-1 rounded-2xl bg-white p-6 shadow-lg dark:bg-neutral-800">
					<Tabs defaultValue={searchParams.get('tab') || '1'} className="h-full w-full">
						<TabsList className="mb-6 h-14 gap-2 rounded-xl bg-gray-100 p-2 dark:bg-neutral-700">
							<TabsTrigger
								className="h-10 rounded-lg px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-neutral-600"
								value="1"
							>
								{loading ? (
									<Skeleton className="size-6 rounded-full" />
								) : (
									<div className="flex items-center gap-2">
										<UserAvatar user={user} className="size-6" />
										<span className="text-sm font-medium capitalize">{t('profile')}</span>
									</div>
								)}
							</TabsTrigger>
							<TabsTrigger
								className="h-10 rounded-lg px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-neutral-600"
								value="2"
							>
								<div className="flex items-center gap-2">
									<img src={ProblemImg} alt="problem" className="size-5" />
									<span className="text-sm font-medium capitalize">{t('problems')}</span>
								</div>
							</TabsTrigger>
							<TabsTrigger
								className="h-10 rounded-lg px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-neutral-600"
								asChild
								value="3"
							>
								<Link to={`${routesConfig.submissions}?author=${name}`} className="flex items-center gap-2">
									<img src={SubmissionImg} alt="submission" className="size-5" />
									<span className="text-sm font-medium capitalize">{t('submissions')}</span>
								</Link>
							</TabsTrigger>
							<TabsTrigger
								className="h-10 rounded-lg px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-neutral-600"
								value="4"
							>
								<div className="flex items-center gap-2">
									<img src={ContestImg} alt="contest" className="size-5" />
									<span className="text-sm font-medium capitalize">{t('contests')}</span>
								</div>
							</TabsTrigger>
						</TabsList>

						<TabsContent value="1" className="mt-0">
							<div className="px-2">
								<h3 className="mb-4 text-2xl font-bold capitalize text-gray-800 dark:text-white">{t('about-me')}</h3>
								<div className="prose dark:prose-invert max-w-none rounded-lg bg-gray-50 p-4 dark:bg-neutral-700">
									<Markdown components={markdownComponents}>{user?.bio || t('no-bio')}</Markdown>
								</div>
							</div>
						</TabsContent>

						<TabsContent value="2" className="mt-0 h-full">
							<div className="flex flex-col gap-6 md:flex-row">
								<div className="w-full md:w-96">
									<div className="mb-4">
										<h3 className="text-lg font-semibold capitalize text-green-600 dark:text-green-400">{t('accepted')}</h3>
										<ProblemPanel
											loading={loading}
											problems={Object.entries(problems)
												.filter(([_, item]) => item.status === 'Accepted')
												.map(([_, item]) => item)}
										/>
									</div>
									<div className="mt-6">
										<h3 className="text-lg font-semibold capitalize text-orange-600 dark:text-orange-400">{t('attempting')}</h3>
										<ProblemPanel
											loading={loading}
											problems={Object.entries(problems)
												.filter(([_, item]) => item.status === 'Attempted')
												.map(([_, item]) => item)}
										/>
									</div>
								</div>
								<div className="hidden md:block">
									<div className="h-full w-px bg-gray-200 dark:bg-neutral-600" />
								</div>
								<div className="flex-1">
									<h2 className="mb-4 text-xl font-bold capitalize text-gray-800 dark:text-white">{t('all-problems')}</h2>
									<div className="space-y-3">
										{loading
											? [...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)
											: Object.entries(problems)?.map(([id, item], index) => (
													<Link
														to={routesConfig.problem.replace(':id', id)}
														key={index}
														className="flex items-center gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4 transition-all hover:border-gray-200 hover:shadow-md dark:border-neutral-700 dark:bg-neutral-700 dark:hover:border-neutral-600"
													>
														{item.status === 'Accepted' ? (
															<div className="flex size-8 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-200">
																<Check className="size-5" />
															</div>
														) : (
															<div className="size-8 rounded-full border-2 border-gray-300 dark:border-gray-400" />
														)}
														<div className="flex-1">
															<p className="font-medium capitalize text-gray-800 dark:text-gray-100">{item.name}</p>
														</div>
														<span
															className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
																item.difficulty === 'easy'
																	? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
																	: item.difficulty === 'medium'
																		? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
																		: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
															}`}
														>
															{t(item.difficulty)}
														</span>
													</Link>
												))}
									</div>
								</div>
							</div>
						</TabsContent>

						<TabsContent value="4" className="mt-0">
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
								{user?.joinedContest?.map((contest, index) => (
									<ContestCard key={index} id={contest} username={name} />
								))}
							</div>
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</div>
	);
};

export default User;
