import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Skeleton } from '../ui/skeleton';
import { toast } from 'react-toastify';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';

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

	if (loading) return Skeleton({ className: 'aspect-[5/3]' });

	const formatedDate = (date) => {
		const datePart = new Intl.DateTimeFormat('vi-VN', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
		}).format(date);

		return datePart;
	};

	const { title, startTime, endTime, problems, participant, standing } = contest;

	const getRank = () => {
		let rank = 0;
		for (let i = 0; i < standing.length; i++) {
			if (standing[i].user === username) {
				rank = i + 1;
				break;
			}
		}
		return rank;
	};

	return (
		<div className="bg-white dark:bg-neutral-700 dark:border-neutral-600 rounded-lg shadow-md p-6 space-y-3 border">
			<Link to={routesConfig.contest.replace(':id', id)} className="text-2xl font-bold text-blue-600 dark:text-blue-500 hover:underline">
				{title}
			</Link>

			<div className="text-sm text-gray-500 dark:text-gray-300">
				{formatedDate(new Date(startTime))} - {formatedDate(new Date(endTime))}
			</div>

			<div className="text-sm text-gray-700 dark:text-gray-200">
				<b className="capitalize">{t('problems')}:</b> {problems.length} {t('problem')}
			</div>
			<div className="text-sm text-gray-700 dark:text-gray-200">
				<b className="capitalize">{t('participants')}:</b> {participant.length} {t('user')}
			</div>
			<div className="text-sm text-gray-700 dark:text-gray-200">
				<b className="capitalize">{t('user-rank')}:</b> {getRank()}
			</div>
		</div>
	);
};

ContestCard.propTypes = {
	id: PropTypes.string.isRequired,
	username: PropTypes.string.isRequired,
};

export default ContestCard;
