import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';
import { LoaderCircle, Mail, Calendar, Activity, ShieldUser, User, CircleCheckBig, Code, TrendingUp, Trophy, UserRound } from 'lucide-react';
import Markdown from 'react-markdown';
import { Progress } from '@material-tailwind/react';
import Chart from 'react-apexcharts';

import { capitalize } from '~/utils/string';
import useThemeStore from '~/stores/themeStore';
import UserAvatar from '~/components/UserAvatar';
import { getUser } from '~/services/user';
import Error from '~/components/Error';
import markdownComponents from '~/config/markdown';
import { getSubmissions } from '~/services/submission';
import { getUsers } from '~/services/user';
import statusColors from '~/config/statusColor';

const UserId = () => {
	const { name } = useParams();
	const { t } = useTranslation('user');
	const { theme } = useThemeStore();

	const {
		data: user,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['user', name],
		queryFn: () =>
			getUser(name).then((res) => ({
				...res,
				problems: Object.values(res.problems).reduce((acc, cur) => ({ ...acc, [cur.difficulty]: acc[cur.difficulty] + 1 }), { easy: 0, medium: 0, hard: 0 }),
			})),
	});

	const {
		data: submissions,
		isLoading: submissionLoading,
		error: submissionErr,
	} = useQuery({
		queryKey: ['minimal-user-submissions', name],
		queryFn: () => getSubmissions({ author: name, miminal: true, size: 1e7 }),
	});

	const {
		data: ACsubms,
		isLoading: ACsubmsLoading,
		error: ACsubmsErr,
	} = useQuery({
		queryKey: ['minimal-user-accepted', name],
		queryFn: () => getSubmissions({ author: name, minimal: true, size: 1e7, status: 'AC' }),
	});

	const {
		data: users,
		isLoading: usersLoading,
		error: userErr,
	} = useQuery({
		queryKey: ['minimal-users'],
		queryFn: () => getUsers({ size: 1e9, minimal: true }).then((res) => res.data),
	});

	if (isLoading || submissionLoading || usersLoading || ACsubmsLoading) {
		return (
			<div className="flex-center h-[calc(100vh-100px)]">
				<LoaderCircle className="text-base-content/15 mx-auto size-32 animate-spin" />
			</div>
		);
	}

	if (error || submissionErr || userErr || ACsubmsErr) {
		return (
			<div className="min-h-[calc(100vh-100px)]">
				<Error keys={[['user', name], ['minimal-user-submissions', name], ['minimal-user-accepted', name], ['minimal-users']]}>
					{error || submissionErr || userErr || ACsubmsErr}
				</Error>
			</div>
		);
	}

	const betterThan = Math.round(((users.length - user.data.top) / users.length) * 100);

	return (
		<div className="min-h-[100vh] space-y-6">
			<div className="*:bg-base-100 *:shadow-shadow-color/3 flex flex-wrap gap-6 *:rounded-xl *:p-6 *:shadow-lg">
				<div className="flex min-w-[280px] flex-1 flex-col items-center">
					<div className="relative">
						<UserAvatar className="!size-[120px]" user={user.data} />
						{user.data.top <= 3 && <div className="absolute bottom-1 right-0 size-10 text-5xl">{user.data.top === 1 ? '🥇' : user.data.top === 2 ? '🥈' : '🥉'}</div>}
					</div>
					<h2 className="text-base-content mt-4 text-lg font-semibold">{user.data.fullname}</h2>
					<p className="text-base-content/90 text-sm font-light">@{user.data.name}</p>
				</div>
				<div className="flex-1 space-y-2">
					<h2 className="text-base-content mb-4 text-lg font-semibold capitalize">{t('profile-information')}</h2>
					{user.data.fullname && (
						<div className="text-base-content flex items-center gap-4 text-sm font-light">
							<User size="16" strokeWidth={1.5} />
							{user.data.fullname}
						</div>
					)}
					<div className="text-base-content flex items-center gap-4 text-sm font-light">
						<Mail size="16" strokeWidth={1.5} />
						{user.data.email}
					</div>
					<div className="text-base-content flex items-center gap-4 text-sm font-light capitalize">
						<Calendar size="16" strokeWidth={1.5} />

						{`${t('joined')} ${new Intl.DateTimeFormat('vi-VN', {
							day: '2-digit',
							month: '2-digit',
							year: 'numeric',
						}).format(new Date(user.data.createdAt))}`}
					</div>
					<div className="text-base-content flex items-center gap-4 text-sm font-light capitalize">
						<Activity size="16" strokeWidth={1.5} />
						{`${t('last-active')} ${
							user.data.lastLogin
								? new Intl.DateTimeFormat('vi-VN', {
										day: '2-digit',
										month: '2-digit',
										year: 'numeric',
										hour: '2-digit',
										minute: '2-digit',
									}).format(new Date(user.data.lastLogin))
								: '--:-- --/--/----'
						}`}
					</div>
					<div className="text-base-content flex items-center gap-4 text-sm font-light capitalize">
						<ShieldUser size="16" strokeWidth={1.5} />
						{t(user.data.permission.toLowerCase())}
					</div>
				</div>
			</div>
			{user.data.bio && (
				<div className="bg-base-100 shadow-shadow-color/3 w-full rounded-xl p-6 shadow-lg">
					<h2 className="text-base-content mb-4 text-lg font-semibold capitalize">{t('about')}</h2>
					<Markdown components={markdownComponents}>{user.data.bio}</Markdown>
				</div>
			)}
			<div className="from-primary to-secondary flex justify-between gap-10 rounded-xl bg-gradient-to-r px-6 py-4">
				<div>
					<p className="text-sm capitalize text-white/80">{t('total-score')}</p>
					<h2 className="text-2xl font-black text-white">{user.data.totalScore}</h2>
				</div>
				<div className="max-w-64 flex-1">
					<p className="mb-2 text-right text-sm capitalize text-white/80">
						{t('better-than')} <span className="font-bold text-white">{betterThan}%</span> {t('user')}
					</p>
					<Progress className="bg-base-content/10" barProps={{ className: 'bg-white' }} size="lg" value={betterThan} />
				</div>
			</div>
			<div className="*:bg-base-100 *:shadow-shadow-color/3 grid grid-cols-2 grid-rows-4 gap-6 *:col-span-2 *:flex *:items-center *:justify-between *:rounded-xl *:p-4 *:shadow-lg sm:*:col-span-1 sm:*:row-span-2">
				<div>
					<div>
						<div className="text-base-content text-2xl font-black">{user.data.totalAC}</div>
						<p className="text-base-content/70 text-sm capitalize">{t('solved')}</p>
					</div>
					<CircleCheckBig className="text-success" size={32} />
				</div>
				<div>
					<div>
						<div className="text-base-content text-2xl font-black">{submissions.data.length || 0}</div>
						<p className="text-base-content/70 text-sm capitalize">{t('submissions')}</p>
					</div>
					<Code className="text-secondary" size={32} />
				</div>
				<div>
					<div>
						<div className="text-base-content text-2xl font-black">{Math.round((user.data.totalAC / user.data.totalAttempt) * 1000) / 10 || 0}%</div>
						<p className="text-base-content/70 text-sm capitalize">{t('acceptance')}</p>
					</div>
					<TrendingUp className="text-primary" size={32} />
				</div>
				<div>
					<div>
						<div className="text-base-content text-2xl font-black">{user.data.joinedContest.length || 0}</div>
						<p className="text-base-content/70 text-sm capitalize">{t('contests')}</p>
					</div>
					<Trophy className="text-warning" size={32} />
				</div>
			</div>
			<div className="bg-base-100 shadow-shadow-color/3 rounded-xl p-6 shadow-lg">
				<h2 className="text-base-content text-lg font-semibold capitalize">{t('problem-solving-stats')}</h2>
				<div className="*:flex-center mt-4 grid grid-cols-3 grid-rows-3 gap-4 *:col-span-3 *:flex-col *:rounded-lg *:p-4 *:capitalize sm:*:col-span-1 sm:*:row-span-3">
					<div className="bg-success/10 text-success-content">
						<h3 className="text-3xl font-black">{user.problems.easy}</h3>
						<p>{t('easy')}</p>
					</div>
					<div className="bg-warning/10 text-warning-content">
						<h3 className="text-3xl font-black">{user.problems.medium}</h3>
						<p>{t('medium')}</p>
					</div>
					<div className="bg-error/10 text-error-content">
						<h3 className="text-3xl font-black">{user.problems.hard}</h3>
						<p>{t('hard')}</p>
					</div>
				</div>
			</div>
			<div className="flex flex-wrap gap-6">
				<div className="bg-base-100 shadow-shadow-color/3 min-w-md flex-1 rounded-xl p-6 shadow-lg">
					<h2 className="text-base-content mb-2 text-lg font-semibold capitalize">{t('languages')}</h2>
					<Chart
						series={[
							{ data: submissions.stat.language, name: capitalize(t('total')) },
							{ data: ACsubms.stat.language, name: capitalize(t('accepted')) },
						]}
						type="bar"
						options={{
							chart: {
								toolbar: {
									show: false,
								},
								foreColor: 'var(--color-base-content)',
							},
							tooltip: {
								theme,
							},
							xaxis: { categories: ['c', 'c11', 'c++11', 'c++14', 'c++17', 'c++20', 'python2', 'python3'].map((item) => capitalize(item)) },
						}}
					/>
				</div>
				<div className="bg-base-100 shadow-shadow-color/3 min-w-md flex-1 rounded-xl p-6 shadow-lg">
					<h2 className="text-base-content mb-2 text-lg font-semibold capitalize">{t('status')}</h2>
					<div className="mx-auto max-w-[420px]">
						<Chart
							type="pie"
							series={submissions.stat.status}
							options={{
								labels: ['AC', 'WA', 'TLE', 'MLE', 'RTE', 'CE', 'IE'],
								colors: ['AC', 'WA', 'TLE', 'MLE', 'RTE', 'CE', 'IE'].map((item) => statusColors[item.toLowerCase()]),
								legend: {
									position: 'bottom',
								},
								chart: {
									foreColor: 'var(--color-base-content)',
								},
							}}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default UserId;
