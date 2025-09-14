'use client';

import { Clock } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { Progress } from '~/components/ui/progress';
import { Contest, ContestStatus, getContestStatus } from '~/types/contest.type';

interface TimeRemainingProps {
	contest: Contest;
}

export const TimeRemaining = ({ contest }: TimeRemainingProps) => {
	const t = useTranslations('contest.detail');
	const [timeLeft, setTimeLeft] = useState('');
	const [progress, setProgress] = useState(0);

	const contestStatus = getContestStatus(contest);

	useEffect(() => {
		if (contestStatus !== ContestStatus.RUNNING) return;

		const interval = setInterval(() => {
			const now = new Date().getTime();
			const startTime = new Date(contest.startTime).getTime();
			const endTime = new Date(contest.endTime).getTime();
			const duration = endTime - startTime;
			const remaining = endTime - now;

			if (remaining <= 0) {
				setTimeLeft('00:00:00');
				setProgress(100);
				clearInterval(interval);
				return;
			}

			const hours = Math.floor(remaining / (1000 * 60 * 60));
			const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
			const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

			setTimeLeft(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);

			const elapsedTime = now - startTime;
			setProgress((elapsedTime / duration) * 100);
		}, 1000);

		return () => clearInterval(interval);
	}, [contest, contestStatus]);

	if (contestStatus !== ContestStatus.RUNNING) {
		return null;
	}

	return (
		<div className="bg-card rounded-2xl border p-4 shadow-xs">
			<div className="flex flex-col items-center justify-between gap-4 md:flex-row">
				<div className="flex items-center gap-3">
					<Clock className="size-5 text-blue-500" />
					<div>
						<div className="text-muted-foreground text-sm capitalize">{t('time_remaining')}</div>
						<div className="font-mono text-2xl font-bold">{timeLeft || '--:--:--'}</div>
					</div>
				</div>
				<div className="w-full md:w-1/2">
					<Progress value={progress} className="h-3 w-full" />
					<div className="text-muted-foreground mt-1 flex justify-between text-xs">
						<span>{new Date(contest.startTime).toLocaleString()}</span>
						<span>{new Date(contest.endTime).toLocaleString()}</span>
					</div>
				</div>
			</div>
		</div>
	);
};
