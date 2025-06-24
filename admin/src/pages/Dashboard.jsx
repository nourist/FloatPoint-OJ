import StatCard from '~/components/StatCard';
import WeeklyAcceptedCard from '~/components/WeeklyAcceptedCard';
import WeeklySubmissionsCard from '~/components/WeeklySubmissionsCard';
import MonthlySubmissionsCard from '~/components/MonthlySubmissionsCard';
import MonthlyLanguagesCard from '~/components/MonthlyLanguagesCard';
import NewestActivitiesCard from '~/components/NewestActivitiesCard';

const Dashboard = () => {
	return (
		<div className="min-h-[100vh] space-y-6">
			<StatCard />
			<div className="flex flex-row flex-wrap gap-6">
				<WeeklyAcceptedCard />
				<WeeklySubmissionsCard />
			</div>
			<div className="flex flex-wrap gap-6">
				<MonthlySubmissionsCard />
				<MonthlyLanguagesCard />
				<NewestActivitiesCard />
			</div>
		</div>
	);
};

export default Dashboard;
