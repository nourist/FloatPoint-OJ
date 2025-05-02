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

	function formatStartTime(date) {
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
	}

	function formatDuration(start, end) {
		const diffMs = end - start;
		const diffMins = Math.floor(diffMs / 60000);
		const hours = String(Math.floor(diffMins / 60)).padStart(2, '0');
		const minutes = String(diffMins % 60).padStart(2, '0');
		return `${hours} hours, ${minutes} minutes`;
	}

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

	console.log(contest);

	return (
		<div className="flex-1 px-14 py-6">
			<h2 className="dark:text-gray-100 text-2xl mb-1">{contest.title}</h2>
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
						className="capitalize float-right data-[type=join]:!bg-green-500 data-[type=leave]:!bg-red-600 hover:data-[type=join]:!bg-green-600 hover:data-[type=leave]:!bg-red-500 dark:text-white"
						disabled={jloining}
						onClick={handleJoinLeave}
					>
						{user?.joiningContest === id ? t('leave') : t('join')}
					</Button>

					<TabsContent value="a">
						{loading ? (
							<div className="pt-2 border-t border-gray-500 dark:border-neutral-700">
								<Skeleton className="w-1/3 h-8 mb-2 rounded-full mx-auto"></Skeleton>
								<Skeleton className="w-1/2 h-6 mb-4 rounded-full mx-auto"></Skeleton>
								<Skeleton className={`w-[562px] h-5 rounded-full my-1`}></Skeleton>
								<Skeleton className={`w-[123px] h-5 rounded-full my-1`}></Skeleton>
								<Skeleton className={`w-[532px] h-5 rounded-full my-1`}></Skeleton>
								<Skeleton className={`w-[862px] h-5 rounded-full my-1`}></Skeleton>
								<Skeleton className={`w-[264px] h-5 rounded-full my-1`}></Skeleton>
								<Skeleton className={`w-[752px] h-5 rounded-full my-1`}></Skeleton>
								<Skeleton className={`w-[562px] h-5 rounded-full my-1`}></Skeleton>
								<Skeleton className={`w-[123px] h-5 rounded-full my-1`}></Skeleton>
								<Skeleton className={`w-[532px] h-5 rounded-full my-1`}></Skeleton>
							</div>
						) : (
							<div className="pt-2 border-t border-gray-500 dark:border-neutral-700">
								<h3 className="text-sky-500 w-full text-center text-2xl">
									{t(contest.startTime > Date.now() ? 'upcoming' : contest.endTime < Date.now() ? 'ended' : 'ongoing')}
								</h3>
								<div className="dark:text-gray-200 capitalize w-full text-center font-semibold mb-3">
									{formatDuration(contest?.startTime || new Date(), contest?.endTime || new Date())} <span className="font-light lowercase">{t('since')}</span>{' '}
									{formatStartTime(contest?.startTime || new Date())}
								</div>
								<Markdown components={markdownComponents}>{contest?.description}</Markdown>
							</div>
						)}
					</TabsContent>
					<TabsContent value="c">
						<div>
							<p>{'no'}</p>
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
};

export default Contest;
