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
		<div className="flex flex-1 gap-4 p-6 px-14">
			<div className="w-64 rounded-lg bg-white p-6 py-8 shadow dark:bg-neutral-800">
				{loading ? (
					<>
						<div className="flex flex-col items-center text-center">
							<Skeleton className="mb-2 h-28 w-28 rounded-full" />
							<Skeleton className="mb-1 h-8 w-32" />
							<Skeleton className="h-3 w-24" />
						</div>
						<div className="mt-8 space-y-2 text-sm text-gray-700">
							<Skeleton className="h-5"></Skeleton>
							<Skeleton className="h-5"></Skeleton>
							<Skeleton className="h-5"></Skeleton>
							<Skeleton className="h-5"></Skeleton>
							<Skeleton className="h-5"></Skeleton>
						</div>
					</>
				) : (
					<>
						<div className="flex flex-col items-center text-center">
							<UserAvatar className="size-28" user={user}></UserAvatar>
							<h2 className="mt-2 text-xl font-bold dark:text-white">{user.fullname}</h2>
							<p className="text-sm text-gray-500 dark:text-gray-400">@{user.name}</p>
						</div>
						<div className="mt-8 space-y-2 text-sm text-gray-700 dark:text-gray-300">
							<p className="capitalize">
								🏆 {t('rank')}: <span className="font-semibold">#{user.top}</span>
							</p>
							<p className="capitalize">
								🌟 {t('score')}: <span className="font-semibold">{user.totalScore}p</span>
							</p>
							<p className="capitalize">
								✅ {t('solved')}: <span className="font-semibold">{user.totalAC}</span>
							</p>
							<p className="capitalize">
								📄 {t('submissions')}: <span className="font-semibold">{user.totalAttempt}</span>
							</p>
							<p className="capitalize">
								📅 {t('join-date')}:{' '}
								<span className="font-semibold">
									{new Intl.DateTimeFormat('vi-VN', {
										day: '2-digit',
										month: '2-digit',
										year: 'numeric',
									}).format(new Date(user.createdAt) || Date.now())}
								</span>
							</p>
						</div>
					</>
				)}
			</div>

			<div className="flex-1 rounded-lg bg-white p-4 shadow dark:bg-neutral-800">
				<Tabs defaultValue={searchParams.get('tab') || '1'} className="h-full w-full">
					<TabsList className="mb-4 h-14 gap-6 dark:!bg-zinc-900">
						<TabsTrigger className="h-12 w-16 p-1 dark:data-[state=active]:!bg-neutral-700" value="1">
							{loading ? <Skeleton className={'size-8 rounded-full'}></Skeleton> : <UserAvatar user={user}></UserAvatar>}
						</TabsTrigger>
						<TabsTrigger className="h-12 w-16 p-1 dark:data-[state=active]:!bg-neutral-700" value="2">
							<img src={ProblemImg} alt="problem" className="size-8" />
						</TabsTrigger>
						<TabsTrigger className="h-12 w-16 p-1 dark:data-[state=active]:!bg-neutral-700" asChild value="3">
							<Link to={`${routesConfig.submissions}?author=${name}`}>
								<img src={SubmissionImg} alt="submission" className="size-8" />
							</Link>
						</TabsTrigger>
						<TabsTrigger className="h-12 w-16 p-1 dark:data-[state=active]:!bg-neutral-700" value="4">
							<img src={ContestImg} alt="contest" className="size-8" />
						</TabsTrigger>
					</TabsList>

					<TabsContent value="1">
						<div className="px-4">
							<h3 className="mb-2 text-2xl font-semibold capitalize dark:text-gray-100">{t('about-me')}:</h3>
							<Markdown components={markdownComponents}>{user?.bio}</Markdown>
						</div>
					</TabsContent>
					<TabsContent value="2" className="h-full">
						<div className="flex flex-1 gap-2">
							<div className="flex h-auto w-[338px] flex-col gap-1">
								<h3 className="text-sm font-semibold capitalize text-green-500">{t('accepted')}</h3>
								<ProblemPanel
									loading={loading}
									problems={Object.entries(problems)
										// eslint-disable-next-line no-unused-vars
										.filter(([key, item]) => item.status === 'Accepted')
										// eslint-disable-next-line no-unused-vars
										.map(([key, item]) => item)}
								></ProblemPanel>
								<h3 className="mt-5 text-sm font-semibold capitalize text-orange-500">{t('attempting')}</h3>
								<ProblemPanel
									loading={loading}
									problems={Object.entries(problems)
										// eslint-disable-next-line no-unused-vars
										.filter(([key, item]) => item.status === 'Attempted')
										// eslint-disable-next-line no-unused-vars
										.map(([key, item]) => item)}
								></ProblemPanel>
							</div>
							<div className="-mt-20 flex flex-1 items-center">
								<div className="h-[90%] w-[1px] border border-gray-200 dark:border-neutral-700"></div>
								<div className="ml-2 h-full flex-1 space-y-2 overflow-auto">
									<h2 className="text-xl capitalize dark:text-white">{t('problems')}</h2>
									{loading ? (
										<>
											<Skeleton className="h-14 rounded-md" />
											<Skeleton className="h-14 rounded-md" />
											<Skeleton className="h-14 rounded-md" />
											<Skeleton className="h-14 rounded-md" />
											<Skeleton className="h-14 rounded-md" />
										</>
									) : (
										Object.entries(problems)?.map(([id, item], index) => (
											<Link
												to={routesConfig.problem.replace(':id', id)}
												key={index}
												className="flex h-14 items-center gap-2 rounded-md border border-gray-100 bg-gray-50 !bg-opacity-60 px-4 transition-all duration-150 hover:cursor-pointer hover:shadow-md dark:border-zinc-700 dark:bg-neutral-700"
											>
												{item.status === 'Accepted' ? (
													<Check className="size-5 text-green-500"></Check>
												) : (
													<div className="size-5 rounded-full border-2 border-gray-400 dark:border-gray-300"></div>
												)}
												<p className="text-[15px] dark:text-gray-100">{item.name}</p>
												<p
													data-diff={item.difficulty}
													className="ml-auto text-sm capitalize data-[diff=easy]:text-green-500 data-[diff=hard]:text-red-500 data-[diff=medium]:text-yellow-500"
												>
													{t(item.difficulty)}
												</p>
											</Link>
										))
									)}
								</div>
							</div>
						</div>
					</TabsContent>
					<TabsContent value="4">
						<div className="grid grid-cols-[repeat(auto-fit,minmax(360px,1fr))] gap-4">
							{user?.joinedContest?.map((contest, index) => (
								<ContestCard key={index} id={contest} username={name}></ContestCard>
							))}
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
};

export default User;
