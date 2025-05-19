import { useTranslation } from 'react-i18next';

import StatCard from '~/components/StatCard';
import WeeklyAcceptedCard from '~/components/WeeklyAcceptedCard';
import WeeklySubmissionsCard from '~/components/WeeklySubmissionsCard';
import MonthlySubmissionsCard from '~/components/MonthlySubmissionsCard';

const Dashboard = () => {
	const { t } = useTranslation('dashboard');

	return (
		<div className="min-h-[100vh] space-y-6">
			<StatCard />
			<div className="flex flex-row flex-wrap gap-6">
				<WeeklyAcceptedCard />
				<WeeklySubmissionsCard />
			</div>
			<div className="flex flex-wrap gap-6">
				<MonthlySubmissionsCard />
				<div className="bg-base-100 shadow-shadow-color/5 min-h-40 w-full rounded-xl shadow-lg md:flex-1 xl:max-w-80"></div>
				<div className="bg-base-100 shadow-shadow-color/5 min-h-40 w-full rounded-xl shadow-lg xl:flex-1"></div>
			</div>
		</div>
	);
};

export default Dashboard;
