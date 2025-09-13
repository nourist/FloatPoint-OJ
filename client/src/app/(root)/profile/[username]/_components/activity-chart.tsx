import { getTranslations } from 'next-intl/server';
import { cookies } from 'next/headers';
import ActivityCalendar from 'react-activity-calendar';

import { SubmissionActivityData } from '~/services/submission';
import { Theme } from '~/types/theme.type';

// Type guard cho Date
function isDate(value: unknown): value is Date {
	return value instanceof Date;
}

// Type guard cho object có key date hoặc value
function isDateLikeObject(value: unknown): value is { date?: string | Date; value?: string } {
	return typeof value === 'object' && value !== null;
}

// Transform activity data for react-activity-calendar
const transformActivityData = (activityData: SubmissionActivityData[]) => {
	if (!activityData || !Array.isArray(activityData)) {
		console.warn('Invalid activity data:', activityData);
		return generateFallbackData();
	}

	const validData = activityData
		.map((day, index) => {
			let dateStr: string | null = null;

			try {
				if (!day.date) return null;

				if (isDate(day.date)) {
					dateStr = day.date.toISOString().split('T')[0];
				} else if (typeof day.date === 'string') {
					// Nếu có dạng YYYY-MM-DD hoặc ISO string
					if (/^\d{4}-\d{2}-\d{2}/.test(day.date)) {
						dateStr = day.date.split('T')[0];
					} else {
						const parsed = new Date(day.date);
						if (!isNaN(parsed.getTime())) {
							dateStr = parsed.toISOString().split('T')[0];
						}
					}
				} else if (isDateLikeObject(day.date)) {
					const dateObj = day.date as { date?: string | Date; value?: string };
					if (isDate(dateObj.date)) {
						dateStr = dateObj.date.toISOString().split('T')[0];
					} else if (typeof dateObj.date === 'string') {
						dateStr = dateObj.date.split('T')[0];
					} else if (typeof dateObj.value === 'string') {
						dateStr = dateObj.value.split('T')[0];
					}
				}
			} catch (e) {
				console.warn(`Error parsing date at index ${index}:`, day.date, e);
				return null;
			}

			if (!dateStr) {
				console.warn(`Invalid date at index ${index}:`, day.date);
				return null;
			}

			return {
				date: dateStr,
				count: Math.max(0, Number(day.count) || 0),
				level: Math.max(0, Math.min(4, Number(day.level) || 0)), // đảm bảo 0–4
			};
		})
		.filter((item): item is { date: string; count: number; level: number } => item !== null);

	if (validData.length === 0) {
		console.warn('No valid activity data after filtering, using fallback');
		return generateFallbackData();
	}

	return validData;
};

// Generate fallback data for past year to prevent empty data error
const generateFallbackData = () => {
	const data = [];
	const today = new Date();
	const oneYearAgo = new Date(today);
	oneYearAgo.setFullYear(today.getFullYear() - 1);

	for (let d = new Date(oneYearAgo); d <= today; d.setDate(d.getDate() + 1)) {
		data.push({
			date: d.toISOString().split('T')[0],
			count: 0,
			level: 0,
		});
	}

	return data;
};

interface ActivityChartProps {
	activityData?: {
		activityData: SubmissionActivityData[];
		totalSubmissions: number;
		totalAccepted: number;
	};
}

export const ActivityChart = async ({ activityData }: ActivityChartProps) => {
	const theme = (await cookies()).get('theme')?.value as Theme;
	const t = await getTranslations('profile.content');

	return (
		<div className="bg-card rounded-2xl border p-3 shadow-xs sm:p-6">
			<h3 className="mb-4 text-base font-semibold sm:text-lg">{t('submission_activity')}</h3>
			{activityData?.activityData && activityData.activityData.length > 0 ? (
				<div className="space-y-4">
					<div className="text-muted-foreground flex flex-col gap-2 text-xs sm:flex-row sm:items-center sm:justify-between sm:text-sm">
						<span>
							{activityData.totalSubmissions} {t('submissions_in_year')}
						</span>
						<span>
							{activityData.totalAccepted} {t('accepted')}
						</span>
					</div>
					<div className="w-full overflow-x-auto">
						<div className="flex min-w-[320px] justify-center">
							<ActivityCalendar
								data={transformActivityData(activityData.activityData)}
								blockSize={12}
								blockMargin={3}
								fontSize={10}
								showWeekdayLabels
								colorScheme={theme}
								theme={{
									light: [
										'#dbd9de',
										'#c6f6d5', // green.100
										'#9ae6b4', // green.200
										'#68d391', // green.300
										'#38a169', // green.500
									],
									dark: [
										'#2c2a2e',
										'#22543d', // green.800
										'#276749', // green.700
										'#2f855a', // green.600
										'#38a169', // green.500
									],
								}}
							/>
						</div>
					</div>
				</div>
			) : (
				<div className="space-y-4">
					<div className="text-muted-foreground flex flex-col gap-2 text-xs sm:flex-row sm:items-center sm:justify-between sm:text-sm">
						<span>0 {t('submissions_in_year')}</span>
						<span>0 {t('accepted')}</span>
					</div>
					<div className="w-full overflow-x-auto">
						<div className="flex min-w-[320px] justify-center">
							<ActivityCalendar
								data={generateFallbackData()}
								blockSize={12}
								blockMargin={3}
								fontSize={10}
								showWeekdayLabels
								colorScheme={theme}
								theme={{
									light: [
										'#dbd9de',
										'#c6f6d5', // green.100
										'#9ae6b4', // green.200
										'#68d391', // green.300
										'#38a169', // green.500
									],
									dark: [
										'#2c2a2e',
										'#22543d', // green.800
										'#276749', // green.700
										'#2f855a', // green.600
										'#38a169', // green.500
									],
								}}
							/>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};
