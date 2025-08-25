import { useTranslations } from 'next-intl';
import { Pie, PieChart } from 'recharts';

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '~/components/ui/chart';
import { LanguageOption, getLanguageColor } from '~/lib/language-utils';
import { getSubmissionStatusVarColor } from '~/lib/status-utils';
import { cn } from '~/lib/utils';
import { ProgramLanguage, SubmissionStatus } from '~/types/submission.type';

interface Props {
	statusStatistics?: { status: string; count: number }[];
	languageStatistics?: { language: string; count: number }[];
}

const SubmissionChart = ({ statusStatistics = [], languageStatistics = [] }: Props) => {
	const t = useTranslations('submission');

	const statusConfig = statusStatistics?.reduce((acc, cur, index) => {
		acc[cur.status] = {
			label: t(`status.${cur.status}`),
		};
		return acc;
	}, {} as ChartConfig);

	return (
		<div className="max-lg:hidden lg:w-70">
			<div className="bg-card rounded-2xl border px-2 pt-6 pb-2 shadow-xs">
				<h2 className="-mb-4 text-center text-lg font-semibold">{t('chart.status')}</h2>
				<ChartContainer config={statusConfig as ChartConfig} className="mx-auto aspect-square max-h-full w-full">
					<PieChart>
						<ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
						<Pie
							data={statusStatistics.map((item) => ({
								...item,
								fill: getSubmissionStatusVarColor(item.status as SubmissionStatus),
							}))}
							dataKey="count"
							nameKey="status"
						/>
					</PieChart>
				</ChartContainer>
				<h2 className="mt-2 -mb-4 text-center text-lg font-semibold">{t('chart.languages')}</h2>
				<ChartContainer config={statusConfig as ChartConfig} className="mx-auto aspect-square max-h-full w-full">
					<PieChart>
						<ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
						<Pie
							data={languageStatistics.map((item) => ({
								...item,
								fill: getLanguageColor(item.language as ProgramLanguage),
							}))}
							dataKey="count"
							nameKey="language"
						/>
					</PieChart>
				</ChartContainer>
			</div>
		</div>
	);
};

export default SubmissionChart;
