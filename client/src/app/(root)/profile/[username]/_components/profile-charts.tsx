'use client';

import { useTranslations } from 'next-intl';
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

import { ChartContainer, ChartTooltip, ChartTooltipContent } from '~/components/ui/chart';
import { User } from '~/types/user.type';

// Process submissions to create rating history data
const processRatingHistory = (user: User | undefined) => {
	if (!user || !user.rating || user.rating.length === 0) {
		return [];
	}

	return user.rating.map((rating, index) => ({
		index,
		rating,
	}));
};

interface ProfileChartsProps {
	user: User | undefined;
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

export const ProfileCharts = ({ user, difficultyData, ratingHistoryData, languageData }: ProfileChartsProps) => {
	const chartRatingData = ratingHistoryData && ratingHistoryData.length > 0 ? ratingHistoryData : processRatingHistory(user);
	const t = useTranslations('profile.content');

	return (
		<div className="space-y-6">
			{/* Rating Chart */}
			<div className="bg-card rounded-2xl border p-3 shadow-xs sm:p-6">
				<h3 className="mb-4 text-base font-semibold sm:text-lg">{t('rating_history')}</h3>
				<ChartContainer
					config={{
						rating: {
							label: 'Rating',
							color: 'hsl(var(--primary))',
						},
					}}
					className="h-60 w-full sm:h-80"
				>
					<LineChart data={chartRatingData}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="index" />
						<YAxis />
						<ChartTooltip content={<ChartTooltipContent />} />
						<Line type="monotone" dataKey="rating" activeDot={{ r: 8 }} name="Rating" />
					</LineChart>
				</ChartContainer>
			</div>

			{/* AC Problems by Difficulty */}
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				<div className="bg-card rounded-2xl border p-3 pl-0 shadow-xs sm:p-6">
					<h3 className="mb-4 ml-3 text-base font-semibold sm:ml-6 sm:text-lg">{t('problems_by_difficulty')}</h3>
					<ChartContainer
						config={{
							count: { label: 'Problems', color: 'hsl(var(--primary))' },
						}}
						className="h-48 w-full sm:h-60"
					>
						<BarChart data={difficultyData || []}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="difficulty" />
							<YAxis />
							<ChartTooltip content={<ChartTooltipContent />} />
							<Bar dataKey="count" name="Problems" fill="#3B82F6" />
							{/* #3B82F6 = Tailwind blue-500 */}
						</BarChart>
					</ChartContainer>
				</div>
				{/* AC submission by Language */}
				<div className="bg-card rounded-2xl border p-3 pl-0 shadow-xs sm:p-6">
					<h3 className="mb-4 ml-3 text-base font-semibold sm:ml-6 sm:text-lg">{t('submissions_by_language')}</h3>
					<ChartContainer
						config={{
							count: { label: 'Submissions', color: 'hsl(var(--primary))' },
						}}
						className="h-48 w-full sm:h-60"
					>
						<BarChart data={languageData || []}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="language" />
							<YAxis />
							<ChartTooltip content={<ChartTooltipContent />} />
							<Bar dataKey="count" name="AC Submissions" fill="#3B82F6" />
						</BarChart>
					</ChartContainer>
				</div>
			</div>
		</div>
	);
};
