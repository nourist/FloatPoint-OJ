import { ActivityChart } from './activity-chart';
import { ProfileCharts } from './profile-charts';
import { SubmissionActivityData } from '~/services/submission';
import { UserStatistics } from '~/services/user';
import { Submission } from '~/types/submission.type';
import { User } from '~/types/user.type';

interface ProfileContentProps {
	user: User | undefined;
	stats: UserStatistics | undefined;
	submissions: Submission[];
	currentUser?: User | null;
	activityData?: {
		activityData: SubmissionActivityData[];
		totalSubmissions: number;
		totalAccepted: number;
	};
	difficultyData?: Array<{
		difficulty: string;
		count: number;
	}>;
	ratingHistoryData?: Array<{
		date: string;
		rating: number;
	}>;
	languageData?: Array<{
		language: string;
		count: number;
	}>;
}

export const ProfileContent = ({ user, activityData, difficultyData, ratingHistoryData, languageData }: ProfileContentProps) => {
	return (
		<div className="space-y-6">
			{/* Submission Activity Chart - Server Component */}
			<ActivityChart activityData={activityData} />

			{/* Rating and Difficulty Charts - Client Component */}
			<ProfileCharts user={user} difficultyData={difficultyData} ratingHistoryData={ratingHistoryData} languageData={languageData} />
		</div>
	);
};
