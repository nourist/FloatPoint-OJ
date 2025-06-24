import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Timeline, TimelineItem, TimelineConnector, TimelineHeader, TimelineIcon, TimelineBody, Typography } from '@material-tailwind/react';

import Error from './Error';
import { getNewestActivities } from '~/services/stat';

const NewestActivitiesCard = () => {
	const { t } = useTranslation('dashboard');

	const { data: newestActivities, error: newestActivitiesErr } = useQuery({
		queryKey: ['newestActivities'],
		queryFn: getNewestActivities,
	});

	const getMessage = (item) => {
		if (item.type == 'user') return `${t('user')} ${item.author} ${t('has-registered-to')} FloatPoint`;
		else return `${t('user')} ${item.author} ${t('success-solve')} #${item.problem}`;
	};

	return (
		<div className="bg-base-100 shadow-shadow-color/5 h-[445px] w-full rounded-xl p-6 pt-5 shadow-lg xl:flex-1">
			{newestActivitiesErr ? (
				<Error keys={[['newestActivities']]}>{newestActivitiesErr}</Error>
			) : (
				<>
					<h2 className="text-base-content mb-8 font-semibold capitalize">
						{t('newest-activities')}
						{newestActivities?.today && newestActivities?.today !== 0 && <span className="text-success ml-3">+{newestActivities?.today}</span>}
					</h2>
					<Timeline>
						{newestActivities?.data?.map((item, index) => (
							<TimelineItem key={index}>
								<TimelineConnector />
								<TimelineHeader className="text-base-content/90 h-3 text-sm font-semibold">
									<TimelineIcon data-type={item.type} className="bg-accent data-[type=user]:bg-secondary" />
									{getMessage(item)}
								</TimelineHeader>
								<TimelineBody className="text-base-content/50 pb-7 text-xs !font-black">
									{`${new Date(item.when).toLocaleDateString('vi-VN', {
										day: '2-digit',
										month: '2-digit',
									})} - ${new Date(item.when).toLocaleTimeString('vi-VN', {
										hour: '2-digit',
										minute: '2-digit',
										hour12: false,
									})}`}
								</TimelineBody>
							</TimelineItem>
						))}
						<TimelineItem>
							<TimelineHeader className="text-base-content/60 h-3 text-sm font-semibold capitalize">
								<TimelineIcon className="bg-base-content/20" />
								{t('recording')}...
							</TimelineHeader>
						</TimelineItem>
					</Timeline>
				</>
			)}
		</div>
	);
};

export default NewestActivitiesCard;
