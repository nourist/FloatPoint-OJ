import PropTypes from 'prop-types';
import { Progress, Card, CardBody } from '@material-tailwind/react';
import { Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

import CountDown from './CountDown';

const ContestTimeWidget = ({ data }) => {
	const { t } = useTranslation('contest');

	const [progress, setProgress] = useState(0);

	useEffect(() => {
		const timer = setInterval(() => {
			const now = Date.now();
			const totalDuration = new Date(data.endTime || null) - new Date(data.startTime || null);
			const elapsed = now - new Date(data.startTime || null);

			setProgress(Math.min(Math.floor((elapsed / totalDuration) * 100), 100));
		}, 1000);

		return () => clearInterval(timer);
	}, [data]);

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

	return (
		<Card className="bg-base-100 shadow-shadow-color/5 mb-6 overflow-hidden shadow-lg">
			<CardBody className="p-4">
				<div className="flex flex-col items-center justify-between gap-4 md:flex-row">
					<div className="flex items-center gap-3">
						<Clock className="size-5 text-blue-500 dark:text-blue-400" />
						<div>
							<div className="text-sm capitalize text-gray-500 dark:text-gray-300">{t('time-remaining')}</div>
							<div className="font-mono text-2xl font-bold dark:text-gray-50">{<CountDown endTime={new Date(data.endTime || null)} /> || '--:--:--'}</div>
						</div>
					</div>
					<div className="w-full md:w-1/2">
						<Progress value={progress} className="dark:bg-base-300 h-3 w-full" barProps={{ className: 'bg-secondary' }} />
						<div className="mt-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
							<span>{formatStartTime(data?.startTime || new Date())}</span>
							<span>{formatStartTime(data?.endTime || new Date())}</span>
						</div>
					</div>
				</div>
			</CardBody>
		</Card>
	);
};

ContestTimeWidget.propTypes = {
	data: PropTypes.object.isRequired,
};

export default ContestTimeWidget;
