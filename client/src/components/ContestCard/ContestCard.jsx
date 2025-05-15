import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Skeleton } from '../ui/skeleton';
import { toast } from 'react-toastify';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { CalendarDays, Users, ListChecks, Award } from 'lucide-react';

import { getContest } from '~/services/contest';
import routesConfig from '~/config/routes';

const ContestCard = ({ id, username }) => {
	const { t } = useTranslation('user');

	const [contest, setContest] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(true);
		getContest(id)
			.then((res) => setContest(res.data))
			.catch((err) => toast.error(err.response.data.msg))
			.finally(() => setLoading(false));
	}, [id]);

	const formatedDate = (date) => {
		return new Intl.DateTimeFormat('vi-VN', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
		}).format(new Date(date));
	};

	const getRank = () => {
		if (!contest?.standing) return 'N/A';
		for (let i = 0; i < contest.standing.length; i++) {
			if (contest.standing[i].user === username) {
				return i + 1;
			}
		}
		return 'N/A';
	};

	if (loading) {
		return (
			<div className="h-full w-full rounded-xl bg-white p-6 shadow-md dark:bg-neutral-800">
				<Skeleton className="mb-4 h-7 w-3/4" />
				<Skeleton className="mb-6 h-4 w-1/2" />
				<div className="space-y-3">
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-full" />
				</div>
			</div>
		);
	}

	if (!contest) {
		return (
			<div className="flex items-center justify-center space-y-3 rounded-xl bg-white p-6 shadow-md dark:bg-neutral-800">
				<p className="text-gray-500 dark:text-gray-400">{t('contest-not-found')}</p>
			</div>
		);
	}

	const { title, startTime, endTime, problems = [], participant = [] } = contest;
	const rank = getRank();

	return (
		<div className="flex h-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800">
			<Link to={routesConfig.contest.replace(':id', id)} className="block h-full p-6">
				<h3 className="mb-2 truncate text-xl font-bold text-gray-800 hover:text-blue-600 dark:text-white dark:hover:text-blue-400">{title}</h3>

				<div className="mb-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
					<CalendarDays className="mr-2 h-4 w-4" />
					<span>
						{formatedDate(startTime)} - {formatedDate(endTime)}
					</span>
				</div>

				<div className="space-y-3">
					<div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
						<ListChecks className="mr-2 h-4 w-4 text-blue-500 dark:text-blue-400" />
						<span>
							<span className="font-medium capitalize">{t('problems')}:</span> {problems.length}
						</span>
					</div>

					<div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
						<Users className="mr-2 h-4 w-4 text-green-500 dark:text-green-400" />
						<span>
							<span className="font-medium capitalize">{t('participants')}:</span> {participant.length}
						</span>
					</div>

					<div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
						<Award className="mr-2 h-4 w-4 text-yellow-500 dark:text-yellow-400" />
						<span>
							<span className="font-medium capitalize">{t('user-rank')}:</span>
							<span
								className={`ml-1 ${rank <= 3 ? 'font-bold' : ''} ${
									rank === 1
										? 'text-yellow-600 dark:text-yellow-400'
										: rank === 2
											? 'text-gray-500 dark:text-gray-300'
											: rank === 3
												? 'text-amber-700 dark:text-amber-500'
												: 'text-gray-700 dark:text-gray-300'
								}`}
							>
								{rank}
							</span>
						</span>
					</div>
				</div>
			</Link>
		</div>
	);
};

ContestCard.propTypes = {
	id: PropTypes.string.isRequired,
	username: PropTypes.string.isRequired,
};

export default ContestCard;
