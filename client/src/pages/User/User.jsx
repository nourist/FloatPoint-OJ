import { Tabs, TabsContent, TabsTrigger, TabsList } from '~/components/ui/tabs';
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Skeleton } from '~/components/ui/skeleton';
import { useTranslation } from 'react-i18next';
import Markdown from 'react-markdown';

import { getUser } from '~/services/user';
import UserAvatar from '~/components/UserAvatar';
import ProblemImg from '~/assets/images/list.png';
import SubmissionImg from '~/assets/images/answer.png';
import ContestImg from '~/assets/images/contest.png';
import markdownComponents from '~/config/markdownComponents';

const User = () => {
	const { name } = useParams();
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

	console.log(problems);

	return (
		<div className="p-6 px-14 flex-1 flex gap-4">
			<div className="bg-white rounded-lg shadow p-6 py-8 w-64">
				{loading ? (
					<>
						<div className="flex flex-col items-center text-center">
							<Skeleton className="w-28 h-28 rounded-full mb-2" />
							<Skeleton className="w-32 h-8 mb-1" />
							<Skeleton className="w-24 h-3" />
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
							<h2 className="text-xl font-bold mt-2">{user.fullname}</h2>
							<p className="text-sm text-gray-500">@{user.name}</p>
						</div>
						<div className="mt-8 space-y-2 text-sm text-gray-700">
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

			<div className="flex-1 bg-white rounded-lg shadow p-4">
				<Tabs defaultValue="1" className="w-full h-full">
					<TabsList className="mb-4 h-14 gap-4">
						<TabsTrigger className="size-12 p-1" value="1">
							<UserAvatar user={user}></UserAvatar>
						</TabsTrigger>
						<TabsTrigger className="size-12 p-1" value="2">
							<img src={ProblemImg} alt="problem" className="size-8" />
						</TabsTrigger>
						<TabsTrigger className="size-12 p-1" value="3">
							<img src={SubmissionImg} alt="submission" className="size-8" />
						</TabsTrigger>
						<TabsTrigger className="size-12 p-1" value="4">
							<img src={ContestImg} alt="contest" className="size-8" />
						</TabsTrigger>
					</TabsList>

					<TabsContent value="1">
						<div className="px-4">
							<h3 className="text-2xl font-semibold mb-2 capitalize">{t('about-me')}:</h3>
							<Markdown components={markdownComponents}>{user?.bio}</Markdown>
						</div>
					</TabsContent>
					<TabsContent value="2" className="h-full">
						<div className="h-full flex gap-2">
							<div className="w-[248px] pb-20"></div>
							<div className="flex-1 -mt-20">abc</div>
						</div>
					</TabsContent>
					<TabsContent value="3"></TabsContent>
					<TabsContent value="4"></TabsContent>
				</Tabs>
			</div>
		</div>
	);
};

export default User;
